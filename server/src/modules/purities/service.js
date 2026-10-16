const { crud } = require('../../lib/crud');
const schema = require('./schema');

module.exports = crud(schema);
