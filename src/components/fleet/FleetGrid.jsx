import { useRef, useLayoutEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import { useUI } from '../../app/context/UIContext';
import FleetCard from './FleetCard';
import fleetData from '../../app/data/fleet.json';
import { HOMEPAGE_CATEGORIES } from '../../app/data/categories';
import './FleetGrid.css';

gsap.registerPlugin(ScrollTrigger);

export default function FleetGrid({ homepageMode = false }) {
  const gridRef = useRef(null);
  const { activeFilter } = useUI();
  const reducedMotion = usePrefersReducedMotion();
  // Track whether this is the first mount (ScrollTrigger-based) or a filter switch (immediate)
  const isFirstMount = useRef(true);

  const vehicles = useMemo(() => {
    if (homepageMode) {
      // Show one vehicle per homepage category, in the defined order
      const activeCategories =
        activeFilter === 'All' ? HOMEPAGE_CATEGORIES : [activeFilter];
      return activeCategories
        .map(cat => fleetData.find(v => v.category === cat))
        .filter(Boolean);
    }
    if (activeFilter === 'All') return fleetData;
    return fleetData.filter(v => v.category === activeFilter);
  }, [activeFilter, homepageMode]);

  useLayoutEffect(() => {
    if (reducedMotion || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.fleet-card');
      
      // Definitively check if cards exist
      console.log('Fleet cards found:', cards.length);
      if (!cards.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 95%',
          end: 'top 60%',
          scrub: true,
        }
      });

      cards.forEach((card, index) => {
        const col = index % 3;
        const row = Math.floor(index / 3);
        
        const delay = (row * 0.08) + (col * 0.1);
        
        gsap.set(card, {
          opacity: 0.85,
          scale: 0.96,
          y: 40 + (col * 30),
          x: col * 15
        });

        tl.to(card, {
          opacity: 0.95,
          scale: 0.98,
          y: 15 + (col * 15),
          x: col * 8,
          duration: 0.4, 
          ease: 'power2.out'
        }, delay);
      });

      tl.to(cards, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power3.inOut',
        stagger: 0.02
      }, ">0.1");

    }, gridRef);

    return () => ctx.revert();
  }, [vehicles, reducedMotion]);

  return (
    <div ref={gridRef} className="fleet-grid">
      {vehicles.map(vehicle => (
        <FleetCard key={vehicle.id} vehicle={vehicle} />
      ))}
      {vehicles.length === 0 && (
        <p className="fleet-grid__empty">No vehicles found in this category.</p>
      )}
    </div>
  );
}
