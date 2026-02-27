// Carousel Functionality
(function () {
    console.log('Initializing Carousel...');

    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let autoPlayInterval;

    // Check if carousel elements exist
    if (slides.length === 0 || dots.length === 0) {
        console.warn('Carousel elements not found on this page.');
        return;
    }

    // Function to show a specific slide
    function showSlide(n) {
        // Update currentSlide based on n
        currentSlide = n;

        // Reset if out of bounds
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Function to move carousel (exposed to window for onclick attributes)
    window.moveCarousel = function (direction) {
        showSlide(currentSlide + direction);
        resetAutoPlay();
    };

    // Function to go to specific slide (exposed to window)
    window.goToSlide = function (n) {
        showSlide(n);
        resetAutoPlay();
    };

    // Auto play carousel
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    // Reset auto play
    function resetAutoPlay() {
        startAutoPlay();
    }

    // Start auto play when page loads
    startAutoPlay();

    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }

    console.log('Carousel initialized successfully.');
})();
