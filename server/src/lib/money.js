// Rounding helpers. Money is kept to 2 decimals (paise), metal weight to 3 decimals (milligram).
const round = (value, places) => {
  const factor = 10 ** places;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
};

const round2 = (value) => round(value, 2);
const round3 = (value) => round(value, 3);

const sum = (rows, key) => rows.reduce((total, row) => total + Number(row[key] || 0), 0);

module.exports = { round, round2, round3, sum };
