// JavaScript Logic for Ainzigartig Website

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initEyeTracking();
  initParallax();
  initCalculator();
  initNavbarScroll();
  initMobileMenu();
});

/* 0. Theme Toggle Handler */
function initTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('ainzigartig-theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('ainzigartig-theme', newTheme);
    });
  }
}

/* 1. Interactive Pupil Eye Tracking */
function initEyeTracking() {
  const pupils = document.querySelectorAll('.pupil-follow');
  if (pupils.length === 0) return;

  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    pupils.forEach((pupil) => {
      const rect = pupil.getBoundingClientRect();
      const pupilX = rect.left + rect.width / 2;
      const pupilY = rect.top + rect.height / 2;

      const angle = Math.atan2(mouseY - pupilY, mouseX - pupilX);
      const distance = Math.min(3, Math.hypot(mouseX - pupilX, mouseY - pupilY) / 40);

      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      pupil.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  });
}

/* 2. Parallax floating effect for Hero Art */
function initParallax() {
  const floatingArts = document.querySelectorAll('[data-parallax]');
  if (floatingArts.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    floatingArts.forEach((art) => {
      const speed = parseFloat(art.getAttribute('data-parallax')) || 0.05;
      art.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

/* 3. Interactive KI-ROI Calculator */
function initCalculator() {
  const employees = document.getElementById('employees');
  const hourlyRate = document.getElementById('hourlyRate');
  const hoursPerWeek = document.getElementById('hoursPerWeek');

  const empVal = document.getElementById('empVal');
  const rateVal = document.getElementById('rateVal');
  const hoursVal = document.getElementById('hoursVal');

  const savedHours = document.getElementById('savedHours');
  const savedMoney = document.getElementById('savedMoney');

  if (!employees || !hourlyRate || !hoursPerWeek) return;

  function calculate() {
    const emp = parseInt(employees.value, 10);
    const rate = parseInt(hourlyRate.value, 10);
    const hours = parseInt(hoursPerWeek.value, 10);

    empVal.textContent = emp;
    rateVal.textContent = rate + ' €';
    hoursVal.textContent = hours + ' Std';

    // Calculation logic:
    // AI saving estimate: ~40% efficiency boost on recurring tasks
    const monthlyHoursSaved = Math.round(emp * hours * 4 * 0.4);
    const yearlySavings = Math.round(monthlyHoursSaved * 12 * rate);

    const formattedMoney = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(yearlySavings);

    savedHours.textContent = `${monthlyHoursSaved} Std / Monat`;
    savedMoney.textContent = formattedMoney;
  }

  employees.addEventListener('input', calculate);
  hourlyRate.addEventListener('input', calculate);
  hoursPerWeek.addEventListener('input', calculate);

  calculate();
}

/* 4. Navbar Scroll Effect */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* 5. Mobile Menu Toggle */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (!hamburgerBtn || !navMenu) return;

  function toggleMenu(show) {
    const shouldOpen = show !== undefined ? show : !navMenu.classList.contains('active');
    navMenu.classList.toggle('active', shouldOpen);
    hamburgerBtn.classList.toggle('active', shouldOpen);
    hamburgerBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
  }

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      toggleMenu(false);
    }
  });
}

/* 6. Modal Functions */
window.openContactModal = function() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeContactModal = function() {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.handleFormSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form && success) {
    form.style.display = 'none';
    success.classList.add('show');
  }
};
