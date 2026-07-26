// JavaScript Logic for Ainzigartig Website

document.addEventListener('DOMContentLoaded', () => {
  initEyeTracking();
  initCalculator();
  initNavbarScroll();
  initMobileMenu();
  initScrollReveal();
  initActiveNav();
  initModalAccessibility();
});

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

  function updateSliderFill(slider) {
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--accent-eye) 0%, var(--accent-eye) ${percentage}%, var(--border-light) ${percentage}%, var(--border-light) 100%)`;
  }

  function calculate() {
    const emp = parseInt(employees.value, 10);
    const rate = parseInt(hourlyRate.value, 10);
    const hours = parseInt(hoursPerWeek.value, 10);

    empVal.textContent = emp;
    rateVal.textContent = rate + ' €';
    hoursVal.textContent = hours + ' Std';

    updateSliderFill(employees);
    updateSliderFill(hourlyRate);
    updateSliderFill(hoursPerWeek);

    // Calculation logic: ~40% efficiency boost on recurring tasks
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
  }, { passive: true });
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

  document.querySelectorAll('.nav-link, .nav-mobile-cta').forEach(link => {
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

/* 6. IntersectionObserver Scroll Reveal Animations */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up');
  if (revealElements.length === 0) return;

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    const parentGrid = el.parentElement;
    if (parentGrid && (parentGrid.classList.contains('usecases-grid') || parentGrid.classList.contains('team-bios'))) {
      const childIndex = Array.from(parentGrid.children).indexOf(el);
      el.style.transitionDelay = `${childIndex * 0.08}s`;
    }
    revealObserver.observe(el);
  });
}

/* 7. Active Nav Section Highlighting */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (sections.length === 0 || navLinks.length === 0) return;

  const observerOptions = {
    threshold: 0.3
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => navObserver.observe(section));
}

/* 8. Modal Keyboard & Focus Accessibility */
function initModalAccessibility() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('contactModal');
      if (modal && modal.classList.contains('open')) {
        closeContactModal();
      }
    }
  });
}

// Google Apps Script Web App URL for Lead Logging & Confirmation Emails
// Set this URL after deploying your script in Google Sheets (see GOOGLE_SHEETS_SETUP.md)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzfb4UV-1tZgN9kk0JkH8F3JFI805TgoQzppVb8OqZMjN34fPu9xrnSi3LCy_dZWQOoFg/exec';

let modalOpenedTime = 0;

/* 9. Modal Global Functions */
window.openContactModal = function () {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalOpenedTime = Date.now();

    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const modalHeader = modal.querySelector('.modal-header');

    if (form) form.style.display = 'block';
    if (modalHeader) modalHeader.style.display = 'block';
    if (success) success.classList.remove('show');

    const formError = document.getElementById('formError');
    if (formError) {
      formError.style.display = 'none';
      formError.textContent = '';
    }

    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
  }
};

window.closeContactModal = function () {
  const modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.handleFormSubmit = async function (e) {
  e.preventDefault();

  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const errorBanner = document.getElementById('formError');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;

  if (errorBanner) {
    errorBanner.style.display = 'none';
    errorBanner.textContent = '';
  }

  // 1. Client-Side Required Field Validation
  const firstName = document.getElementById('firstName')?.value.trim() || '';
  const lastName = document.getElementById('lastName')?.value.trim() || '';
  const email = document.getElementById('email')?.value.trim() || '';
  const mobile = document.getElementById('mobile')?.value.trim() || '';
  const company = document.getElementById('company')?.value.trim() || '';
  const message = document.getElementById('message')?.value.trim() || '';
  const gdprConsent = document.getElementById('gdprConsent')?.checked;

  if (!firstName || !lastName || !email || !company) {
    showFormError('Bitte fülle alle Pflichtfelder (*) aus.');
    return;
  }

  if (!gdprConsent) {
    showFormError('Bitte stimme der Verarbeitung deiner Daten gemäß der Datenschutzerklärung zu.');
    return;
  }

  // 2. Anti-Spam Protection Checks
  const hpValue = document.getElementById('hp_website')?.value || '';
  const timeElapsed = Date.now() - modalOpenedTime;

  // Bot Trap A: Honeypot field filled
  if (hpValue.length > 0) {
    console.warn('Spam detected via honeypot field.');
    showFormSuccess();
    return;
  }

  // Bot Trap B: Form submitted unrealistically fast (< 1.2s)
  if (modalOpenedTime > 0 && timeElapsed < 1200) {
    console.warn('Spam detected via fast submission speed.');
    showFormSuccess();
    return;
  }

  // Bot Trap C: Cooldown rate-limit (prevent rapid multi-submits in 10s)
  const lastSubmit = localStorage.getItem('last_lead_submit_time');
  if (lastSubmit && Date.now() - parseInt(lastSubmit, 10) < 10000) {
    showFormError('Bitte warte kurz, bevor du eine weitere Anfrage absendest.');
    return;
  }

  // 3. UI Loading State
  setSubmitLoading(true);

  // 4. Data Payload
  const payload = {
    firstName,
    lastName,
    email,
    mobile,
    company,
    message,
    gdprConsent: true,
    source: 'Website Lead Form',
    submittedAt: new Date().toISOString()
  };

  try {
    // If Web App URL is configured, POST data to Google Apps Script
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('http')) {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });
    } else {
      console.warn('GOOGLE_SCRIPT_URL is not set in main.js. Simulated lead capture:', payload);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    localStorage.setItem('last_lead_submit_time', Date.now().toString());
    showFormSuccess();

  } catch (error) {
    console.error('Form submission error:', error);
    showFormError('Beim Absenden der Anfrage ist ein Fehler aufgetreten. Bitte versuche es erneut oder kontaktiere uns direkt per E-Mail.');
  } finally {
    setSubmitLoading(false);
  }

  function showFormError(msg) {
    if (errorBanner) {
      errorBanner.textContent = msg;
      errorBanner.style.display = 'block';
    }
  }

  function showFormSuccess() {
    if (form && success) {
      form.style.display = 'none';
      const modalHeader = document.querySelector('#contactModal .modal-header');
      if (modalHeader) modalHeader.style.display = 'none';
      success.classList.add('show');
    }
  }

  function setSubmitLoading(isLoading) {
    if (!submitBtn) return;
    if (isLoading) {
      submitBtn.classList.add('btn-loading');
      if (btnText) btnText.textContent = 'Wird gesendet...';
    } else {
      submitBtn.classList.remove('btn-loading');
      if (btnText) btnText.textContent = 'Anfrage absenden';
    }
  }
};
