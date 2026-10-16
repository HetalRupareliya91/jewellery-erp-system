const { getDb } = require('../db');
const { round3 } = require('./money');
const { badRequest } = require('./errors');

// Standard fineness (parts per thousand) for common gold grades
const STANDARD_PURITIES = [
  { code: '24K', karat: 24, fineness: 999 },
  { code: '22K', karat: 22, fineness: 916 },
  { code: '20K', karat: 20, fineness: 833 },
  { code: '18K', karat: 18, fineness: 750 },
  { code: '14K', karat: 14, fineness: 585 },
];

function getPurity(id) {
  const row = getDb().prepare('SELECT * FROM purities WHERE id = ?').get(id);
  if (!row) throw badRequest(`Purity ${id} not found`);
  return row;
}

// Pure (24K-equivalent) gold contained in a weight of the given fineness
const fineWeight = (weight, fineness) => round3((Number(weight) * Number(fineness)) / 1000);

const fineWeightFor = (weight, purityId) => fineWeight(weight, getPurity(purityId).fineness);

module.exports = { STANDARD_PURITIES, getPurity, fineWeight, fineWeightFor };
