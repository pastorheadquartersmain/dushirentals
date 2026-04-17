import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * PinnedSection
 * --------------
 * Reusable scroll-pinned, scrub-driven section. Same mechanic as the homepage
 * hero — the section pins to the viewport and an animation scrubs through it
 * in lockstep with scroll position.
 *
 *   <PinnedSection
 *     height="150vh"
 *     build={(tl, rootEl) => {
 *       tl.to(rootEl.querySelector('.image'),  { yPercent: -30, scale: 1.1 })
 *         .to(rootEl.querySelector('.caption'), { opacity: 1 }, 0);
 *     }}
 *   >
 *     <figure ref={...}>...</figure>
 *   </PinnedSection>
 *
 * Notes:
 *   - `height` is the total scroll distance the pin consumes (e.g. "150vh").
 *   - `pinType: 'transform'` keeps iOS Safari scrolling smooth and avoids
 *     hijacking native touch behavior.
 *   - prefers-reduced-motion: skips pin + scrub entirely, content renders
 *     as a normal block.
 *   - Portability: no router dependency. Works in any React 19 + GSAP project.
 */
export default function PinnedSection({
  children,
  height = '150vh',
  scrub = 1,
  anticipatePin = 1,
  build,
  className = '',
  ...rest
}) {
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current || typeof build !== 'function') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: `+=${parseInt(height, 10) || 150}%`,
          pin: true,
          pinType: 'transform',
          scrub,
          anticipatePin,
          invalidateOnRefresh: true,
        },
      });

      build(tl, rootRef.current);
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, height, scrub, anticipatePin, build]);

  return (
    <div
      ref={rootRef}
      className={['pinned-section', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
