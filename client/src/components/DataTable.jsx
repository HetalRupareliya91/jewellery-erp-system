import { auto } from '../format';

/*
 * columns: [{ name, label, render?(row) }]
 * Numbers are right-aligned and formatted from the column name (g, ₹).
 */
export default function DataTable({ columns, rows, onRowClick, footer, empty = 'Nothing here yet.' }) {
  if (!rows || rows.length === 0) return <div className="card muted">{empty}</div>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.name} className={typeof rows[0][c.name] === 'number' ? 'num' : ''}>
                {c.label || c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id ?? i} onClick={onRowClick ? () => onRowClick(row) : undefined} style={onRowClick ? { cursor: 'pointer' } : undefined}>
              {columns.map((c) => (
                <td key={c.name} className={typeof row[c.name] === 'number' && !c.render ? 'num' : ''}>
                  {c.render ? c.render(row) : auto(c.name, row[c.name])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer && (
          <tfoot>
            <tr>
              {columns.map((c) => (
                <td key={c.name} className={typeof footer[c.name] === 'number' ? 'num' : ''}>
                  {footer[c.name] !== undefined ? auto(c.name, footer[c.name]) : ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
