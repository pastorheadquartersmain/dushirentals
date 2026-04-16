import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function CarModal({ car, onClose }) {
  const overlayRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300); // match animation duration
  };

  const handleReserve = () => {
    handleClose();
    setTimeout(() => {
      navigate(`/reservations?class=${encodeURIComponent(car.title)}`);
    }, 300);
  };

  return createPortal(
    <div 
      className={`car-modal-overlay${closing ? ' car-modal-overlay--closing' : ''}`}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
    >
      <div className="car-modal">
        <button className="car-modal__close" onClick={handleClose} aria-label="Close">✕</button>
        
        <div className="car-modal__visual">
          <img src={car.image} alt={car.title} className="car-modal__image" />
        </div>
        
        <div className="car-modal__content">
          <span className="car-modal__category">{car.title}</span>
          <h2 className="car-modal__title">{car.subtitle}</h2>
          <p className="car-modal__desc">{car.description}</p>
          <div className="car-modal__price">{car.price}</div>
          
          <Button variant="primary" size="lg" className="car-modal__cta" onClick={handleReserve}>
            Reserve this car
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
