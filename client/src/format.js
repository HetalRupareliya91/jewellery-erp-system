const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const num = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 3 });

export const money = (v) => (v === null || v === undefined ? '' : inr.format(v));
export const grams = (v) => (v === null || v === undefined ? '' : `${num.format(v)} g`);
export const number = (v) => (v === null || v === undefined ? '' : num.format(v));
export const label = (s) => String(s || '').replace(/_/g, ' ');
export const todayIso = () => new Date().toISOString().slice(0, 10);

const MONEY_HINTS = ['value', 'amount', 'charge', 'total', 'paid', 'subtotal', 'gst', 'balance', 'rate', 'cost', 'limit', 'cgst', 'sgst', 'igst'];
const WEIGHT_HINTS = ['weight', 'fine', 'gross', 'net'];

// Picks a display format from the column name
export function auto(name, value) {
  if (typeof value !== 'number') return value === null || value === undefined ? '' : String(value);
  if (name.endsWith('_id') || name === 'id') return String(value);
  if (name.includes('percent') || name === 'fineness' || name === 'karat') return number(value);
  if (WEIGHT_HINTS.some((h) => name.includes(h))) return grams(value);
  if (MONEY_HINTS.some((h) => name.includes(h))) return money(value);
  return number(value);
}
