import './Card.css';

export default function Card({ children, variant = 'glass', className = '', hover = true, ...props }) {
  return (
    <div className={`card card--${variant} ${hover ? 'card--hover' : ''} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
