const today = () => new Date().toISOString().slice(0, 10);

const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value)) && !Number.isNaN(Date.parse(value));

// Indian financial year label for a date, e.g. 2026-05-10 -> "26-27", 2026-02-01 -> "25-26"
function financialYear(date = today()) {
  const [y, m] = date.split('-').map(Number);
  const start = m >= 4 ? y : y - 1;
  return `${String(start).slice(2)}-${String(start + 1).slice(2)}`;
}

function monthRange(month) {
  if (!/^\d{4}-\d{2}$/.test(String(month))) return null;
  const [y, m] = month.split('-').map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return { from: `${month}-01`, to: `${month}-${String(last).padStart(2, '0')}` };
}

module.exports = { today, isIsoDate, financialYear, monthRange };
