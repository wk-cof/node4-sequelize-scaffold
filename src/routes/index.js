'use strict';
var defaultRoutes = require('./default-routes'),
  logger = require('../../lib/log'),
  demoRoutes = require('../controllers/demo');

module.exports = (app) => {
  defaultRoutes(app);
  app.route('/demo')
    .get(demoRoutes.getDemos)
    .post(demoRoutes.postDemo)
    .put(demoRoutes.putDemo)
    .delete(demoRoutes.deleteDemo);
  logger.debug('Startup: Added /demo routes');

};