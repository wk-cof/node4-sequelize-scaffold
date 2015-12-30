'use strict';
var logger = require('../../lib/log');
module.exports = (app) => {
  app.get('/status', (req, res) => res.send('SUCCESS') );
  app.get('/', (req, res) => res.send('SUCCESS') );
  logger.debug('Startup: Added default routes');
};
