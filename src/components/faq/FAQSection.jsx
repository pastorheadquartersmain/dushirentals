import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import FAQAccordionItem from './FAQAccordionItem';
import faqData from '../../app/data/faq.json';
import './FAQSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function FAQSection() {
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const header  = Array.from(section.querySelectorAll('.faq-section__header > *'));
      const list    = section.querySelector('.faq-section__list');

      gsap.set(header, { opacity: 0, y: 30 });
      gsap.set(list,   { opacity: 0, y: 25 });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
        .to(header, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' })
        .to(list,   { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.2');
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="faq-section section" id="faq">
      <div className="container">
        <div className="faq-section__header">
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about renting with Dushi Rentals Curaçao.
          </p>
        </div>
        <div className="faq-section__list">
          {faqData.map(item => (
            <FAQAccordionItem
              key={item.id}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
