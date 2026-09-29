(() => {
  'use strict';

  const frames = {
    1: { src: 'math-life-1.jpg', caption: "Let's think.", alt: 'Nailong touching his forehead, starting to think.', duration: 1800 },
    2: { src: 'math-life-2.png', caption: 'I might have an idea…', alt: 'Nailong holding his chin, deep in thought.', duration: 2200 },
    3: { src: 'math-life-3.jpg', caption: "Let's try it.", alt: 'Nailong raising a fist, ready to put the idea to work.', duration: 1600 },
    4: { src: 'math-life-4.jpg', caption: 'It works!', alt: 'Nailong celebrating with both arms raised: the proof works!', duration: 3200 },
    5: { src: 'math-life-5.png', caption: '…never mind.', alt: 'Nailong looking down with drooping shoulders: the attempt failed.', duration: 3200 }
  };
  const reaction = document.getElementById('reaction');
  const caption = document.getElementById('caption');
  const number = document.getElementById('step-number');
  const toggle = document.getElementById('play-toggle');
  const next = document.getElementById('next-step');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const successProbability = 0.05;
  let current = 1;
  let playing = !reducedMotion.matches;
  let timer;

  // Preload each reaction so that the next step appears without a blank frame.
  Object.values(frames).forEach(({ src }) => { const image = new Image(); image.src = src; });

  function schedule() {
    window.clearTimeout(timer);
    if (playing && !document.hidden) timer = window.setTimeout(advance, frames[current].duration);
  }

  function syncControls() {
    toggle.textContent = playing ? 'Pause' : 'Play';
    toggle.setAttribute('aria-label', playing ? 'Pause the animation' : 'Play the animation');
    // Announce manual steps without continually interrupting screen readers during autoplay.
    caption.setAttribute('aria-live', playing ? 'off' : 'polite');
  }

  function advance() {
    current = current < 3 ? current + 1 : current === 3 ? (Math.random() < successProbability ? 4 : 5) : 1;
    const frame = frames[current];
    reaction.src = frame.src;
    reaction.alt = frame.alt;
    number.textContent = String(current);
    caption.textContent = frame.caption;
    schedule();
  }

  toggle.addEventListener('click', () => {
    playing = !playing;
    syncControls();
    schedule();
  });
  next.addEventListener('click', () => {
    playing = false;
    syncControls();
    advance();
  });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      playing = false;
      syncControls();
      schedule();
    }
  });
  document.getElementById('controls').hidden = false;
  syncControls();
  schedule();
})();
