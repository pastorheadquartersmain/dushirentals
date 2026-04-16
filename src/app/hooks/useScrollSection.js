import { useRef, useLayoutEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from './usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a GSAP ScrollTrigger-powered timeline scoped to a section.
 * @param {Object} config
 * @param {string} config.trigger - ScrollTrigger start/end overrides
 * @param {boolean} config.scrub - Whether to scrub the timeline
 * @param {boolean} config.pin - Whether to pin the section
 * @param {Function} config.setup - Callback receiving (tl, sectionEl) to build the timeline
 */
export default function useScrollSection({
  triggerStart = 'top 80%',
  triggerEnd = 'bottom 20%',
  scrub = false,
  pin = false,
  setup = () => {},
  markers = false,
} = {}) {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: triggerStart,
          end: triggerEnd,
          scrub,
          pin,
          markers,
          toggleActions: 'play none none none',
        },
      });

      timelineRef.current = tl;
      setup(tl, sectionRef.current);
    }, sectionRef);

    return () => ctx.revert();
  }, [triggerStart, triggerEnd, scrub, pin, markers, setup, reducedMotion]);

  return { sectionRef, timeline: timelineRef };
}
