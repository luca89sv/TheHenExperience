/* ═══════════════════════════════════════════
   THE HEN EXPERIENCE — Scroll-Driven Frame Animation
   Following SCROLL-ANIMATION-BEST-PRACTICES.md
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Configuration ──
  const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;

  const CONFIG = {
    totalFrames: IS_MOBILE ? 61 : 121,
    batchSize: 15,
    framePath: IS_MOBILE
      ? (i) => `frames-mobile/frame-${String(i).padStart(4, '0')}.webp`
      : (i) => `frames/frame-${String(i).padStart(4, '0')}.webp`,
    frameWidth: IS_MOBILE ? 862 : 1724,
    frameHeight: IS_MOBILE ? 600 : 1200,
  };

  // ── State ──
  let frames = new Array(CONFIG.totalFrames);
  let loadedCount = 0;
  let currentFrame = 0;
  let drawnFrame = -1;
  let targetRotation = 0;
  let actualRotation = 0;
  let scrollProgress = 0;

  // ── DOM refs ──
  const canvas = document.getElementById('frame-canvas');
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('hero');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const scrollHint = document.getElementById('scroll-hint');

  // Phase overlay elements
  const phases = [
    { el: document.getElementById('phase-1'), start: 0.05, end: 0.22 },
    { el: document.getElementById('phase-2'), start: 0.26, end: 0.44 },
    { el: document.getElementById('phase-3'), start: 0.48, end: 0.66 },
    { el: document.getElementById('phase-4'), start: 0.70, end: 0.90 },
  ];

  // ── Canvas setup ──
  function setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Fit frame into viewport while maintaining aspect ratio
    const frameAspect = CONFIG.frameWidth / CONFIG.frameHeight;
    const viewAspect = vw / vh;

    let displayW, displayH;
    if (frameAspect > viewAspect) {
      displayW = vw;
      displayH = vw / frameAspect;
    } else {
      displayH = vh;
      displayW = vh * frameAspect;
    }

    canvas.style.width = displayW + 'px';
    canvas.style.height = displayH + 'px';
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    ctx.scale(dpr, dpr);

    // Redraw current frame after resize
    if (frames[currentFrame]) {
      ctx.drawImage(frames[currentFrame], 0, 0, displayW, displayH);
      drawnFrame = currentFrame;
    }
  }

  // ── Frame preloader — batched ──
  function loadFrame(index) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        frames[index] = img;
        loadedCount++;
        resolve(img);
      };
      img.onerror = () => {
        console.warn(`Failed to load frame ${index}`);
        loadedCount++;
        resolve(null);
      };
      img.src = CONFIG.framePath(index + 1); // frames are 1-indexed
    });
  }

  async function preloadAllFrames() {
    for (let i = 0; i < CONFIG.totalFrames; i += CONFIG.batchSize) {
      const batch = [];
      for (let j = i; j < Math.min(i + CONFIG.batchSize, CONFIG.totalFrames); j++) {
        batch.push(loadFrame(j));
      }
      await Promise.all(batch);
    }
  }

  // ── Scroll calculation ──
  function getScrollProgress() {
    const rect = heroSection.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return 0;
    const progress = -rect.top / scrollable;
    return Math.max(0, Math.min(1, progress));
  }

  // ── Phase overlay controller ──
  function updatePhases(progress) {
    for (const phase of phases) {
      if (!phase.el) continue;
      const inRange = progress >= phase.start && progress <= phase.end;
      phase.el.classList.toggle('visible', inRange);
    }
  }

  // ── Scroll handler — passive, lightweight ──
  function onScroll() {
    scrollProgress = getScrollProgress();
    currentFrame = Math.min(
      Math.floor(scrollProgress * CONFIG.totalFrames),
      CONFIG.totalFrames - 1
    );
    currentFrame = Math.max(0, currentFrame);

    // Rotation: subtle sweep
    targetRotation = -2 + scrollProgress * 6;

    // Update phases
    updatePhases(scrollProgress);

    // Progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = (scrollProgress * 100) + '%';
    }

    // Scroll hint
    if (scrollHint) {
      scrollHint.classList.toggle('hidden', scrollProgress > 0.03);
    }
  }

  // ── Render loop — rAF, only draws when frame changed ──
  function tick() {
    if (currentFrame !== drawnFrame && frames[currentFrame]) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(frames[currentFrame], 0, 0, w, h);
      drawnFrame = currentFrame;
    }

    // Smooth rotation interpolation
    actualRotation += (targetRotation - actualRotation) * 0.08;
    canvas.style.transform = `translate(-50%, -50%) rotate(${actualRotation.toFixed(3)}deg)`;

    requestAnimationFrame(tick);
  }

  // ── Init ──
  async function init() {
    setupCanvas();

    // Preload all frames
    await preloadAllFrames();

    // Draw first frame
    if (frames[0]) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.drawImage(frames[0], 0, 0, w, h);
      drawnFrame = 0;
    }

    // Start scroll listening
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial scroll check (in case user refreshed mid-page)
    onScroll();

    // Start render loop
    tick();

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupCanvas();
        drawnFrame = -1; // force redraw
      }, 200);
    });
  }

  // Kick off
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
