import { useState } from 'react';
import { label as pretty } from '../format';

function Input({ field, value, onChange, refs }) {
  const common = { id: field.name, value: value ?? '', onChange: (e) => onChange(e.target.value) };
  switch (field.type) {
    case 'enum':
      return (
        <select {...common}>
          {!field.required && <option value="">—</option>}
          {field.options.map((o) => (
            <option key={o} value={o}>{pretty(o)}</option>
          ))}
        </select>
      );
    case 'ref':
      return (
        <select {...common}>
          <option value="">— select —</option>
          {(refs[field.name]?.options || []).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    case 'bool':
      return <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />;
    case 'date':
      return <input type="date" {...common} />;
    case 'number':
    case 'int':
      return <input type="number" step={field.type === 'int' ? 1 : 'any'} {...common} />;
    default:
      return <input type="text" {...common} />;
  }
}

// Create / edit form generated from the page's field list
export default function EntityForm({ fields, initial, refs, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial || {});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const editable = fields.filter((f) => !f.computed);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      {error && <div className="error">{error}</div>}
      <div className="form-grid">
        {editable.map((f) => (
          <label key={f.name} className="field" htmlFor={f.name}>
            <span>{f.label}{f.required ? ' *' : ''}</span>
            <Input field={f} refs={refs} value={values[f.name]} onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))} />
          </label>
        ))}
      </div>
      <div className="form-actions">
        <button type="submit" className="primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
