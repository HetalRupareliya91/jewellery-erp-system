import { useCallback, useEffect, useState } from 'react';
import { api, qs } from '../api';
import { label as pretty } from '../format';
import DataTable from './DataTable';
import EntityForm from './EntityForm';
import useRefOptions from './useRefOptions';

const MAX_COLUMNS = 9;

/*
 * List + search + create/edit/delete screen for any API resource.
 * Driven entirely by the `fields` config each page exports.
 */
export default function EntityPage({ resource, title, fields, readOnly = false, children }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const refs = useRefOptions(fields);

  const load = useCallback(() => {
    api
      .get(`/${resource}${qs({ q, limit: 200 })}`)
      .then((res) => {
        setRows(res.data);
        setTotal(res.total);
      })
      .catch((err) => setError(err.message));
  }, [resource, q]);

  useEffect(load, [load]);

  const columns = fields.slice(0, MAX_COLUMNS).map((f) => ({
    name: f.name,
    label: f.label,
    render:
      f.type === 'ref'
        ? (row) => refs[f.name]?.byId[row[f.name]] ?? row[f.name] ?? ''
        : f.type === 'enum'
          ? (row) => (row[f.name] ? <span className="badge">{pretty(row[f.name])}</span> : '')
          : f.type === 'bool'
            ? (row) => (row[f.name] ? 'Yes' : 'No')
            : undefined,
  }));

  async function save(values) {
    if (editing.id) await api.put(`/${resource}/${editing.id}`, values);
    else await api.post(`/${resource}`, values);
    setEditing(null);
    load();
  }

  async function remove(row) {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.del(`/${resource}/${row.id}`);
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <h1>{title} <span className="muted" style={{ fontSize: 14 }}>({total})</span></h1>
        <div className="toolbar">
          <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          {!readOnly && <button className="primary" onClick={() => setEditing({})}>+ New</button>}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {children}
      {editing && (
        <>
          <EntityForm key={editing.id || 'new'} fields={fields} initial={editing} refs={refs} onSubmit={save} onCancel={() => setEditing(null)} />
          {editing.id && (
            <div style={{ marginTop: -8, marginBottom: 16 }}>
              <button className="danger" onClick={() => remove(editing)}>Delete</button>
            </div>
          )}
        </>
      )}
      <DataTable columns={columns} rows={rows} onRowClick={readOnly ? undefined : (row) => setEditing(row)} />
    </div>
  );
}
