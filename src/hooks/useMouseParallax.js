import { useEffect } from 'react';
import usePrefersReducedMotion from '../app/hooks/usePrefersReducedMotion';

/**
 * useMouseParallax
 * -----------------
 * Subtle cursor-reactive depth for hero visuals. Max translate 15px,
 * linearly interpolated each frame for a premium damped feel.
 *
 *   const heroImgRef = useRef(null);
 *   useMouseParallax(heroImgRef, { max: 15, ease: 0.1 });
 *
 * Do NOT apply to elements that are also GSAP-tweened — this hook writes
 * element.style.transform directly and will fight any concurrent tween.
 * Apply it on a stable decorative layer (image, illustration) instead.
 *
 * Touch devices: no mousemove event, hook stays dormant — zero cost.
 * prefers-reduced-motion: hook exits early, no listener attached.
 */
export default function useMouseParallax(ref, { max = 15, ease = 0.1 } = {}) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref?.current;
    if (!el) return;

    let rafId = 0;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 … 1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2; // -1 … 1
      target.x = nx * max;
      target.y = ny * max;
    };

    const tick = () => {
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      el.style.transform = '';
    };
  }, [ref, max, ease, reducedMotion]);
}
