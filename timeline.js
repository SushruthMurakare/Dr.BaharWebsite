
(function () {
  const root = document.getElementById('pubSlider');
  if (!root) return;

  const slidesEl = root.querySelector('.slides');
  const slides = Array.from(root.querySelectorAll('.slide'));
  const prevBtn = root.querySelector('.slider-prev');
  const nextBtn = root.querySelector('.slider-next');
  const dots = Array.from(root.querySelectorAll('.slider-dots .page-pill'));

  let index = 0;
  const max = slides.length;

  function goTo(i) {
    index = Math.max(0, Math.min(i, max - 1));
    const offset = -index * 100;
    slidesEl.style.transform = `translateX(${offset}%)`;

    // update dots active state
    dots.forEach((d, di) => {
      const isActive = di === index;
      d.classList.toggle('active', isActive);
      d.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    // toggle prev/next disabled look
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === max - 1;
    prevBtn.setAttribute('aria-disabled', prevBtn.disabled ? 'true' : 'false');
    nextBtn.setAttribute('aria-disabled', nextBtn.disabled ? 'true' : 'false');
  }

  // wire prev/next
  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  // wire dots
  dots.forEach(d => {
    const i = Number(d.dataset.index);
    d.addEventListener('click', () => goTo(i));
  });

  // keyboard left/right support for slider when focused
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  // initial state
  goTo(0);

  // Optional: make swipe support for touch
  (function addSwipe() {
    let startX = null;
    let threshold = 40;
    const vp = root.querySelector('.slides-viewport');
    vp.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
    vp.addEventListener('touchmove', (e) => {
      if (startX === null) return;
      const delta = e.touches[0].clientX - startX;
      // don't prevent default here so page can still scroll vertically
    });
    vp.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const endX = (e.changedTouches && e.changedTouches[0].clientX) || startX;
      const diff = endX - startX;
      startX = null;
      if (diff > threshold) goTo(index - 1);
      else if (diff < -threshold) goTo(index + 1);
    });
  })();
})();
