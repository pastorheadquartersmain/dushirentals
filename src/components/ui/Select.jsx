import './Select.css';

export default function Select({ label, id, options = [], placeholder, ...props }) {
  return (
    <div className="select-group">
      {label && <label htmlFor={id} className="select-group__label">{label}</label>}
      <select id={id} className="select-group__select" {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
