import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ExternalLink } from 'lucide-react';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import TestimonialCard from './TestimonialCard';
import testimonials from '../../app/data/testimonials.json';
import './TestimonialsSection.css';

gsap.registerPlugin(ScrollTrigger);

// Replace with the actual Google Maps reviews URL once available.
// Example: https://www.google.com/maps/place/?q=place_id:ChIJxxxxxxxxxxxxxxx
const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/search/?api=1&query=Dushi+Rentals+Curacao';
const TOTAL_REVIEW_COUNT = 54;
const AVERAGE_RATING = 4.9;

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const header  = Array.from(section.querySelectorAll('.testimonials-section__header > *'));
      const cards   = Array.from(section.querySelectorAll('.testimonial-card'));
      const trust   = section.querySelector('.testimonials-section__trust');

      gsap.set(header, { opacity: 0, y: 30 });
      gsap.set(cards,  { opacity: 0, y: 40, scale: 0.97 });
      gsap.set(trust,  { opacity: 0, y: 20 });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
        .to(header, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
        .to(cards, {
          opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out',
        }, '-=0.2')
        .to(trust, {
          opacity: 1, y: 0, duration: 0.45, ease: 'power3.out',
        }, '-=0.1');
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
            <div className="testimonials-section__stars" aria-label={`${AVERAGE_RATING} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} className="testimonials-section__star" />
              ))}
            </div>
            <p className="testimonials-section__rating-text">
              <strong>{AVERAGE_RATING}</strong> rating · {TOTAL_REVIEW_COUNT} verified Google reviews
            </p>
          </div>
        </div>
      </div>

      {/* Edge-to-edge scroll rail — overflows the container so cards can drift
          off-screen on the right, signalling "more available". */}
      <div className="testimonials-section__rail" role="region" aria-label="Customer reviews">
        <div className="testimonials-section__track">
          {testimonials.slice(0, 8).map(testimonial => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>

      <div className="container">
        <div className="testimonials-section__trust">
          <div className="testimonials-section__trust-rating">
            <div className="testimonials-section__trust-score">{AVERAGE_RATING}</div>
            <div className="testimonials-section__trust-stars" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <div className="testimonials-section__trust-count">
              Based on <strong>{TOTAL_REVIEW_COUNT}</strong> Google reviews
            </div>
          </div>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="testimonials-section__trust-link"
          >
            See all reviews on Google
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
