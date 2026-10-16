const { makeCrudRouter } = require('../../lib/router');
const service = require('./service');

module.exports = { path: '/purities', router: makeCrudRouter(service) };
