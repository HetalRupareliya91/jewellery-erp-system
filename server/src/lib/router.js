const express = require('express');

// Wraps a handler so thrown errors (sync or async) reach the error middleware
const handle = (fn) => (req, res, next) => {
  try {
    const result = fn(req, res);
    if (result && typeof result.then === 'function') {
      result.then((value) => value !== undefined && res.json(value)).catch(next);
    } else if (result !== undefined) {
      res.json(result);
    }
  } catch (err) {
    next(err);
  }
};

/*
 * Standard REST endpoints for a crud() service.
 * `extend(router)` runs first so custom routes like /latest win over /:id.
 */
function makeCrudRouter(service, { extend, readOnly = false } = {}) {
  const router = express.Router();
  if (extend) extend(router);
  router.get('/', handle((req) => service.list(req.query)));
  router.get('/:id', handle((req) => (service.getDetail || service.get)(Number(req.params.id))));
  if (!readOnly) {
    router.post('/', handle((req, res) => {
      res.status(201);
      return service.create(req.body || {});
    }));
    router.put('/:id', handle((req) => service.update(Number(req.params.id), req.body || {})));
    router.delete('/:id', handle((req) => service.remove(Number(req.params.id))));
  }
  return router;
}

module.exports = { makeCrudRouter, handle };
