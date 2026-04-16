import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import PageShell from '../layout/PageShell';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Heart, Shield, MapPin } from 'lucide-react';
import './AboutPage.css';

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    icon: Heart,
    title: 'Island Hospitality',
    text: 'Born and raised in Curaçao, we treat every guest like family. From airport pickup to roadside support, warm service is our standard.',
  },
  {
    icon: Shield,
    title: 'Transparent & Honest',
    text: 'No hidden fees, no surprises. Our pricing includes third-party insurance and 24/7 support — what you see is what you pay.',
  },
  {
    icon: MapPin,
    title: 'Local Expertise',
    text: 'We know every beach, trail, and hidden gem on the island. Ask us for tips — your Curaçao experience goes beyond the rental.',
  },
];

export default function AboutPage() {
  const pageRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !pageRef.current) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.about-page__hero > *', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });

      gsap.from('.about-page__story-content', {
        opacity: 0, x: -40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-page__story', start: 'top 80%', once: true },
      });

      gsap.from('.about-page__photo-area', {
        opacity: 0, x: 40, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-page__story', start: 'top 80%', once: true },
      });

      gsap.from('.about-page__value-card', {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-page__values-grid', start: 'top 85%', once: true },
      });

      gsap.from('.about-page__cta-section > *', {
        opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-page__cta-section', start: 'top 85%', once: true },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <PageShell>
      <Header />
      <main ref={pageRef} className="about-page">
        <div className="container">

          <div className="about-page__hero section">
            <span className="section-label">About Us</span>
            <h1 className="section-title">Dushi Rentals Curaçao</h1>
            <p className="section-subtitle">
              Island elegance meets seamless mobility. We're your local car rental partner, making every trip across Curaçao a breeze.
            </p>
          </div>

          <div className="about-page__story">
            <div className="about-page__story-content">
              <h2>Welcome to Dushi Rentals</h2>
              <p>
                Dushi Rentals Curaçao is your trusted local car rental company, proudly serving visitors and residents at Curaçao International Airport and across the island. "Dushi" means sweet, beautiful, and beloved in Papiamentu — and that's exactly the experience we aim to deliver.
              </p>
              <p>
                We started with a simple idea: make renting a car in Curaçao as effortless and enjoyable as the island itself. Our fleet of well-maintained, fully insured vehicles — all automatic with A/C — is ready for you whether you're here for a week-long vacation or an extended stay.
              </p>
              <p>
                With free airport delivery and pickup, transparent pricing with no hidden fees, and a dedicated support team available around the clock, we go the extra mile so you can explore every corner of our beautiful island with total peace of mind.
              </p>
            </div>
            <div className="about-page__photo-area">
              <div className="about-page__photo-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
                <span>Team Photo</span>
              </div>
            </div>
          </div>

          <div className="about-page__values section">
            <div className="about-page__values-header">
              <span className="section-label">Our Values</span>
              <h2 className="section-title">What Drives Us</h2>
              <p className="section-subtitle">
                More than just cars — we're committed to making your Curaçao experience unforgettable.
              </p>
            </div>

            <div className="about-page__values-grid">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <Card key={title} className="about-page__value-card" variant="glass">
                  <div className="about-page__value-icon">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="about-page__cta-section">
            <h2>Ready to Explore Curaçao?</h2>
            <p>Browse our fleet and reserve your perfect ride today.</p>
            <Button variant="primary" size="lg" href="/fleet">
              View Our Fleet
            </Button>
          </div>

        </div>
      </main>
      <Footer />
    </PageShell>
  );
}
