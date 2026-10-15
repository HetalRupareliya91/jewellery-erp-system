import { useEffect, useState } from 'react';
import { api } from '../api';

/*
 * Loads lookup lists for every ref field (purities, karigars, customers...)
 * and returns { [field.name]: { options: [{value,label}], byId: {id: label} } }.
 */
export default function useRefOptions(fields) {
  const [refs, setRefs] = useState({});
  const key = fields.filter((f) => f.ref).map((f) => f.ref).join(',');

  useEffect(() => {
    let alive = true;
    const refFields = fields.filter((f) => f.ref);
    Promise.all(
      refFields.map((f) =>
        api
          .get(`/${f.ref}?limit=500`)
          .then((res) => [f.name, res.data])
          .catch(() => [f.name, []]),
      ),
    ).then((pairs) => {
      if (!alive) return;
      const out = {};
      for (const [name, rows] of pairs) {
        const field = refFields.find((f) => f.name === name);
        const options = rows.map((r) => ({ value: r.id, label: String(r[field.display] ?? `#${r.id}`) }));
        out[name] = { options, byId: Object.fromEntries(options.map((o) => [o.value, o.label])) };
      }
      setRefs(out);
    });
    return () => {
      alive = false;
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return refs;
}
