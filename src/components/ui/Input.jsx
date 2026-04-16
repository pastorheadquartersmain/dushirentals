import './Input.css';

export default function Input({ label, id, type = 'text', placeholder, ...props }) {
  return (
    <div className="input-group">
      {label && <label htmlFor={id} className="input-group__label">{label}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="input-group__input"
        {...props}
      />
    </div>
  );
}
