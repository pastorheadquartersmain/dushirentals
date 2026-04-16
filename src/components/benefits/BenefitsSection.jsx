import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Trophy, Tag, Baby, Settings2, PhoneCall, Car,
} from 'lucide-react';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import BenefitCard from './BenefitCard';
import './BenefitsSection.css';

gsap.registerPlugin(ScrollTrigger);

const BENEFITS = [
  {
    icon: Trophy,
    title: 'Outstanding Services',
    description: "We focus on child safety with appropriate child seats based on age. Your family's comfort is our priority.",
  },
  {
    icon: Tag,
    title: 'Competitive Prices',
    description: 'Free airport pick-up and drop-off, no hidden fees, transparent pricing. What you see is what you pay.',
  },
  {
    icon: Baby,
    title: 'Free Child Safety Seats',
    description: 'Safety is our #1 priority. Child safety seats are available upon request at no extra charge.',
  },
  {
    icon: Settings2,
    title: 'Automatic Transmission',
    description: 'All vehicles are automatic for ease of use, plus full A/C and Bluetooth connectivity.',
  },
  {
    icon: PhoneCall,
    title: '24/7 Support',
    description: "Assistance for flat tires and accidents, with car replacement if necessary. We're always here for you.",
  },
  {
    icon: Car,
    title: 'Outstanding Vehicle Quality',
    description: 'As a boutique agency, we maintain a focused fleet of clean, well-maintained, and reliable cars.',
  },
];

export default function BenefitsSection() {
  const sectionRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(sectionRef.current.querySelectorAll('.benefit-card'));
      const topRow = cards.slice(0, 3);
      const bottomRow = cards.slice(3);
      const header = Array.from(sectionRef.current.querySelectorAll('.benefits-section__header > *'));

      gsap.set(header, { opacity: 0, y: 35 });
      gsap.set(topRow, { opacity: 0, x: -80 });
      gsap.set(bottomRow, { opacity: 0, x: 80 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      tl.to(header, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
        .to(topRow, { opacity: 1, x: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' }, '-=0.25')
        .to(bottomRow, { opacity: 1, x: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' }, '-=0.4');
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="benefits-section section" id="benefits">
      <div className="container">
        <div className="benefits-section__header">
          <span className="section-label">Why Choose Us</span>
          <h2 className="section-title">The Dushi Difference</h2>
          <p className="section-subtitle">
            Car rental in Curaçao doesn't get any simpler or more reliable than us.
          </p>
        </div>
        <div className="benefits-grid">
          {BENEFITS.map((benefit, i) => (
            <BenefitCard key={i} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
