import './ValidatedInput.css'

export default function ValidatedInput({
  label,
  value,
  onChange,
  error,
  type = 'number',
  min,
  max,
  step,
  prefix,
  suffix,
}) {
  return (
    <div className="validated-input">
      <div className="validated-input__header">
        <label className="validated-input__label">{label}</label>
        {prefix && (
          <span className="validated-input__prefix">{prefix}</span>
        )}
      </div>
      <div className={`validated-input__wrapper ${error ? 'validated-input__wrapper--error' : ''}`}>
        <input
          type={type}
          className="validated-input__field"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && (
          <span className="validated-input__suffix">{suffix}</span>
        )}
      </div>
      {error && (
        <p className="validated-input__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}