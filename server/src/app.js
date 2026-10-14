const express = require('express');
const cors = require('cors');
const config = require('./config');
const { loadRoutes } = require('./routes');
const { errorHandler } = require('./lib/errors');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (req, res) => res.json({ status: 'ok', company: config.company.name }));
  app.use('/api', loadRoutes());

  app.use((req, res) => res.status(404).json({ error: `No route for ${req.method} ${req.path}` }));
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
