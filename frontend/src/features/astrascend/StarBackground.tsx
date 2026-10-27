import { useEffect, useRef } from 'react';
import artwork from './assets/star-field.svg';
import { createStars, starFrame } from './starMotion';

const MASKS = '[data-as-star-mask]';

/** One viewport canvas for the entire dark landing page, with original Figma sprites. */
export function StarBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const landing = canvas?.closest<HTMLElement>('[data-as-landing]');
    const context = canvas?.getContext('2d');
    if (!canvas || !landing || !context) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 639px)');
    const image = new Image();
    let stars = createStars(mobile.matches);
    let width = 0, height = 0, elapsed = 0, previousTime = 0;
    let frame = 0, visible = true, disposed = false, dirty = true;
    let masks: DOMRect[] = [];
    let bounds: DOMRect;

    const measure = () => {
      bounds = landing.getBoundingClientRect();
      masks = [...landing.querySelectorAll<HTMLElement>(MASKS)].map(node => node.getBoundingClientRect());
      dirty = false;
    };
    const draw = () => {
      if (dirty) measure();
      context.clearRect(0, 0, width, height);
      if (!image.complete || !image.naturalWidth) return;
      context.save();
      context.beginPath();
      context.rect(0, Math.max(0, bounds.top), width, Math.max(0, Math.min(height, bounds.bottom) - Math.max(0, bounds.top)));
      context.clip();
      for (const star of stars) {
        const position = starFrame(star, elapsed, width, height, reduced.matches);
        const [x, y, spriteWidth, spriteHeight] = star.source;
        context.globalAlpha = position.opacity;
        // Crop at render time from the unmodified 1440 × 750 original export.
        // A small transparent inset preserves the artwork's antialiased edges.
        context.drawImage(image, x - 2, y - 2, spriteWidth + 4, spriteHeight + 4,
          position.x - 2, position.y - 2, spriteWidth + 4, spriteHeight + 4);
      }
      context.restore();
      // Keep stars in margins and section gaps, away from copy and card surfaces.
      for (const mask of masks) context.clearRect(mask.left - 12, mask.top - 12, mask.width + 24, mask.height + 24);
    };
    const canRender = () => !disposed && visible && !document.hidden;
    const tick = (timestamp: number) => {
      frame = 0;
      if (!canRender()) return;
      if (previousTime) elapsed += Math.min(timestamp - previousTime, 100) / 1000;
      previousTime = timestamp;
      draw();
      if (!reduced.matches) frame = requestAnimationFrame(tick);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; previousTime = 0; };
    const render = () => { if (canRender() && !frame) frame = requestAnimationFrame(tick); };
    const resize = () => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      dirty = true; render();
    };
    const markDirty = () => { dirty = true; render(); };
    const updateVisibility = () => { stop(); if (canRender()) render(); };
    const updateMotion = () => { stop(); render(); };
    const updateCount = () => { stars = createStars(mobile.matches); resize(); };
    const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false; updateVisibility();
    }) : null;
    const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(markDirty) : null;
    observer?.observe(landing); resizeObserver?.observe(landing);
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', markDirty, { passive: true });
    landing.addEventListener('toggle', markDirty, true);
    document.addEventListener('visibilitychange', updateVisibility);
    reduced.addEventListener('change', updateMotion); mobile.addEventListener('change', updateCount);
    image.onload = render;
    image.src = artwork;
    resize();
    return () => {
      disposed = true; stop(); observer?.disconnect(); resizeObserver?.disconnect(); image.onload = null;
      window.removeEventListener('resize', resize); window.removeEventListener('scroll', markDirty);
      landing.removeEventListener('toggle', markDirty, true);
      document.removeEventListener('visibilitychange', updateVisibility);
      reduced.removeEventListener('change', updateMotion); mobile.removeEventListener('change', updateCount);
    };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[1] h-full w-full" aria-hidden="true" />;
}
