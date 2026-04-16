import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ALL_CATEGORIES } from '../../app/data/categories';
import { Calendar } from 'lucide-react';
import DatePickerModal from './DatePickerModal';
import Button from '../ui/Button';
import './BookingTeaser.css';

const LOCATIONS = [
  { value: 'Curacao Airport', label: 'Curaçao Airport' },
  { value: 'Willemstad', label: 'Willemstad' },
  { value: 'Hotel Delivery', label: 'Hotel Delivery' },
];

const CAR_CLASSES = [
  { value: '', label: 'Any class' },
  ...ALL_CATEGORIES.map(cat => ({ value: cat, label: cat })),
];

// ── Helpers ───────────────────────────────────────────────────────────────
const toISO = (date) => {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
};

const fromISO = (value) => {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  return (y && m && d) ? new Date(y, m - 1, d) : undefined;
};

// ── Component ─────────────────────────────────────────────────────────────
export default function BookingTeaser() {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [location, setLocation] = useState('Curacao Airport');
  const [carClass, setCarClass] = useState('');
  const [modalField, setModalField] = useState(null); // 'pickup' | 'return' | null

  const today = new Date().toISOString().split('T')[0];
  const todayDate = fromISO(today);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickupDate) params.set('pickup', pickupDate);
    if (returnDate) params.set('return', returnDate);
    if (location) params.set('location', location);
    if (carClass) params.set('class', carClass);
    navigate(`/reservations?${params.toString()}`);
  };

  // ── Modal handlers ────────────────────────────────────────────────────
  const openModal = (field, e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    setModalField(field);
  };

  const handleModalSelect = (date) => {
    if (!date) {
      if (modalField === 'pickup') setPickupDate('');
      else setReturnDate('');
      return;
    }
    const iso = toISO(date);
    if (modalField === 'pickup') {
      setPickupDate(iso);
      if (returnDate && iso > returnDate) setReturnDate('');
    } else {
      setReturnDate(iso);
    }
  };

  const closeModal = () => setModalField(null);

  // ── Derived modal props ───────────────────────────────────────────────
  const modalSelected = modalField === 'pickup' ? fromISO(pickupDate) : fromISO(returnDate);
  const modalMinDate = modalField === 'pickup'
    ? todayDate
    : fromISO(pickupDate) || todayDate;

  // ── Date field renderer ───────────────────────────────────────────────
  const renderDateField = (field, label, value) => (
    <div
      className="booking-teaser__field"
      role="group"
      aria-label={`${label} date`}
      onClick={(e) => openModal(field, e)}
    >
      <span className="booking-teaser__field-label">{label}</span>
      <div className="booking-teaser__input-shell">
        <input
          type="text"
          readOnly
          inputMode="none"
          className="booking-teaser__input"
          value={value}
          placeholder="Pick a date"
          onFocus={(e) => { e.target.blur(); openModal(field); }}
          onClick={(e) => { e.stopPropagation(); openModal(field); }}
        />
        <button
          type="button"
          className="booking-teaser__calendar-icon"
          aria-label={`Open ${label.toLowerCase()} calendar`}
          onClick={(e) => openModal(field, e)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <Calendar size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hero__booking-teaser">
        <form className="booking-teaser glass-strong" onSubmit={handleSearch}>
          <div className="booking-teaser__label">Quick booking</div>
          <div className="booking-teaser__fields">

            {/* Location */}
            <div
              className="booking-teaser__field"
              role="group"
              aria-label="Pickup location"
            >
              <span className="booking-teaser__field-label">Location</span>
              <select
                className="booking-teaser__select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {LOCATIONS.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>

            <div className="booking-teaser__divider" />

            {/* Pickup date */}
            {renderDateField('pickup', 'Pickup', pickupDate)}

            <div className="booking-teaser__divider" />

            {/* Return date */}
            {renderDateField('return', 'Return', returnDate)}

            <div className="booking-teaser__divider" />

            {/* Car class */}
            <div
              className="booking-teaser__field booking-teaser__field--wide"
              role="group"
              aria-label="Car class"
            >
              <span className="booking-teaser__field-label">Car Class</span>
              <select
                className="booking-teaser__select"
                value={carClass}
                onChange={(e) => setCarClass(e.target.value)}
              >
                {CAR_CLASSES.map(cls => (
                  <option key={cls.value} value={cls.value}>{cls.label}</option>
                ))}
              </select>
            </div>

            <Button variant="primary" size="sm" type="submit">
              Find Your Car
            </Button>
          </div>
        </form>
      </div>

      {/* ── Date picker modal (portal — escapes hero stacking context) ─── */}
      {modalField && createPortal(
        <DatePickerModal
          field={modalField}
          selected={modalSelected}
          minDate={modalMinDate}
          onSelect={handleModalSelect}
          onClose={closeModal}
        />,
        document.body
      )}
    </>
  );
}
