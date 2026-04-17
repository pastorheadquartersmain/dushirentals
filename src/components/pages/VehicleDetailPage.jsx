import { useRef, useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import PageShell from '../layout/PageShell';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import FleetCard from '../fleet/FleetCard';
import { useSharedMorph } from '../transitions/SharedImageMorph';
import fleetData from '../../app/data/fleet.json';
import { formatPrice, slugify } from '../../app/utils/formatting';
import './VehicleDetailPage.css';

gsap.registerPlugin(ScrollTrigger);

const STANDARD_FEATURES = [
  'Automatic Transmission',
  'Full Air Conditioning',
  'Bluetooth Audio',
  'Power Windows',
  'Central Locking',
  'Third-Party Insurance Included',
  'Free Airport Delivery',
  '24/7 Roadside Assistance',
];

export default function VehicleDetailPage() {
  const { category } = useParams();
  const pageRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const { isMorphingIn } = useSharedMorph();

  const vehicle = fleetData.find(v => slugify(v.category) === category || v.id === category);
  const relatedVehicles = vehicle
    ? fleetData.filter(v => v.id !== vehicle.id).slice(0, 3)
    : [];

  useLayoutEffect(() => {
    if (reducedMotion || !pageRef.current || !vehicle) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.vehicle-detail__breadcrumb', {
        opacity: 0, y: 10, duration: 0.5, ease: 'power3.out',
      });

      if (!isMorphingIn) {
        gsap.from('.vehicle-detail__image-card', {
          opacity: 0, x: -30, duration: 0.7, ease: 'power3.out', delay: 0.1,
        });
      }

      gsap.from('.vehicle-detail__info > *', {
        opacity: 0, y: 20, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.15,
      });

      gsap.from('.vehicle-detail__related-grid .fleet-card', {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.vehicle-detail__related', start: 'top 85%', once: true },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion, vehicle]);

  if (!vehicle) {
    return (
      <PageShell>
        <Header />
        <main className="vehicle-detail">
          <div className="container">
            <div className="vehicle-detail__not-found">
              <h1>Vehicle Not Found</h1>
              <p>The vehicle category you're looking for doesn't exist or has been moved.</p>
              <Button variant="primary" size="md" href="/fleet">
                Browse All Vehicles
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Header />
      <main ref={pageRef} className="vehicle-detail">
        <div className="container">

          <div className="vehicle-detail__hero">
            <nav className="vehicle-detail__breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/fleet">Fleet</Link>
              <span>/</span>
              <span>{vehicle.category}</span>
            </nav>
          </div>

          <div className="vehicle-detail__main">
            <Card variant="glass" hover={false} className="vehicle-detail__image-card">
              {vehicle.image ? (
                <img
                  src={vehicle.image}
                  alt={`${vehicle.name} - ${vehicle.category}`}
                  loading="eager"
                  data-morph-target={`vehicle-${slugify(vehicle.category)}`}
                />
              ) : (
                <div className="vehicle-detail__image-placeholder">
                  No image available
                </div>
              )}
            </Card>

            <div className="vehicle-detail__info">
              <Badge variant="accent" className="vehicle-detail__category-badge">
                {vehicle.category}
              </Badge>

              <h1 className="vehicle-detail__title">{vehicle.name}</h1>

              <div className="vehicle-detail__price">
                <span className="vehicle-detail__price-amount">{formatPrice(vehicle.pricePerDay)}</span>
                <span className="vehicle-detail__price-period">/ day</span>
              </div>

              <p className="vehicle-detail__description">
                The {vehicle.name} is part of our {vehicle.category} class — a top pick for exploring Curaçao
                with comfort and style. Fully insured, automatic, and equipped with A/C, it's delivered
                directly to you at the airport at no extra cost.
              </p>

              <Card variant="glass" hover={false} className="vehicle-detail__specs-card">
                <h3>Specifications</h3>
                <div className="vehicle-detail__specs-grid">
                  <div className="vehicle-detail__spec">
                    <svg className="vehicle-detail__spec-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span className="vehicle-detail__spec-text">
                      <span className="vehicle-detail__spec-value">{vehicle.seats}</span> Passengers
                    </span>
                  </div>
                  <div className="vehicle-detail__spec">
                    <svg className="vehicle-detail__spec-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                    <span className="vehicle-detail__spec-text">
                      <span className="vehicle-detail__spec-value">{vehicle.bags}</span> Bags
                    </span>
                  </div>
                  <div className="vehicle-detail__spec">
                    <svg className="vehicle-detail__spec-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                    <span className="vehicle-detail__spec-text">
                      <span className="vehicle-detail__spec-value">{vehicle.transmission}</span>
                    </span>
                  </div>
                  <div className="vehicle-detail__spec">
                    <svg className="vehicle-detail__spec-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
                    <span className="vehicle-detail__spec-text">
                      <span className="vehicle-detail__spec-value">{vehicle.doors}</span> Doors
                    </span>
                  </div>
                  {vehicle.ac && (
                    <div className="vehicle-detail__spec">
                      <svg className="vehicle-detail__spec-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>
                      <span className="vehicle-detail__spec-text">
                        <span className="vehicle-detail__spec-value">Air Conditioning</span>
                      </span>
                    </div>
                  )}
                </div>
              </Card>

              <Card variant="glass" hover={false} className="vehicle-detail__features-card">
                <h3>What's Included</h3>
                <div className="vehicle-detail__features-list">
                  {STANDARD_FEATURES.map(feature => (
                    <div key={feature} className="vehicle-detail__feature">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>

              <div className="vehicle-detail__actions">
                <Button variant="primary" size="lg" href={`/reservations?vehicle=${encodeURIComponent(slugify(vehicle.category))}`}>
                  Reserve This Car
                </Button>
                <Button variant="secondary" size="lg" href="/fleet">
                  View All Vehicles
                </Button>
              </div>
            </div>
          </div>

          {relatedVehicles.length > 0 && (
            <div className="vehicle-detail__related section">
              <div className="vehicle-detail__related-header">
                <span className="section-label">More Options</span>
                <h2 className="section-title">You Might Also Like</h2>
              </div>
              <div className="vehicle-detail__related-grid">
                {relatedVehicles.map(v => (
                  <FleetCard key={v.id} vehicle={v} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </PageShell>
  );
}
