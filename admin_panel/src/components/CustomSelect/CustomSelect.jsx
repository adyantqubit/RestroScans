export default function CustomSelect({ label, options = [], style, ...props }) {
  return (
    <label style={{ display: 'grid', gap: 'var(--space-2)', fontFamily: 'var(--font-family)', color: 'var(--text-color)' }}>
      {label ? <span>{label}</span> : null}
      <select
        {...props}
        style={{
          height: 'var(--control-height)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0 var(--space-3)',
          background: 'var(--background-color)',
          ...style,
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}
