import Card from '../ui/Card';
import './TestimonialCard.css';

export default function TestimonialCard({ name, rating, text }) {
  return (
    <Card className="testimonial-card" variant="glass">
      <div className="testimonial-card__inner">
        <div className="testimonial-card__stars">
          {Array.from({ length: rating }, (_, i) => (
            <span key={i} className="testimonial-card__star">★</span>
          ))}
        </div>
        <blockquote className="testimonial-card__text">
          "{text}"
        </blockquote>
        <div className="testimonial-card__author">
          <div className="testimonial-card__avatar">
            {name.charAt(0)}
          </div>
          <span className="testimonial-card__name">{name}</span>
        </div>
      </div>
    </Card>
  );
}
