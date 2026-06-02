/* ============================================================
   FITRIX — animations.js
   Scroll-triggered animations using IntersectionObserver.

   HOW IT WORKS:
   1. This script adds .js-anim-ready to <body> first.
      animations.css only hides elements when that class exists —
      so if JS fails or loads late, content is always visible.
   2. IntersectionObserver watches every .anim-* element.
   3. When an element enters the viewport, .is-visible is added,
      which triggers its CSS transition into view.
   ============================================================ */


/* Step 1 — signal to CSS that JS is active and ready */
document.body.classList.add('js-anim-ready');


/* ============================================================
   INTERSECTION OBSERVER
   ============================================================ */

const ANIM_SELECTORS = [
  '.anim-fade-up',
  '.anim-fade-left',
  '.anim-fade-right',
  '.anim-scale-in',
];

const animTargets = document.querySelectorAll(ANIM_SELECTORS.join(', '));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);  // fire once then stop watching
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -30px 0px',
});

animTargets.forEach((el) => observer.observe(el));


/* ============================================================
   STAGGER FALLBACK
   For grids with more than 6 children (beyond CSS nth-child)
   ============================================================ */

document.querySelectorAll('.anim-stagger').forEach((parent) => {
  Array.from(parent.children).forEach((child, i) => {
    if (i >= 6) {
      child.style.transitionDelay = `${0.05 + i * 0.1}s`;
    }
  });
});