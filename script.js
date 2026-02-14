const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const navAnchors = document.querySelectorAll('.nav-links a');
const yearSpan = document.querySelector('#year');
const exploreButtons = document.querySelectorAll('.explore');
const enrollButtons = document.querySelectorAll('.enroll');
const contactForm = document.querySelector('.contact-form');
const signedInBadge = document.querySelector('[data-status="signed-in"]');
const navbar = document.querySelector('.navbar');

let signedUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

const updateAuthState = () => {
  const loginBtn = document.querySelector('button[data-action="login"]');
  const logoutBtn = document.querySelector('button[data-action="logout"]');
  const signupBtn = document.querySelector('button[data-action="signup"]');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const welcomeUserName = document.getElementById('welcomeUserName');

  if (signedUser) {
    signedInBadge.innerHTML = `<i class="bi bi-person-circle"></i> ${signedUser.fullname || signedUser.name}`;
    signedInBadge.classList.remove('hide');
    logoutBtn.classList.remove('hide');
    loginBtn.classList.add('hide');
    signupBtn.classList.add('hide');

    // Show welcome message with user's name
    if (welcomeMessage && welcomeUserName) {
      welcomeUserName.textContent = signedUser.fullname || signedUser.name;
      welcomeMessage.classList.remove('hide');
    }
  } else {
    signedInBadge.classList.add('hide');
    logoutBtn.classList.add('hide');
    loginBtn.classList.remove('hide');
    signupBtn.classList.remove('hide');

    // Hide welcome message
    if (welcomeMessage) {
      welcomeMessage.classList.add('hide');
    }
  }
};

// New Carousel Implementation
"use strict";

let autoPlayInterval;

// Function to move to next slide
function moveNext() {
  let items = document.querySelectorAll(".item");
  if (items.length > 0) {
    document.querySelector(".slide").appendChild(items[0]);
  }
}

// Function to move to previous slide
function movePrev() {
  let items = document.querySelectorAll(".item");
  if (items.length > 0) {
    document.querySelector(".slide").prepend(items[items.length - 1]);
  }
}

// Function to reset auto-play timer
function resetAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
  autoPlayInterval = setInterval(moveNext, 2000);
}

// Initialize carousel
function initCarousel() {
  let next = document.querySelector(".next");
  let prev = document.querySelector(".prev");
  const slide = document.querySelector(".slide");

  if (!next || !prev || !slide) return;

  // Auto-play carousel with 2000ms (2 seconds) interval
  autoPlayInterval = setInterval(moveNext, 3000);

  // Next button click
  next.addEventListener("click", function () {
    moveNext();
    resetAutoPlay();
  });

  // Previous button click
  prev.addEventListener("click", function () {
    movePrev();
    resetAutoPlay();
  });

  // Touch/Swipe support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      // Swipe left - next
      moveNext();
      resetAutoPlay();
    }
    if (touchEndX > touchStartX + 50) {
      // Swipe right - previous
      movePrev();
      resetAutoPlay();
    }
  }

  slide.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slide.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

const toggleNav = () => {
  if (!navPanel) return;
  const isOpen = navPanel.classList.toggle('open');
  navToggle?.classList.toggle('active', isOpen);
};

const closeNav = () => {
  if (!navPanel) return;
  navPanel.classList.remove('open');
  navToggle?.classList.remove('active');
};



// Add event listeners for mobile dropdowns
// (Mobile dropdowns are handled in the DOMContentLoaded block now)

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) {
    closeNav();
  }
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', () => {
    if (window.innerWidth <= 960) {
      closeNav();
    }
  });
});

document.addEventListener('click', (event) => {
  if (window.innerWidth > 960) return;
  if (!navPanel?.classList.contains('open')) return;
  if (
    !navPanel.contains(event.target) &&
    !navToggle?.contains(event.target)
  ) {
    closeNav();
  }
});


const exploreToggles = document.querySelectorAll('.explore-toggle');
exploreToggles.forEach((toggle) => {
  toggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent closing immediately by document click
    const dropdown = toggle.closest('.explore-dropdown');
    dropdown.classList.toggle('active');
  });
});

exploreButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const topic = btn.dataset.topic;
    mailTo(`Explore More - ${topic}`, `Hello IIT,

I would like to explore more about ${topic}. Please share the next steps.

Thanks,
`);
  });
});

enrollButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const course = e.currentTarget.closest('.course').dataset.course;
    mailTo(`Course Enrollment - ${course}`, `Hello IIT,

I want to enroll in the course "${course}".
Name:
Email:
Preferred start date:

Regards,
`);
  });
});



// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// MOU Image Slider Functionality
function initMouImageSlider() {
  const mouSlider = document.getElementById('mouImageSlider');
  const mouPrevBtn = document.querySelector('.mou-prev');
  const mouNextBtn = document.querySelector('.mou-next');

  if (!mouSlider || !mouPrevBtn || !mouNextBtn) return;

  let currentIndex = 0;
  const slides = mouSlider.querySelectorAll('.mou-slide-item');
  const slideWidth = slides[0]?.offsetWidth + 32; // 32px for gap

  const scrollToSlide = (index) => {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    mouSlider.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
  };

  mouPrevBtn.addEventListener('click', () => {
    scrollToSlide(currentIndex - 1);
  });

  mouNextBtn.addEventListener('click', () => {
    scrollToSlide(currentIndex + 1);
  });

  // Auto-scroll functionality
  let autoScrollInterval;
  const startAutoScroll = () => {
    autoScrollInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      scrollToSlide(currentIndex);
    }, 3500);
  };

  // Pause on hover
  mouSlider.addEventListener('mouseenter', () => {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
  });

  mouSlider.addEventListener('mouseleave', () => {
    startAutoScroll();
  });

  // Initialize auto-scroll
  startAutoScroll();

  // Update current index on scroll
  mouSlider.addEventListener('scroll', () => {
    currentIndex = Math.round(mouSlider.scrollLeft / slideWidth);
  });
}

// Observe cards for animation






// Testimonials Slider Functionality
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let autoPlayTestimonial;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i]?.classList.remove('active');
    });

    if (slides[index]) {
      slides[index].classList.add('active');
      dots[index]?.classList.add('active');
    }
    currentSlide = index;
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const startAutoPlay = () => {
    autoPlayTestimonial = setInterval(nextSlide, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayTestimonial) {
      clearInterval(autoPlayTestimonial);
    }
  };

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  // Start auto-play
  if (slides.length > 0) {
    startAutoPlay();
  }

  // Pause on hover
  const testimonialContainer = document.querySelector('.testimonials-container');
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', stopAutoPlay);
    testimonialContainer.addEventListener('mouseleave', startAutoPlay);
  }
}

// Initialize testimonials slider on page load
document.addEventListener('DOMContentLoaded', () => {
  // Basic setup
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (typeof initMouImageSlider === 'function') initMouImageSlider();

  // Animate cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  if (typeof initTestimonialsSlider === 'function') {
    initTestimonialsSlider();
  }

  // Initialize Carousel
  if (typeof initCarousel === 'function') {
    initCarousel();
  }

  // Update Auth State
  updateAuthState();

  // Logout Handler
  const logoutBtn = document.querySelector('button[data-action="logout"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      alert('Logged out successfully');
      signedUser = null;
      updateAuthState();
      window.location.href = 'index.html'; // Redirect to home on logout
    });
  }

  // Global handler for Login/Signup on pages without modal
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'login' || action === 'signup') {
      // If openAuthModal (index.html feature) is missing, redirect to index.html
      if (typeof openAuthModal === 'undefined') {
        // Redirect to index.html and store the intended action in sessionStorage
        sessionStorage.setItem('authAction', action);
        window.location.href = 'index.html';
      }
    }
  });

  // Cross-tab/window logout synchronization
  // Listen for storage changes (e.g., when user logs out in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'loggedInUser') {
      if (e.newValue === null) {
        // User logged out in another tab
        signedUser = null;
        updateAuthState();
        alert('You have been logged out.');
      } else if (e.newValue) {
        // User logged in in another tab
        signedUser = JSON.parse(e.newValue);
        updateAuthState();
      }
    }
  });

  // Navigation Toggle
  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (navPanel && navPanel.classList.contains('open') &&
      !navPanel.contains(e.target) &&
      !navToggle.contains(e.target)) {
      closeNav();
    }
  });

  // Mobile menu sub-menu toggles
  const menuItems = document.querySelectorAll('.menu-item.has-child');
  menuItems.forEach(item => {
    item.addEventListener('click', function (e) {
      if (window.innerWidth <= 1024) {
        // e.preventDefault(); // Optional: depend on desired behavior
        this.classList.toggle('active');
        const subMenu = this.querySelector('.sub-menu');
        if (subMenu) {
          subMenu.style.display = subMenu.style.display === 'flex' ? 'none' : 'flex';
        }
      }
    });
  });
});
