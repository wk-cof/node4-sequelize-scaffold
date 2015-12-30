'use strict';
var defaultRoutes = require('./default-routes'),
  logger = require('../../lib/log'),
  demoRoutes = require('../controllers/demo');

module.exports = (app) => {
	defaultRoutes(app);
	app.route('/demos')
		.post(demoRoutes.postDemo)
		.get(demoRoutes.getDemos)
	logger.debug('Startup: Added /demos routes');

	app.route('/demos/:id')
		.get(demoRoutes.getOneDemo)
		.put(demoRoutes.putDemo)
		.delete(demoRoutes.deleteDemo);
	logger.debug('Startup: Added /demos/:id routes');

};