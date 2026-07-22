const popupContainer = document.getElementById('popup-container');
const popupBox = document.getElementById('popup-box');
const filler = document.getElementById('filler');
const portfolioText = document.getElementById('portfolio-text');

window.addEventListener('DOMContentLoaded', function () {

    // 1. Show the box initially
    setTimeout(() => {
        popupContainer.classList.remove('popup-hidden');
        popupContainer.classList.add('popup-visible');

        popupBox.classList.remove('box-hidden');
        popupBox.classList.add('box-visible');
    }, 100);

    // 2. Start the slow black filling animation (left to right)
    setTimeout(() => {
        filler.classList.add('fill-active');
    }, 1200);

    // 3. Expand the box to full screen cleanly
    setTimeout(() => {
        popupBox.classList.add('box-expand');
        portfolioText.classList.add('text-fade-out');
        // Trigger the shift to #1A1A1A while expanding
        filler.classList.add('color-shift');
    }, 3200);

    // 4. Seamlessly transition to the actual scrolling webpage!
    setTimeout(() => {
        const body = document.body;

        // Swap the body to your requested gradient
        body.classList.remove('bg-white', 'justify-center');
        body.classList.add('bg-gradient-to-b', 'from-[#1A1A1A]', 'to-[#302C29]', 'justify-start', 'min-h-[200vh]');

        // Unlock scrolling but strictly prevent horizontal scroll!
        body.classList.remove('overflow-hidden');
        body.classList.add('overflow-x-hidden');

        // Fade out the animation overlay to reveal the identical #1A1A1A top of the page body
        popupContainer.style.opacity = '0';

        // Reveal the scroll indicator
        const mainContent = document.getElementById('main-content');
        mainContent.classList.remove('hidden');
        mainContent.classList.add('flex');

        // Delay fade-in of the text slightly so it's smooth
        setTimeout(() => {
            mainContent.classList.remove('opacity-0');
            mainContent.classList.add('opacity-100');
        }, 50);

        // Delete the opening animation from memory
        setTimeout(() => popupContainer.remove(), 500);
    }, 4000);
});

// 5. Add ultra-smooth scroll-linked fading and parallax effect for ALL pages
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.page-section');
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();

        // Fade out and parallax up as the section scrolls above the viewport
        if (rect.top <= 0) {
            // Calculate delay: if the section is taller than the viewport (such as #skills),
            // wait until we have scrolled through the extra content before beginning to fade out.
            const fadeDelay = Math.max(0, rect.height - windowHeight * 0.75);
            const scrolledPast = Math.abs(rect.top);

            let opacity = 1;
            if (scrolledPast > fadeDelay) {
                // Once past the delay threshold, fade out smoothly over 600px of scrolling
                const distanceToFade = scrolledPast - fadeDelay;
                opacity = 1 - (distanceToFade / 600);
            }

            let translateY = scrolledPast * 0.15;

            if (opacity < 0) opacity = 0;

            section.style.opacity = opacity;
            section.style.transform = `translateY(-${translateY}px)`;
        } else {
            // Reset to normal when the section is in or below the viewport
            section.style.opacity = 1;
            section.style.transform = `translateY(0)`;
        }
    });
});

// 6. Setup the "Emerge" effect for scrolling into new sections
const observerOptions = {
    threshold: 0.1 // Triggers when 10% of the element enters the screen for responsive revealing
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Stop observing once revealed so it doesn't animate out and in repeatedly
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Tell the observer to watch everything with the 'reveal-on-scroll' class
document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
});

const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const modalOverlay = document.getElementById('modal-overlay');

// Function to hide the modal smoothly
function closeModal() {
    successModal.classList.remove('opacity-100', 'pointer-events-auto');
    successModal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
}

// Listen for the form submission and send to Google Forms
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the page from reloading

    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
    }

    const formData = new FormData(contactForm);
    const googleFormsUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSc7fOFGyA5UmUb0Qsfwm70PxQIddQang3umzVGuqbvuWmPtQQ/formResponse';

    fetch(googleFormsUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
    }).then(() => {
        // Show the success modal
        successModal.classList.remove('opacity-0', 'pointer-events-none');
        successModal.classList.add('opacity-100', 'pointer-events-auto');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');

        // Clear the input fields so it's ready for another message
        contactForm.reset();
    }).catch(error => {
        console.error('Error submitting to Google Forms:', error);
        // Even if an error occurs, reveal modal so user receives feedback
        successModal.classList.remove('opacity-0', 'pointer-events-none');
        successModal.classList.add('opacity-100', 'pointer-events-auto');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
        contactForm.reset();
    }).finally(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });
});

// Close the modal when clicking the button or the blurred background
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// 7. Resume Modal, Dynamic PDF Loading & Instant Download Logic
const viewResumeBtn = document.getElementById('view-resume-btn');
const resumeModal = document.getElementById('resume-modal');
const resumeModalContent = document.getElementById('resume-modal-content');
const closeResumeModalBtn = document.getElementById('close-resume-modal');
const resumeModalOverlay = document.getElementById('resume-modal-overlay');
const resumeIframe = document.getElementById('resume-iframe');

if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', (e) => {
        // Detect if user is on mobile view (width < 768px or touch mobile device)
        const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (!isMobile) {
            // In PC view: Prevent opening new tab, pop up the modal box in the same tab showing the PDF
            e.preventDefault();
            // Lock body scroll so scrolling inside the popup box never scrolls the underlying background webpage
            document.body.style.overflow = 'hidden';
            if (resumeIframe && !resumeIframe.src.includes('deepak_dinesh_cv.pdf')) {
                resumeIframe.src = 'assets/deepak_dinesh_cv.pdf#toolbar=0';
            }
            if (resumeModal && resumeModalContent) {
                resumeModal.classList.remove('opacity-0', 'pointer-events-none');
                resumeModal.classList.add('opacity-100', 'pointer-events-auto');
                resumeModalContent.classList.remove('scale-95');
                resumeModalContent.classList.add('scale-100');
            }
        }
        // In mobile view: Let default link behavior trigger redirect to next tab (`target="_blank"`) showing the resume directly
    });
}

function closeResumeModal() {
    if (resumeModal && resumeModalContent) {
        // Restore background webpage scroll
        document.body.style.overflow = '';
        resumeModal.classList.remove('opacity-100', 'pointer-events-auto');
        resumeModal.classList.add('opacity-0', 'pointer-events-none');
        resumeModalContent.classList.remove('scale-100');
        resumeModalContent.classList.add('scale-95');
        setTimeout(() => {
            if (resumeIframe) resumeIframe.src = '';
        }, 300);
    }
}

if (closeResumeModalBtn) {
    closeResumeModalBtn.addEventListener('click', closeResumeModal);
}
if (resumeModalOverlay) {
    resumeModalOverlay.addEventListener('click', closeResumeModal);
    resumeModalOverlay.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
    resumeModalOverlay.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}
if (resumeModal) {
    resumeModal.addEventListener('wheel', (e) => {
        if (resumeIframe && e.target !== resumeIframe && !resumeIframe.contains(e.target)) {
            e.preventDefault();
        }
    }, { passive: false });
    resumeModal.addEventListener('touchmove', (e) => {
        if (resumeIframe && e.target !== resumeIframe && !resumeIframe.contains(e.target)) {
            e.preventDefault();
        }
    }, { passive: false });
}

// 8. Instant Download Forced Logic & Mobile Click Debounce
let isDownloadLocked = false;

function animateDownloadButton(btn) {
    if (!btn || !(btn instanceof HTMLElement)) return;
    btn.blur();
    btn.classList.add('!bg-white', '!text-black', '!border-white', 'scale-95');
    setTimeout(() => {
        btn.classList.remove('!bg-white', '!text-black', '!border-white', 'scale-95');
        btn.blur();
        // Temporarily disable pointer events for 50ms so touch screens (Android/iOS) release any stuck :hover state
        btn.classList.add('pointer-events-none');
        setTimeout(() => {
            btn.classList.remove('pointer-events-none');
        }, 50);
    }, 350);
}

function triggerInstantDownload(url, filename, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget) {
            animateDownloadButton(e.currentTarget);
        }
    }

    // Debounce: prevent rapid double taps / touch-click synthesis from spawning multiple confirmation popups
    if (isDownloadLocked) return;
    isDownloadLocked = true;
    setTimeout(() => { isDownloadLocked = false; }, 1500);

    // Detect if user is on mobile view (width < 768px or touch mobile device)
    const isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // On mobile devices, create a temporary download link and click it once programmatically.
        // Because of e.preventDefault() + our debounce lock, this fires EXACTLY ONE confirmation prompt.
        // When the user clicks Cancel, it clears instantly without staying or requiring multiple clicks!
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'Deepak_Dinesh_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }

    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const hiddenLink = document.createElement('a');
            hiddenLink.style.display = 'none';
            hiddenLink.href = blobUrl;
            hiddenLink.download = filename || 'Deepak_Dinesh_CV.pdf';
            document.body.appendChild(hiddenLink);
            hiddenLink.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(hiddenLink);
        })
        .catch(err => {
            console.warn('Blob fetch failed, using fallback download frame:', err);
            let hiddenIframe = document.getElementById('hidden-download-iframe');
            if (!hiddenIframe) {
                hiddenIframe = document.createElement('iframe');
                hiddenIframe.id = 'hidden-download-iframe';
                hiddenIframe.style.display = 'none';
                document.body.appendChild(hiddenIframe);
            }
            hiddenIframe.src = url;
        });
}

const downloadCvBtn = document.getElementById('download-cv-btn');
const modalDownloadBtn = document.getElementById('modal-download-btn');

if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
        triggerInstantDownload('assets/deepak_dinesh_cv.pdf', 'Deepak_Dinesh_CV.pdf', e);
    });
}
if (modalDownloadBtn) {
    modalDownloadBtn.addEventListener('click', (e) => {
        triggerInstantDownload('assets/deepak_dinesh_cv.pdf', 'Deepak_Dinesh_CV.pdf', e);
    });
}
