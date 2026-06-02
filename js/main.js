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