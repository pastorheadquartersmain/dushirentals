import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Link } from 'react-router-dom';
import FeaturedVehicleRow from './FeaturedVehicleRow';
import CarModal from './CarModal';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import './FleetSection.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function FleetSection() {
  const sectionRef  = useRef(null);
  const timelineRef = useRef(null);
  const firedRef    = useRef(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const section  = sectionRef.current;
      const title    = section.querySelector('.fleet-intro__title');
      const subtitle = section.querySelector('.fleet-intro__subtitle');
      const vehicles = Array.from(section.querySelectorAll('.fleet-vehicle'));
      const cta      = section.querySelector('.fleet-intro__cta');

      gsap.set(section,  { opacity: 0, y: 80 });
      gsap.set(title,    { opacity: 0, y: 35 });
      gsap.set(subtitle, { opacity: 0, y: 25 });
      gsap.set(vehicles, { opacity: 0, x: 200 });
      gsap.set(cta,      { opacity: 0, y: 15 });

      const tl = gsap.timeline({ paused: true });

      tl.to(section, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' })
        .to(title,    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4')
        .to(subtitle, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.25')
        .to(vehicles, {
          opacity: 1, x: 0, duration: 0.6,
          stagger: { each: 0.08, from: 'end' },
          ease: 'power3.out',
        }, '-=0.2')
        .to(cta, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.15');

      timelineRef.current = tl;

      // Pin holds section while user reads it.
      // User must scroll past the pin end to trigger snap to Benefits.
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
        // User scrolls past fleet → snap to Benefits at 60.8%
        onLeave: () => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          gsap.to(window, {
            scrollTo: { y: Math.round(maxScroll * 0.608), autoKill: false },
            duration: 0.1,
            ease: 'none',
            onComplete: () => document.dispatchEvent(new CustomEvent('fleet:leave')),
          });
        },
        onLeaveBack: () => document.dispatchEvent(new CustomEvent('fleet:enter')),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Listen for hero events — just play/reverse, no chaining
  useEffect(() => {
    if (reducedMotion) return;

    const onHeroLeave = () => {
      firedRef.current = true;
      timelineRef.current?.play();
    };

    const onHeroEnter = () => {
      firedRef.current = false;
      timelineRef.current?.reverse();
    };

    document.addEventListener('hero:leave',  onHeroLeave);
    document.addEventListener('hero:enter',  onHeroEnter);
    return () => {
      document.removeEventListener('hero:leave',  onHeroLeave);
      document.removeEventListener('hero:enter',  onHeroEnter);
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="fleet-intro" id="fleet-intro">
      <div className="fleet-intro__inner">
        <header className="fleet-intro__header">
          <h2 className="fleet-intro__title">Choose your ride</h2>
          <p className="fleet-intro__subtitle">Premium vehicles for every island adventure</p>
        </header>

        <FeaturedVehicleRow onSelectCar={setSelectedCar} />

        <div className="fleet-intro__cta">
          <Link to="/fleet" className="btn btn--primary btn--md fleet-intro__cta-btn">
            Explore all models
          </Link>
        </div>
      </div>

      {selectedCar && (
        <CarModal car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </section>
  );
}
