function CustomCheckbox({
  id,
  name,
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  title,
  label,
  className = "",
}) {
  return (
    <label htmlFor={id} className={`app-checkbox ${disabled ? "app-checkbox-disabled" : ""} ${className}`.trim()}>
      <span className="app-checkbox-control">
        <input
          id={id}
          name={name}
          type="checkbox"
          className="app-checkbox-input"
          checked={Boolean(checked)}
          onChange={onChange}
          disabled={disabled}
          aria-label={ariaLabel || label || "Checkbox"}
          title={title}
        />
        <span className="app-checkbox-box" aria-hidden />
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}

export default CustomCheckbox;
