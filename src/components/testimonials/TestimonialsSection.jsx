import { useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import TestimonialCard from './TestimonialCard';
import testimonials from '../../app/data/testimonials.json';
import './TestimonialsSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const sectionRef  = useRef(null);
  const timelineRef = useRef(null);
  const firedRef    = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const header  = Array.from(section.querySelectorAll('.testimonials-section__header > *'));
      const cards   = Array.from(section.querySelectorAll('.testimonial-card'));

      gsap.set(header, { opacity: 0, y: 35 });
      gsap.set(cards,  { opacity: 0, y: 40 });

      const tl = gsap.timeline({ paused: true });

      tl.to(header, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
        .to(cards,  { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.25');

      timelineRef.current = tl;

      // Fallback: if user scrolls here directly (without benefits event), play on enter
      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          if (!firedRef.current) {
            firedRef.current = true;
            tl.play();
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Listen for benefits events
  useEffect(() => {
    if (reducedMotion) return;

    const onBenefitsLeave = () => {
      firedRef.current = true;
      timelineRef.current?.play();
    };

    const onBenefitsEnter = () => {
      firedRef.current = false;
      timelineRef.current?.reverse();
    };

    document.addEventListener('benefits:leave', onBenefitsLeave);
    document.addEventListener('benefits:enter', onBenefitsEnter);
    return () => {
      document.removeEventListener('benefits:leave', onBenefitsLeave);
      document.removeEventListener('benefits:enter', onBenefitsEnter);
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="testimonials-section section" id="testimonials">
      <div className="container">
        <div className="testimonials-section__header">
          <span className="section-label">What Our Guests Say</span>
          <h2 className="section-title">Trusted by Travelers</h2>
          <div className="testimonials-section__rating">
            <div className="testimonials-section__stars">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} className="testimonials-section__star">{s}</span>
              ))}
            </div>
            <p className="testimonials-section__rating-text">
              <strong>Excellent</strong> rating based on 54 Google reviews
            </p>
          </div>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
