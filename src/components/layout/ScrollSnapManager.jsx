import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const SECTIONS = [
  '#hero',
  '#fleet-intro',
  '#benefits',
  '#testimonials',
  '#faq',
  '#booking-cta',
];

export default function ScrollSnapManager() {
  const isSnapping = useRef(false);

  useEffect(() => {
    const snapTo = (el, duration = 0.8) => {
      if (isSnapping.current) return;
      isSnapping.current = true;
      gsap.killTweensOf(window);

      const target = el.id === 'hero'
        ? 0
        : window.scrollY + el.getBoundingClientRect().top;

      gsap.to(window, {
        scrollTo: { y: target, autoKill: false },
        duration,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: () => {
          setTimeout(() => { isSnapping.current = false; }, 200);
        },
      });
    };

    const handleLeave = (e) => {
      const id = e.detail;
      const idx = SECTIONS.indexOf(id);
      if (idx === -1 || idx >= SECTIONS.length - 1) return;
      const next = document.querySelector(SECTIONS[idx + 1]);
      if (next) snapTo(next);
    };

    const handleLeaveBack = (e) => {
      const id = e.detail;
      const idx = SECTIONS.indexOf(id);
      if (idx <= 0) return;
      const prev = document.querySelector(SECTIONS[idx - 1]);
      if (prev) snapTo(prev);
    };

    window.addEventListener('section:leave', handleLeave);
    window.addEventListener('section:leaveback', handleLeaveBack);

    return () => {
      window.removeEventListener('section:leave', handleLeave);
      window.removeEventListener('section:leaveback', handleLeaveBack);
      gsap.killTweensOf(window);
    };
  }, []);

  return null;
}
