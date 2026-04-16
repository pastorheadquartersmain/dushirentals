import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import './DatePickerModal.css';

/**
 * DatePickerModal
 *
 * Fullscreen modal date picker — rendered via portal at document.body by the
 * caller. Uses a closing-class pattern to animate the exit before the parent
 * removes the portal from the DOM.
 *
 * Props
 *   field     – 'pickup' | 'return'
 *   selected  – currently selected Date | undefined
 *   minDate   – earliest selectable Date
 *   onSelect  – (date: Date | null) => void
 *   onClose   – () => void  (called after exit animation ends)
 */
export default function DatePickerModal({
  field,
  selected,
  minDate,
  onSelect,
  onClose,
}) {
  const [closing, setClosing] = useState(false);
  const overlayRef = useRef(null);
  const isPickup = field === 'pickup';

  // ── ESC key ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Freeze body scroll ────────────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(onClose, 230);
  };

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const handleDaySelect = (date) => {
    if (!date) return;
    onSelect(date);
    // Small beat so the user sees the selection highlight before closing
    setTimeout(handleClose, 140);
  };

  const handleClear = () => {
    onSelect(null);
    handleClose();
  };

  return (
    <div
      ref={overlayRef}
      className={`date-modal-overlay${closing ? ' date-modal-overlay--closing' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Select ${isPickup ? 'pickup' : 'return'} date`}
    >
      <div className="date-modal">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="date-modal__header">
          <div className="date-modal__title-block">
            <p className="date-modal__eyebrow">
              {isPickup ? 'Pickup date' : 'Return date'}
            </p>
            <h2 className="date-modal__title">Select a date</h2>
          </div>
          <button
            type="button"
            className="date-modal__close-btn"
            onClick={handleClose}
            aria-label="Close date picker"
          >
            ✕
          </button>
        </div>

        {/* ── Calendar ────────────────────────────────────────────────────── */}
        <div className="date-modal__body">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleDaySelect}
            disabled={{ before: minDate }}
            classNames={{ root: 'rdp-modal-root' }}
          />
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="date-modal__footer">
          <button
            type="button"
            className="date-modal__clear-btn"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            type="button"
            className="date-modal__confirm-btn"
            onClick={handleClose}
          >
            {selected ? 'Confirm' : 'Skip'}
          </button>
        </div>

      </div>
    </div>
  );
}
