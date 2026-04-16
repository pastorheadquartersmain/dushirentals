import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import PageShell from '../layout/PageShell';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Card from '../ui/Card';
import FAQAccordionItem from '../faq/FAQAccordionItem';
import Button from '../ui/Button';
import faqData from '../../app/data/faq.json';
import './FAQPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function FAQPage() {
  const pageRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !pageRef.current) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.faq-page__hero > *', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });

      gsap.from('.faq-page__list', {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.faq-page__list', start: 'top 90%', once: true },
      });

      gsap.from('.faq-page__cta', {
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.faq-page__cta', start: 'top 90%', once: true },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <PageShell>
      <Header />
      <main ref={pageRef} className="faq-page">
        <div className="container">

          <div className="faq-page__hero section">
            <span className="section-label">FAQ</span>
            <h1 className="section-title">Frequently Asked Questions</h1>
            <p className="section-subtitle">
              Everything you need to know about renting a car with Dushi Rentals Curaçao.
            </p>
          </div>

          <div className="faq-page__content">
            <Card variant="glass" hover={false} className="faq-page__list">
              {faqData.map(item => (
                <FAQAccordionItem
                  key={item.id}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </Card>
          </div>

          <div className="faq-page__cta">
            <p>Still have questions? We'd love to hear from you.</p>
            <div className="faq-page__cta-links">
              <Button variant="primary" size="md" href="/contact">
                Contact Us
              </Button>
              <Button variant="secondary" size="md" href="tel:+59996682260">
                Call +5999 668-2260
              </Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </PageShell>
  );
}
