import './Accordion.css';
import { useState, useRef, useEffect } from 'react';

export default function Accordion({ question, answer, isOpen: controlledOpen, onToggle }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(prev => !prev);
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className={`accordion ${isOpen ? 'accordion--open' : ''}`}>
      <button
        className="accordion__trigger"
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span className="accordion__question">{question}</span>
        <span className="accordion__icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 8L10 13L15 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        className="accordion__content"
        style={{ height: `${height}px` }}
        aria-hidden={!isOpen}
      >
        <div ref={contentRef} className="accordion__body">
          {typeof answer === 'string' ? <p>{answer}</p> : answer}
        </div>
      </div>
    </div>
  );
}
