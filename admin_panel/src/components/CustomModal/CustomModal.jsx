export default function CustomModal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(560px, calc(100% - 32px))',
          background: 'var(--background-color)',
          color: 'var(--text-color)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          fontFamily: 'var(--font-family)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
          <strong>{title}</strong>
          <button type="button" onClick={onClose} style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
