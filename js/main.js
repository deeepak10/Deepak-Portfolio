const popupContainer = document.getElementById('popup-container');
const popupBox = document.getElementById('popup-box');
const filler = document.getElementById('filler');
const portfolioText = document.getElementById('portfolio-text');

window.addEventListener('DOMContentLoaded', function() {
    
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

// Listen for the form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the page from reloading
    
    // Show the success modal
    successModal.classList.remove('opacity-0', 'pointer-events-none');
    successModal.classList.add('opacity-100', 'pointer-events-auto');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');

    // Clear the input fields so it's ready for another message
    contactForm.reset();
});

// Close the modal when clicking the button or the blurred background
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
