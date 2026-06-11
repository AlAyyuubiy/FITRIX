/* ============================================================
   FITRIX — main.js
   Shared logic used across all pages:
   - Navbar scroll behaviour
   - Mobile hamburger menu toggle
   ============================================================ */


/* ============================================================
   1. NAVBAR — SCROLL BEHAVIOUR
   Adds a solid background once the user scrolls past 40px.
   The .scrolled class and its styles live in style.css
   ============================================================ */

const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}


/* ============================================================
   2. MOBILE HAMBURGER MENU
   Toggles the mobile drawer open/closed.
   Also closes the menu if the user clicks anywhere outside it.
   ============================================================ */

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');

    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking anywhere outside the navbar
  document.addEventListener('click', (e) => {
    const isOutside = !navbar.contains(e.target);
    const isMenuOpen = mobileMenu.classList.contains('open');

    if (isOutside && isMenuOpen) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });
}


/* ============================================================
   3. TESTIMONIALS SLIDER
   - Auto-advances every 5 seconds
   - Prev / Next buttons for manual control
   - Dot indicators sync with the active slide
   - Pauses auto-play while the user is hovering
   ============================================================ */

const track      = document.getElementById('testimonialsTrack');
const dotsWrap   = document.getElementById('testimonialsDots');
const prevBtn    = document.getElementById('testimonialsprev');
const nextBtn    = document.getElementById('testimonialsNext');

if (track && dotsWrap && prevBtn && nextBtn) {

  const slides     = track.querySelectorAll('.testimonial-slide');
  const dots       = dotsWrap.querySelectorAll('.testimonials__dot');
  const total      = slides.length;
  let   current    = 0;
  let   autoTimer  = null;

  /* Move the track to show the slide at `index` */
  function goTo(index) {
    current = (index + total) % total;   // wraps around both ends
    track.style.transform = `translateX(-${current * 100}%)`;

    /* Sync dots */
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current);
    });
  }

  /* Start the 5-second auto-advance timer */
  function startAuto() {
    stopAuto();  // always clear before starting a fresh one
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  /* Clear the timer */
  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  /* Arrow buttons */
  prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  /* Dot buttons */
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.index));
      startAuto();
    });
  });

  /* Pause on hover so the user can read without rushing */
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  /* Touch swipe support for mobile */
  let touchStartX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {         // 50px threshold to register a swipe
      goTo(diff > 0 ? current + 1 : current - 1);
    }
    startAuto();
  }, { passive: true });

  /* Kick everything off */
  goTo(0);
  startAuto();
}


/* ============================================================
   4. FOOTER — AUTO YEAR
   Keeps the copyright year current without touching the HTML
   ============================================================ */

const footerYear = document.getElementById('footerYear');

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}


/* ============================================================
   5. PRICING PAGE — MONTHLY / ANNUAL TOGGLE
   Reads data-monthly and data-annual from each price element
   and swaps the displayed number when the toggle changes.
   ============================================================ */

const monthlyBtn = document.getElementById('monthlyBtn');
const annualBtn  = document.getElementById('annualBtn');

if (monthlyBtn && annualBtn) {

  function setPricing(mode) {
    const amounts = document.querySelectorAll('.pricing-card-full__amount');

    amounts.forEach((el) => {
      el.textContent = mode === 'annual' ? el.dataset.annual : el.dataset.monthly;
    });

    monthlyBtn.classList.toggle('active', mode === 'monthly');
    annualBtn.classList.toggle('active',  mode === 'annual');
    monthlyBtn.setAttribute('aria-pressed', mode === 'monthly');
    annualBtn.setAttribute('aria-pressed',  mode === 'annual');
  }

  monthlyBtn.addEventListener('click', () => setPricing('monthly'));
  annualBtn.addEventListener('click',  () => setPricing('annual'));
}


/* ============================================================
   6. FAQ ACCORDION
   One item open at a time — clicking an open item closes it.
   Uses the native hidden attribute + max-height CSS transition.
   ============================================================ */

const faqList = document.getElementById('faqList');

if (faqList) {

  const questions = faqList.querySelectorAll('.faq-item__question');

  questions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen   = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer   = document.getElementById(answerId);

      /* Close all other open items first */
      questions.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          const otherId     = otherBtn.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });

      /* Toggle the clicked item */
      btn.setAttribute('aria-expanded', !isOpen);
      if (answer) answer.hidden = isOpen;
    });
  });
}


/* ============================================================
   7. CONTACT FORM — VALIDATION & EMAILJS SUBMIT

   EMAILJS CONFIG — replace the two values below with yours:
   Service ID:  EmailJS dashboard > Email Services
   Template ID: EmailJS dashboard > Email Templates
   Public Key is set in contact.html <head>

   Your EmailJS template must contain these variables:
     {{from_name}}   — sender full name
     {{from_email}}  — sender email address
     {{subject}}     — enquiry topic
     {{message}}     — message body
   ============================================================ */

const EMAILJS_SERVICE_ID  = 'service_tmmddmc';   // replace with yours
const EMAILJS_TEMPLATE_ID = 'template_vlsb7di';  // replace with yours

const contactForm = document.getElementById('contactForm');

if (contactForm) {

  /* ---- 1. BLOCK DIGITS IN NAME FIELD ---- */

  var nameInput = document.getElementById('fullName');

  if (nameInput) {
    /* Block digits and special chars as user types */
    nameInput.addEventListener('keydown', function(e) {
      var allowed = /^[A-Za-z\s\-']$/;
      var control = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab','Home','End'];
      if (!allowed.test(e.key) && control.indexOf(e.key) === -1) {
        e.preventDefault();
      }
    });

    /* Strip anything invalid that gets pasted in */
    nameInput.addEventListener('input', function() {
      var cleaned = nameInput.value.replace(/[^A-Za-z\s\-']/g, '');
      if (nameInput.value !== cleaned) {
        nameInput.value = cleaned;
      }
    });
  }


  /* ---- 2. STATUS BOX HELPERS ---- */

  var statusBox = document.getElementById('formStatus');

  function showStatus(type, message) {
    var icons = {
      sending: '<span class="status-spinner"></span>',
      success: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      error:   '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;flex-shrink:0"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
    };
    statusBox.className = 'contact-form__status contact-form__status--' + type;
    statusBox.innerHTML = (icons[type] || '') + '<span>' + message + '</span>';
    statusBox.hidden = false;
  }

  function hideStatus() {
    statusBox.hidden = true;
    statusBox.innerHTML = '';
    statusBox.className = 'contact-form__status';
  }


  /* ---- 3. FIELD VALIDATION ---- */

  function showFieldError(inputId, errorId, message) {
    var el  = document.getElementById(inputId);
    var err = document.getElementById(errorId);
    if (el)  el.classList.add('input--error');
    if (err) err.textContent = message;
  }

  function clearAllErrors() {
    var inputs = contactForm.querySelectorAll('.input--error');
    inputs.forEach(function(el) { el.classList.remove('input--error'); });
    var errors = contactForm.querySelectorAll('.form-field__error');
    errors.forEach(function(el) { el.textContent = ''; });
  }

  function validateForm() {
    clearAllErrors();
    var valid = true;

    /* Full name */
    var nameVal = document.getElementById('fullName').value.trim();
    if (!nameVal) {
      showFieldError('fullName', 'fullNameError', 'Full name is required.');
      valid = false;
    } else if (/[^A-Za-z\s\-']/.test(nameVal)) {
      showFieldError('fullName', 'fullNameError', 'Name must contain letters only.');
      valid = false;
    }

    /* Email */
    var emailVal = document.getElementById('email').value.trim();
    if (!emailVal) {
      showFieldError('email', 'emailError', 'Email address is required.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showFieldError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    }

    /* Subject */
    var subjectVal = document.getElementById('subject').value;
    if (!subjectVal) {
      showFieldError('subject', 'subjectError', 'Please select a subject.');
      valid = false;
    }

    /* Message */
    var messageVal = document.getElementById('message').value.trim();
    if (!messageVal) {
      showFieldError('message', 'messageError', 'Message is required.');
      valid = false;
    }

    return valid;
  }

  /* Clear error on input */
  contactForm.addEventListener('input', function(e) {
    var el = e.target;
    if (el.classList.contains('input--error')) {
      el.classList.remove('input--error');
      var errSpan = document.getElementById(el.id + 'Error');
      if (errSpan) errSpan.textContent = '';
    }
  });


  /* ---- 4. FORM SUBMIT ---- */

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    var submitBtn = document.getElementById('formSubmit');
    var subjectEl = document.getElementById('subject');
    var subjectText = subjectEl.options[subjectEl.selectedIndex].text;

    /* Build params — names match EmailJS template variables exactly */
    var templateParams = {
      from_name:  document.getElementById('fullName').value.trim(),
      from_email: document.getElementById('email').value.trim(),
      subject:    subjectText,
      message:    document.getElementById('message').value.trim()
    };

    /* Disable button while sending */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    hideStatus();

    /* Show "still sending" note if it takes more than 5 seconds */
    var slowTimer = setTimeout(function() {
      showStatus('sending', 'Still sending — please wait...');
    }, 5000);

    /* Send via EmailJS */
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(function() {
        clearTimeout(slowTimer);
        hideStatus();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        showStatus('success', 'Message sent successfully! We will be in touch within 24 hours.');
        contactForm.reset();
      })
      .catch(function(err) {
        clearTimeout(slowTimer);
        hideStatus();
        console.error('EmailJS error:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        showStatus('error', 'Something went wrong. Please check your connection and try again.');
      });
  });

}