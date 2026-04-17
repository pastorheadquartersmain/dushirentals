import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import FeaturedVehicleRow from './FeaturedVehicleRow';
import CarModal from './CarModal';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import './FleetSection.css';

gsap.registerPlugin(ScrollTrigger);

export default function FleetSection() {
  const sectionRef = useRef(null);
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

      gsap.set([title, subtitle], { opacity: 0, y: 30 });
      gsap.set(vehicles, { opacity: 0, x: 180 });
      gsap.set(cta, { opacity: 0, y: 12 });

      // Enter-triggered timeline — no pin, no dead scroll. The cars cascade
      // right-to-left as the section's top crosses the 75% viewport line.
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
        .to(title,    { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' })
        .to(subtitle, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }, '-=0.2')
        .to(vehicles, {
          opacity: 1, x: 0, duration: 0.55,
          stagger: { each: 0.08, from: 'end' },
          ease: 'power3.out',
        }, '-=0.1')
        .to(cta, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.1');
    }, sectionRef);

    return () => ctx.revert();
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
