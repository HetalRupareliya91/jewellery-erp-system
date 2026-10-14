// Thin fetch wrapper for the Jewellery ERP API
async function request(method, path, body) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const details = Array.isArray(data.details) ? `: ${data.details.join(', ')}` : '';
    throw new Error(`${data.error || res.statusText}${details}`);
  }
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body || {}),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path),
};

export const qs = (params) => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')).toString();
  return s ? `?${s}` : '';
};
