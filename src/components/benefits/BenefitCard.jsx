import Card from '../ui/Card';
import './BenefitCard.css';

export default function BenefitCard({ icon: Icon, title, description }) {
  return (
    <Card className="benefit-card" variant="glass">
      <div className="benefit-card__inner">
        <span className="benefit-card__icon">
          <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h3 className="benefit-card__title">{title}</h3>
        <p className="benefit-card__description">{description}</p>
      </div>
    </Card>
  );
}
