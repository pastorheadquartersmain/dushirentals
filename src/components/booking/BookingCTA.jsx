import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import Button from '../ui/Button';
import './BookingCTA.css';

gsap.registerPlugin(ScrollTrigger);

export default function BookingCTA() {
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const inner = sectionRef.current.querySelector('.booking-cta__inner');

      gsap.set(inner, { opacity: 0, y: 35, scale: 0.98 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.to(inner, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power3.out' });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="booking-cta-section section" id="booking-cta">
      <div className="container">
        <div className="booking-cta__inner">
          <div className="booking-cta__glow" aria-hidden="true" />
          <span className="section-label">Ready to Go?</span>
          <h2 className="booking-cta__title">
            Start Your Curaçao Adventure
          </h2>
          <p className="booking-cta__text">
            Book your rental today and receive a <strong>10% discount</strong> for online payments.
            Free airport delivery included.
          </p>
          <div className="booking-cta__actions">
            <Button variant="primary" size="lg" href="/reservations">
              Reserve Your Car Now
            </Button>
            <a href="tel:+59996682260" className="booking-cta__phone">
              Or call us: +5999 668-2260
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
