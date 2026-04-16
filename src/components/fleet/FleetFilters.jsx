import { useUI } from '../../app/context/UIContext';
import './FleetFilters.css';

const CATEGORIES = ['All', 'Economy', 'Comfort', 'Premium', 'Premium Plus', 'Standard SUV', 'Mini Van'];

export default function FleetFilters() {
  const { activeFilter, setActiveFilter } = useUI();

  return (
    <div className="fleet-filters">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={`fleet-filters__pill ${activeFilter === cat ? 'fleet-filters__pill--active' : ''}`}
          onClick={() => setActiveFilter(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
