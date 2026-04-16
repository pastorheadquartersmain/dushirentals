import { useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {
  Trophy, Tag, Baby, Settings2, PhoneCall, Car,
} from 'lucide-react';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import BenefitCard from './BenefitCard';
import './BenefitsSection.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
  const sectionRef  = useRef(null);
  const timelineRef = useRef(null);
  const firedRef    = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const section   = sectionRef.current;
      const header    = Array.from(section.querySelectorAll('.benefits-section__header > *'));
      const cards     = Array.from(section.querySelectorAll('.benefit-card'));
      const topRow    = cards.slice(0, 3);
      const bottomRow = cards.slice(3);

      gsap.set(header,    { opacity: 0, y: 35 });
      gsap.set(topRow,    { opacity: 0, x: -80 });
      gsap.set(bottomRow, { opacity: 0, x: 80 });

      const tl = gsap.timeline({ paused: true });

      tl.to(header,    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' })
        .to(topRow,    { opacity: 1, x: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' }, '-=0.25')
        .to(bottomRow, { opacity: 1, x: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' }, '-=0.4');

      timelineRef.current = tl;

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=100%',
        pin: true,
        anticipatePin: 1,
        onEnter: () => {
          if (!firedRef.current) {
            firedRef.current = true;
            tl.play();
          }
        },
        // User scrolls past benefits → snap to Testimonials at 82.4%
        onLeave: () => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          gsap.to(window, {
            scrollTo: { y: Math.round(maxScroll * 0.824), autoKill: false },
            duration: 0.1,
            ease: 'none',
            onComplete: () => document.dispatchEvent(new CustomEvent('benefits:leave')),
          });
        },
        onLeaveBack: () => document.dispatchEvent(new CustomEvent('benefits:enter')),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Listen for fleet events — play/reverse timeline
  useEffect(() => {
    if (reducedMotion) return;

    const onFleetLeave = () => {
      firedRef.current = true;
      timelineRef.current?.play();
    };

    const onFleetEnter = () => {
      firedRef.current = false;
      timelineRef.current?.reverse();
    };

    document.addEventListener('fleet:leave', onFleetLeave);
    document.addEventListener('fleet:enter', onFleetEnter);
    return () => {
      document.removeEventListener('fleet:leave', onFleetLeave);
      document.removeEventListener('fleet:enter', onFleetEnter);
    };
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
