import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import TestimonialCard from './TestimonialCard';
import testimonials from '../../app/data/testimonials.json';
import './TestimonialsSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const header = Array.from(sectionRef.current.querySelectorAll('.testimonials-section__header > *'));
      const cards = Array.from(sectionRef.current.querySelectorAll('.testimonial-card'));

      gsap.set(header, { opacity: 0, y: 35 });
      gsap.set(cards, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.to(header, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
        .to(cards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.25');
    }, sectionRef);

    return () => ctx.revert();
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
