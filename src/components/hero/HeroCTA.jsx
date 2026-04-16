import Button from '../ui/Button';
import BookingTeaser from '../booking/BookingTeaser';
import './HeroCTA.css';

export default function HeroCTA() {
  return (
    <div className="hero-cta hero__text-wrap">
      <span className="hero__label section-label">
        Welcome to Dushi Rentals Curaçao
      </span>

      <h1 className="hero__headline">
        Discover Paradise.<br />
        <span className="hero__headline-accent">Drive Dushi.</span>
      </h1>

      <p className="hero__subcopy">
        Experience Curaçao with curated luxury vehicles.
        Island elegance meets seamless mobility.
      </p>

      <div className="hero__actions">
        <Button
          variant="primary"
          size="lg"
          href="/reservations"
        >
          Book Your Ride
        </Button>
        <Button
          variant="secondary"
          size="lg"
          href="#fleet"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Explore Fleet
        </Button>
      </div>

      <div className="hero__trust">
        <div className="hero__trust-item">
          <span className="hero__trust-icon">✓</span>
          <span>Free Airport Delivery</span>
        </div>
        <div className="hero__trust-item">
          <span className="hero__trust-icon">✓</span>
          <span>No Hidden Fees</span>
        </div>
        <div className="hero__trust-item">
          <span className="hero__trust-icon">✓</span>
          <span>24/7 Support</span>
        </div>
      </div>

      <BookingTeaser />
    </div>
  );
}
