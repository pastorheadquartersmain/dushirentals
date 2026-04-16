import FeaturedVehicleItem from './FeaturedVehicleItem';

const fleetData = [
  {
    id: 'economy',
    title: 'Economy',
    name: 'Chevrolet Spark',
    price: 'From $45/day',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=800&auto=format&fit=crop',
    description: 'Lightweight, fuel-efficient, and perfect for city cruising.',
  },
  {
    id: 'premium',
    title: 'Premium',
    name: 'Nissan Sentra',
    price: 'From $85/day',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop',
    description: 'Luxury feel with smooth performance and elevated style.',
  },
  {
    id: 'suv',
    title: 'Standard SUV',
    name: 'VW Tiguan',
    price: 'From $95/day',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=800&auto=format&fit=crop',
    description: 'Spacious, powerful, and ready for any terrain.',
  }
];

export default function FeaturedVehicleRow({ onSelectCar }) {
  return (
    <div className="featured-vehicles">
      {fleetData.map((car, index) => (
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
