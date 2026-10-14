const { badRequest } = require('./errors');
const { isIsoDate } = require('./dates');

/*
 * Field definition format used by every module schema:
 *   { type: 'string'|'number'|'int'|'bool'|'date'|'enum'|'ref',
 *     required, default, values (enum), ref (table), min, computed }
 * Computed fields are filled by the service, never accepted from input.
 */
function coerce(name, def, value) {
  switch (def.type) {
    case 'number':
    case 'int': {
      const n = Number(value);
      if (!Number.isFinite(n)) return { error: `${name} must be a number` };
      if (def.type === 'int' && !Number.isInteger(n)) return { error: `${name} must be a whole number` };
      if (def.min !== undefined && n < def.min) return { error: `${name} must be >= ${def.min}` };
      return { value: n };
    }
    case 'ref': {
      const n = Number(value);
      if (!Number.isInteger(n) || n <= 0) return { error: `${name} must be a valid id` };
      return { value: n };
    }
    case 'bool':
      return { value: value === true || value === 1 || value === '1' || value === 'true' ? 1 : 0 };
    case 'date':
      if (!isIsoDate(value)) return { error: `${name} must be a date (YYYY-MM-DD)` };
      return { value: String(value) };
    case 'enum':
      if (!def.values.includes(value)) return { error: `${name} must be one of: ${def.values.join(', ')}` };
      return { value };
    default:
      return { value: String(value).trim() };
  }
}

function validate(schema, input, { partial = false } = {}) {
  const errors = [];
  const out = {};
  for (const [name, def] of Object.entries(schema.fields)) {
    if (def.computed) continue;
    let value = input[name];
    const missing = value === undefined || value === null || value === '';
    if (missing) {
      if (partial) continue;
      if (def.default !== undefined) {
        value = typeof def.default === 'function' ? def.default() : def.default;
      } else if (def.required) {
        errors.push(`${name} is required`);
        continue;
      } else {
        out[name] = null;
        continue;
      }
    }
    const result = coerce(name, def, value);
    if (result.error) errors.push(result.error);
    else out[name] = result.value;
  }
  if (errors.length) throw badRequest('Validation failed', errors);
  return out;
}

module.exports = { validate, coerce };
