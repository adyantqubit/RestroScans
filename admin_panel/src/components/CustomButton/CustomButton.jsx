export default function CustomButton({
  children,
  variant = 'primary',
  type = 'button',
  style,
  ...props
}) {
  const variants = {
    primary: {
      background: 'var(--primary-color)',
      color: '#fff',
      border: '1px solid var(--primary-color)',
    },
    secondary: {
      background: 'var(--background-color)',
      color: 'var(--text-color)',
      border: '1px solid var(--border-color)',
    },
    danger: {
      background: 'var(--error-color)',
      color: '#fff',
      border: '1px solid var(--error-color)',
    },
  };
  return (
    <button
      type={type}
      {...props}
      style={{
        height: 'var(--control-height)',
        padding: '0 var(--space-4)',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-family)',
        fontWeight: 'var(--font-weight-medium)',
        cursor: 'pointer',
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
