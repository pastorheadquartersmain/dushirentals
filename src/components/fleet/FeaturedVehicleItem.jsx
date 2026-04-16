export default function FeaturedVehicleItem({ car, numeral, onClick }) {
  return (
    <div
      className="fleet-vehicle"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
      }}
    >
      <div className="fleet-vehicle__numeral" aria-hidden="true">{numeral}</div>

      <div className="fleet-vehicle__wrapper">
        <img
          src={car.image}
          alt={car.name}
          className="fleet-vehicle__image"
          draggable="false"
        />
        <div className="fleet-vehicle__shadow" aria-hidden="true" />
      </div>

      <div className="fleet-vehicle__info">
        <h3 className="fleet-vehicle__category">{car.title}</h3>
        <p className="fleet-vehicle__name">{car.name}</p>
        <p className="fleet-vehicle__price">{car.price}</p>
      </div>
    </div>
  );
}
