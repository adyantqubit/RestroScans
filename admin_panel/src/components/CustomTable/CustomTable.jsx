export default function CustomTable({ columns = [], rows = [] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-family)', color: 'var(--text-color)' }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} style={{ textAlign: 'left', padding: 'var(--space-3)', borderBottom: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id || index}>
            {columns.map((column) => (
              <td key={column.key} style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border-color)' }}>
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
