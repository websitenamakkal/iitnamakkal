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
  const loginBtns = document.querySelectorAll('button[data-action="login"]');
  const logoutBtns = document.querySelectorAll('button[data-action="logout"]');
  const signupBtns = document.querySelectorAll('button[data-action="signup"]');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const welcomeUserName = document.getElementById('welcomeUserName');
  const signedInBadges = document.querySelectorAll('[data-status="signed-in"]');

  if (signedUser) {
    signedInBadges.forEach(badge => {
      badge.innerHTML = `<i class="bi bi-person-circle"></i> ${signedUser.fullname || signedUser.name}`;
      badge.classList.remove('hide');
    });
    logoutBtns.forEach(btn => btn.classList.remove('hide'));
    loginBtns.forEach(btn => btn.classList.add('hide'));
    signupBtns.forEach(btn => btn.classList.add('hide'));

    // Show welcome message with user's name if on index.html
    if (welcomeMessage && welcomeUserName) {
      welcomeUserName.textContent = signedUser.fullname || signedUser.name;
      welcomeMessage.classList.remove('hide');
    }
  } else {
    signedInBadges.forEach(badge => badge.classList.add('hide'));
    logoutBtns.forEach(btn => btn.classList.add('hide'));
    loginBtns.forEach(btn => btn.classList.remove('hide'));
    signupBtns.forEach(btn => btn.classList.remove('hide'));

    // Hide welcome message
    if (welcomeMessage) {
      welcomeMessage.classList.add('hide');
    }
  }
};

// --- Global Auth Modal Functions ---

function injectAuthModal() {
  if (document.getElementById('authModal')) return;

  const modalHtml = `
    <div class="auth-modal-overlay" id="authModal">
      <div class="auth-card">
        <h2 id="modalTitle">Login Form</h2>

        <div class="form-toggle">
          <button type="button" class="toggle-btn active" id="loginTab" onclick="switchTab('login')">Login</button>
          <button type="button" class="toggle-btn" id="signupTab" onclick="switchTab('signup')">Signup</button>
        </div>

        <!-- Login Form -->
        <form id="login-form">
          <div class="form-group">
            <input type="email" id="login-email" placeholder="Email Address" required>
          </div>
          <div class="form-group">
            <input type="password" id="login-password" placeholder="Password" required>
          </div>
          <a href="https://forms.gle/Z4yqiBH2hLa1cK567" class="forgot-password" target="_blank">Forgot Admin password?</a>
          <button type="submit" class="auth-btn">Login</button>
        </form>

        <!-- Signup Form (Hidden by default) -->
        <form id="signup-form" style="display: none;">
          <div class="form-group">
            <input type="text" id="signup-fullname" placeholder="Full Name" required>
          </div>
          <div class="form-group">
            <input type="email" id="signup-email" placeholder="Email Address" required>
          </div>
          <div class="form-group">
            <input type="password" id="signup-password" placeholder="Password" required>
          </div>
          <div class="form-group">
            <input type="password" id="signup-confirm-password" placeholder="Confirm password" required>
          </div>
          <div class="form-group">
            <input type="tel" id="signup-mobile" placeholder="Mobile Number" required>
          </div>
          <div class="form-group">
            <input type="text" id="signup-place" placeholder="Place" required>
          </div>
          <button type="submit" class="auth-btn">Signup</button>
        </form>

        <button class="close-modal-btn" onclick="closeAuthModal()">×</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Re-attach listeners after injection
  attachAuthListeners();
}

window.openAuthModal = function (mode = 'login') {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.style.display = 'flex';
    switchTab(mode);
  }
}

window.closeAuthModal = function () {
  const modal = document.getElementById('authModal');
  if (modal) modal.style.display = 'none';
}

window.switchTab = function (mode) {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const title = document.getElementById('modalTitle');

  if (!loginForm || !signupForm) return;

  if (mode === 'login') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    title.textContent = 'Login Form';
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    title.textContent = 'Signup Form';
  }
}

function attachAuthListeners() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'authModal') closeAuthModal();
    });
  }

  // Login Logic
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }

      // Admin Login Check
      if (email === "admin-Thiyagu@gmail.com" && password === "IIT@4679&_Thiyagu") {
        sessionStorage.setItem('adminLoggedIn', 'true');
        alert('Welcome Admin!');
        window.location.href = 'admin_dashboard.html';
        return;
      }

      const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Login Successful!');
        closeAuthModal();
        signedUser = user;
        updateAuthState();
        location.reload();
      } else {
        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (!emailExists) {
          if (confirm('User not registered. would you like to Sign Up?')) {
            switchTab('signup');
          }
        } else {
          alert('Invalid password');
        }
      }
    });
  }

  // Signup Logic
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullname = document.getElementById('signup-fullname').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      const confirmPassword = document.getElementById('signup-confirm-password').value.trim();
      const mobile = document.getElementById('signup-mobile').value.trim();
      const place = document.getElementById('signup-place').value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(fullname)) {
        alert('Error: Please enter your real Full Name, not an email address.');
        return;
      }

      if (!fullname || !email || !password || !confirmPassword || !mobile || !place) {
        alert('All fields are required');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        alert('Email already exists!');
        return;
      }

      const newUser = {
        userId: Math.floor(1000 + Math.random() * 9000),
        fullname,
        email: email.toLowerCase(),
        password,
        mobile,
        place,
        purchasedCourses: [],
        accessGranted: false
      };
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      alert('Signup Successful! Please login.');
      switchTab('login');
      document.getElementById('login-email').value = email;
    });
  }
}

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

  // Initialize Auth Modal
  injectAuthModal();

  // Handle stored auth actions
  const authAction = sessionStorage.getItem('authAction');
  if (authAction) {
    sessionStorage.removeItem('authAction');
    openAuthModal(authAction);
  }

  // Global handler for Login/Signup
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'login' || action === 'signup') {
      openAuthModal(action);
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
