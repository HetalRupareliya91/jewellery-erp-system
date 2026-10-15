module.exports = {
  table: 'purities',
  label: 'Purity',
  search: ["code", "description"],
  fields: {
    code: { type: 'string', required: true, unique: true },
    metal: { type: 'enum', values: ["gold", "silver", "platinum"], default: "gold" },
    karat: { type: 'number', min: 0 },
    fineness: { type: 'number', required: true, min: 1 },
    description: { type: 'string' },
  },
  // Example payload, used by docs and tests
  sample: {"code": "22K", "metal": "gold", "karat": 22, "fineness": 916, "description": "22 karat hallmark gold"},
};
