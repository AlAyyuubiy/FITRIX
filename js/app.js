document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.nav-trigger');
  const slides = document.querySelectorAll('.editorial-slide');
  const backgrounds = document.querySelectorAll('.bg-slide');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetIndex = trigger.getAttribute('data-index');

      // 1. Reset active nav indicators
      triggers.forEach(t => t.classList.remove('active'));
      trigger.classList.add('active');

      // 2. Crossfade layout slide content
      slides.forEach(slide => slide.classList.remove('active'));
      document.getElementById(`slide-${targetIndex}`).classList.add('active');

      // 3. Smooth blend background textures
      backgrounds.forEach(bg => bg.classList.remove('active'));
      document.getElementById(`bg-${targetIndex}`).classList.add('active');
    });
  });
});