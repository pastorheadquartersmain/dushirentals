import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import usePrefersReducedMotion from '../../app/hooks/usePrefersReducedMotion';
import PageShell from '../layout/PageShell';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { MapPin, Shield, Clock } from 'lucide-react';
import { getBookingFormUrl } from '../../app/services/hqrentals';
import fleetData from '../../app/data/fleet.json';
import { slugify, formatPrice } from '../../app/utils/formatting';
import './ReservationPage.css';

gsap.registerPlugin(ScrollTrigger);

const INFO_ITEMS = [
  {
    icon: MapPin,
    title: 'Airport Pickup',
    text: 'Free delivery and pick-up at Curaçao International Airport. We meet you at arrivals.',
  },
  {
    icon: Shield,
    title: 'Fully Insured',
    text: 'All vehicles include third-party insurance. Optional premium coverage available.',
  },
  {
    icon: Clock,
    title: 'Flexible Booking',
    text: 'Cancel or modify your reservation up to 48 hours before pickup at no extra charge.',
  },
];

function formatDisplayDate(dateStr) {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    }).format(new Date(dateStr + 'T12:00:00'));
  } catch {
    return dateStr;
  }
}

export default function ReservationPage() {
  const pageRef = useRef(null);
  const bookingRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const location = useLocation();

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const params = new URLSearchParams(location.search);
  const vehicleSlug = params.get('vehicle');
  const pickup = params.get('pickup');
  const returnDate = params.get('return');
  const locationParam = params.get('location');
  const carClass = params.get('class');

  const vehicle = vehicleSlug
    ? fleetData.find(v => slugify(v.category) === vehicleSlug || v.id === vehicleSlug)
    : null;

  const bookingUrl = getBookingFormUrl();

  const hasSummary = vehicle || pickup || returnDate || locationParam || carClass;

  useLayoutEffect(() => {
    if (reducedMotion || !pageRef.current) return;
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.from('.reservation-page__hero > *', {
        opacity: 0, y: 30, duration: 0.7, stagger: 0.12, ease: 'power3.out',
      });

      if (hasSummary) {
        gsap.from('.reservation-page__summary', {
          opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', delay: 0.3,
        });
      }

      gsap.from('.reservation-page__embed-card', {
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: hasSummary ? 0.45 : 0.25,
      });

      gsap.from('.reservation-page__info-card', {
        opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.reservation-page__info', start: 'top 90%', once: true },
      });
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion, hasSummary]);

  useEffect(() => {
    if (iframeLoaded && bookingRef.current && !reducedMotion) {
      gsap.fromTo(bookingRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [iframeLoaded, reducedMotion]);

  return (
    <PageShell>
      <Header />
      <main ref={pageRef} className="reservation-page">
        <div className="container">

          <div className="reservation-page__hero section">
            <span className="section-label">Reservations</span>
            <h1 className="section-title">
              {vehicle ? `You're booking: ${vehicle.name}` : 'Book Your Rental'}
            </h1>
            <p className="section-subtitle">
              Reserve your vehicle in just a few steps. Free airport delivery included with every booking.
            </p>
          </div>

          {hasSummary && (
            <div className="reservation-page__summary">
              <Card variant="glass" hover={false} className="reservation-page__summary-card">
                <div className="reservation-page__summary-grid">
                  {vehicle && (
                    <div className="reservation-page__summary-item">
                      <span className="reservation-page__summary-label">Vehicle</span>
                      <span className="reservation-page__summary-value">
                        {vehicle.name}
                        <Badge variant="accent" className="reservation-page__summary-badge">{vehicle.category}</Badge>
                      </span>
                      {vehicle.pricePerDay > 0 && (
                        <span className="reservation-page__summary-price">
                          From {formatPrice(vehicle.pricePerDay)}/day
                        </span>
                      )}
                    </div>
                  )}
                  {pickup && (
                    <div className="reservation-page__summary-item">
                      <span className="reservation-page__summary-label">Pickup</span>
                      <span className="reservation-page__summary-value">{formatDisplayDate(pickup)}</span>
                    </div>
                  )}
                  {returnDate && (
                    <div className="reservation-page__summary-item">
                      <span className="reservation-page__summary-label">Return</span>
                      <span className="reservation-page__summary-value">{formatDisplayDate(returnDate)}</span>
                    </div>
                  )}
                  {locationParam && (
                    <div className="reservation-page__summary-item">
                      <span className="reservation-page__summary-label">Location</span>
                      <span className="reservation-page__summary-value">{locationParam}</span>
                    </div>
                  )}
                  {carClass && (
                    <div className="reservation-page__summary-item">
                      <span className="reservation-page__summary-label">Class</span>
                      <span className="reservation-page__summary-value reservation-page__summary-value--cap">{carClass}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          <div className="reservation-page__content">
            <Card variant="glass" hover={false} className="reservation-page__embed-card">
              {!iframeError ? (
                <>
                  {!iframeLoaded && (
                    <div className="reservation-page__loading">
                      <div className="reservation-page__spinner" />
                      <p>Loading booking form...</p>
                    </div>
                  )}
                  <div ref={bookingRef} style={{ opacity: iframeLoaded ? undefined : 0 }}>
                    <iframe
                      src={bookingUrl}
                      className="reservation-page__embed-frame"
                      title="Dushi Rentals Booking Form"
                      onLoad={() => setIframeLoaded(true)}
                      onError={() => setIframeError(true)}
                      allow="payment"
                    />
                  </div>
                </>
              ) : (
                <div className="reservation-page__fallback">
                  <p>The booking form couldn't be loaded. Please use our external booking system.</p>
                  <Button variant="primary" size="lg" href="https://dushirentalscuracao.com/booking/">
                    Go to Booking System
                  </Button>
                </div>
              )}
            </Card>

            <div className="reservation-page__info">
              {INFO_ITEMS.map(({ icon: Icon, title, text }) => (
                <Card key={title} className="reservation-page__info-card" variant="glass">
                  <div className="reservation-page__info-icon">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </PageShell>
  );
}
