import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import './FleetStory.css';

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    id: 'economy',
    image: '/fleet/chevroletspark.png',
    headline: 'Economy',
    tagline: 'Effortless island driving',
  },
  {
    id: 'premium',
    image: '/fleet/nissansentra.png',
    headline: 'Premium',
    tagline: 'Elevated experience',
  },
  {
    id: 'suv',
    image: '/fleet/volkswagentiguan.png',
    headline: 'Standard SUV',
    tagline: 'Room for everything',
  },
];

export default function FleetStory() {
  const containerRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const scenes = containerRef.current.querySelectorAll('.fleet-story__scene');

      scenes.forEach((scene) => {
        const img = scene.querySelector('.fleet-story__image');
        const text = scene.querySelector('.fleet-story__text');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 0.6,
          },
        });

        // Phase 1: entrance (0 -> 0.35)
        tl.fromTo(
          img,
          { opacity: 0, scale: 0.88, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          0
        );
        tl.fromTo(
          text,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
          0.1
        );

        // Phase 2: hold (0.35 -> 0.6) — implicit, no tweens

        // Phase 3: exit (0.6 -> 1)
        tl.to(
          img,
          { opacity: 0, scale: 1.04, y: -30, duration: 0.4, ease: 'power2.in' },
          0.6
        );
        tl.to(
          text,
          { opacity: 0, y: -40, duration: 0.35, ease: 'power2.in' },
          0.65
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className="fleet-story">
      {SCENES.map((scene) => (
        <section key={scene.id} className="fleet-story__scene">
          <div className="fleet-story__visual">
            <img
              src={scene.image}
              alt={scene.headline}
              className="fleet-story__image"
              loading="lazy"
              draggable="false"
            />
          </div>
          <div className="fleet-story__text">
            <span className="fleet-story__label">{scene.headline}</span>
            <p className="fleet-story__tagline">{scene.tagline}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
