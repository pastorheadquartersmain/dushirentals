import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useSharedMorph } from '../transitions/SharedImageMorph';
import { formatPrice, slugify } from '../../app/utils/formatting';
import './FleetCard.css';

export default function FleetCard({ vehicle }) {
  const { id, name, category, pricePerDay, image, seats, bags, transmission, doors, ac } = vehicle;
  const imgRef = useRef(null);
  const { beginMorph } = useSharedMorph();

  const reserveUrl = `/reservations?vehicle=${encodeURIComponent(slugify(category))}`;
  const detailUrl = `/fleet/${encodeURIComponent(slugify(category))}`;
  const targetKey = `vehicle-${slugify(category)}`;

  const handleMorphClick = () => {
    if (!imgRef.current || !image) return;
    beginMorph({ sourceEl: imgRef.current, imageSrc: image, targetKey });
  };

  return (
    <Card className="fleet-card" variant="glass">
      <Link
        to={detailUrl}
        onClick={handleMorphClick}
        className="fleet-card__image-wrapper"
        data-morph-id={id}
        aria-label={`View details for ${name}`}
      >
        <img
          ref={imgRef}
          src={image}
          alt={`${name} - ${category} rental car`}
          className="fleet-card__image"
          loading="lazy"
        />
        <Badge variant="accent" className="fleet-card__badge">
          {category}
        </Badge>
      </Link>

      <div className="fleet-card__body">
        <div className="fleet-card__header">
          <h3 className="fleet-card__name">{name}</h3>
          <div className="fleet-card__price">
            <span className="fleet-card__price-amount">{formatPrice(pricePerDay)}</span>
            <span className="fleet-card__price-period">/day</span>
          </div>
        </div>

        <div className="fleet-card__specs">
          <div className="fleet-card__spec">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>{seats} Seats</span>
          </div>
          <div className="fleet-card__spec">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            <span>{bags} Bags</span>
          </div>
          <div className="fleet-card__spec">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            <span>{transmission}</span>
          </div>
          <div className="fleet-card__spec">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            <span>{doors}-Door</span>
          </div>
          {ac && (
            <div className="fleet-card__spec fleet-card__spec--ac">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></svg>
              <span>A/C</span>
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          size="sm"
          href={reserveUrl}
          className="fleet-card__cta"
        >
          Reserve This Car
        </Button>
      </div>
    </Card>
  );
}
