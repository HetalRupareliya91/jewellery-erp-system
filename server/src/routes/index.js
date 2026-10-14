const fs = require('fs');
const path = require('path');
const express = require('express');

/*
 * Mounts every module that exposes a routes.js:
 *   module.exports = { path: '/karigars', router }
 * New modules are picked up automatically, so adding one never touches this file.
 */
function loadRoutes() {
  const api = express.Router();
  const modulesDir = path.join(__dirname, '..', 'modules');
  const mounted = [];
  if (fs.existsSync(modulesDir)) {
    for (const name of fs.readdirSync(modulesDir).sort()) {
      const file = path.join(modulesDir, name, 'routes.js');
      if (!fs.existsSync(file)) continue;
      const mod = require(file);
      api.use(mod.path, mod.router);
      mounted.push(mod.path);
    }
  }
  api.get('/', (req, res) => res.json({ endpoints: mounted.sort() }));
  return api;
}

module.exports = { loadRoutes };
