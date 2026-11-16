export default function CustomInput({ label, style, ...props }) {
  return (
    <label style={{ display: 'grid', gap: 'var(--space-2)', color: 'var(--text-color)', fontFamily: 'var(--font-family)' }}>
      {label ? <span>{label}</span> : null}
      <input
        {...props}
        style={{
          height: 'var(--control-height)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0 var(--space-3)',
          fontFamily: 'var(--font-family)',
          color: 'var(--text-color)',
          background: 'var(--background-color)',
          ...style,
        }}
      />
    </label>
  );
}
