import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { StarBackground } from '../StarBackground';
import { createStars, DRIFT_SECONDS, starFrame } from '../starMotion';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('specified star motion', () => {
  it('uses approximately 70 desktop stars and 35 mobile stars with three depths', () => {
    const stars = createStars(false);
    expect(stars).toHaveLength(69); expect(createStars(true)).toHaveLength(35);
    expect(new Set(stars.map(star => DRIFT_SECONDS[star.depth]))).toEqual(new Set([60, 90, 120]));
    expect(stars.every(star => star.twinkleSeconds >= 4 && star.twinkleSeconds <= 8)).toBe(true);
    expect(new Set(stars.map(star => star.offset)).size).toBeGreaterThan(1);
  });
  it('drifts up and right, returns each depth to its origin, and twinkles from 30 to 90 percent', () => {
    for (const star of createStars(false, () => 0).slice(0, 3)) {
      const initial = starFrame(star, 0, 1440, 750);
      const later = starFrame(star, .01, 1440, 750);
      expect(later.x).toBeGreaterThan(initial.x); expect(later.y).toBeLessThan(initial.y);
      const looped = starFrame(star, DRIFT_SECONDS[star.depth], 1440, 750);
      expect(looped.x).toBeCloseTo(initial.x); expect(looped.y).toBeCloseTo(initial.y);
      expect(starFrame(star, 1, 1440, 750).opacity).toBeCloseTo(.9);
      expect(starFrame(star, 3, 1440, 750).opacity).toBeCloseTo(.3);
      expect(starFrame(star, 100, 1440, 750, true)).toEqual(starFrame(star, 0, 1440, 750, true));
    }
  });
  it.each([false, true])('pauses off-screen or hidden, cleans up, and honors reduced motion = %s', reducedMotion => {
    let reduced = reducedMotion;
    const mediaListeners: Record<string, () => void> = {};
    const removeMedia = vi.fn();
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      get matches() { return query.includes('reduced-motion') && reduced; },
      addEventListener: (_: string, callback: () => void) => { mediaListeners[query] = callback; }, removeEventListener: removeMedia,
    })));
    const callbacks = new Map<number, FrameRequestCallback>();
    let id = 0;
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { callbacks.set(++id, callback); return id; }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn((key: number) => callbacks.delete(key)));
    vi.stubGlobal('Image', class { complete = true; naturalWidth = 1440; onload = null; src = ''; });
    const disconnect = vi.fn();
    let intersect!: (entries: { isIntersecting: boolean }[]) => void;
    vi.stubGlobal('IntersectionObserver', class { constructor(callback: typeof intersect) { intersect = callback; } observe() {} disconnect = disconnect; });
    const context = { clearRect: vi.fn(), setTransform: vi.fn(), save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(), rect: vi.fn(), clip: vi.fn(), drawImage: vi.fn(), globalAlpha: 1 };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.hasAttribute('data-as-star-mask') ? new DOMRect(20, 30, 100, 40) : new DOMRect();
    });
    const { unmount } = render(<div data-as-landing><div data-as-star-mask="surface">Protected copy</div><StarBackground /></div>);
    expect(document.querySelectorAll('canvas')).toHaveLength(1);
    const runFrame = () => { const [key, callback] = [...callbacks][0]; callbacks.delete(key); callback(1000); };
    runFrame();
    expect(context.drawImage).toHaveBeenCalled();
    expect(context.clearRect).toHaveBeenCalledTimes(1);
    expect(callbacks.size).toBe(reduced ? 0 : 1);
    intersect([{ isIntersecting: false }]); expect(callbacks.size).toBe(0);
    intersect([{ isIntersecting: true }]); expect(callbacks.size).toBe(1);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    document.dispatchEvent(new Event('visibilitychange')); expect(callbacks.size).toBe(0);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    document.dispatchEvent(new Event('visibilitychange')); expect(callbacks.size).toBe(1);
    reduced = true; mediaListeners['(prefers-reduced-motion: reduce)'](); runFrame(); expect(callbacks.size).toBe(0);
    unmount(); expect(callbacks.size).toBe(0); expect(disconnect).toHaveBeenCalledOnce(); expect(removeMedia).toHaveBeenCalledTimes(2);
    window.dispatchEvent(new Event('resize')); expect(callbacks.size).toBe(0);
  });
});
