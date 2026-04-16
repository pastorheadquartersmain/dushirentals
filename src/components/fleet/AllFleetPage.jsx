import { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import PageShell from '../layout/PageShell';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import FleetCard from './FleetCard';
import fleetData from '../../app/data/fleet.json';
import { ALL_CATEGORIES } from '../../app/data/categories';
import './FleetGrid.css';
import './AllFleetPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function AllFleetPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const gridRef = useRef(null);
  const isFirstMount = useRef(true);
  const reducedMotion = usePrefersReducedMotion();

  const visibleCategories =
    activeFilter === 'All' ? ALL_CATEGORIES : [activeFilter];

  // Fade out current cards, then switch filter — creates a clean crossfade
  const handleFilterChange = useCallback((cat) => {
    if (cat === activeFilter) return;
    if (reducedMotion || !gridRef.current) {
      setActiveFilter(cat);
      return;
    }
    const cards = gridRef.current.querySelectorAll('.fleet-card');
    gsap.to(cards, {
      opacity: 0,
      y: 10,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => setActiveFilter(cat),
    });
  }, [activeFilter, reducedMotion]);

  // Animate cards in after every render (initial load + filter changes)
  useLayoutEffect(() => {
    if (reducedMotion || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.fleet-card');
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, { opacity: 0, y: 30, scale: 0.98 });

      if (isFirstMount.current) {
        // ── Initial page load: ScrollTrigger-based entrance ──────────────
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            once: true,
          },
        });
        isFirstMount.current = false;
      } else {
        // ── Filter switch: immediate stagger fade-in ──────────────────────
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          stagger: 0.06,
          ease: 'power2.out',
        });
      }
    }, gridRef);

    return () => ctx.revert();
  }, [activeFilter, reducedMotion]);

  return (
    <PageShell>
      <Header />
      <main className="all-fleet-page">
        <div className="container">

          <div className="all-fleet-page__header section">
            <span className="section-label">Our Fleet</span>
            <h1 className="section-title">All Vehicles</h1>
            <p className="section-subtitle">
              Every vehicle in our fleet — automatic, fully insured, and delivered to your door anywhere in Curaçao.
            </p>
          </div>

          {/* Filters — all 10 categories */}
          <div className="fleet-filters all-fleet-page__filters">
            {['All', ...ALL_CATEGORIES].map(cat => (
              <button
                key={cat}
                className={`fleet-filters__pill ${activeFilter === cat ? 'fleet-filters__pill--active' : ''}`}
                onClick={() => handleFilterChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Flat grid — all vehicles side by side, no category dividers */}
          <div ref={gridRef} className="fleet-grid">
            {visibleCategories.flatMap(category =>
              fleetData.filter(v => v.category === category)
            ).map(vehicle => (
              <FleetCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </PageShell>
  );
}
