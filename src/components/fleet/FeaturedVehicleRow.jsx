import FeaturedVehicleItem from './FeaturedVehicleItem';
import fleetData from '../../app/data/fleet.json';

// Pick the three hero showcase vehicles from the real fleet data.
// These map directly to fleet.json entries so images, prices, and names
// stay in sync with the full fleet page automatically.
const FEATURED_IDS = ['economy', 'premium', 'standard-suv'];

const featuredVehicles = FEATURED_IDS.map((id, index) => {
  const vehicle = fleetData.find(v => v.id === id);
  return {
    id:          vehicle.id,
    title:       vehicle.category,
    name:        vehicle.name,
    price:       `From $${vehicle.pricePerDay}/day`,
    image:       vehicle.image,
    description: vehicle.category === 'Economy'
      ? 'Lightweight, fuel-efficient, and perfect for city cruising.'
      : vehicle.category === 'Premium'
      ? 'Smooth performance with elevated comfort for every road.'
      : 'Spacious and capable — ready for any island terrain.',
  };
});

export default function FeaturedVehicleRow({ onSelectCar }) {
  return (
    <div className="featured-vehicles">
      {featuredVehicles.map((car, index) => (
        <FeaturedVehicleItem
          key={car.id}
          car={car}
          numeral={index + 1}
          onClick={() => onSelectCar(car)}
        />
      ))}
    </div>
  );
}
