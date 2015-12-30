'use strict';

var CONSTANTS = require('../lib/constants'),
  app = require('../src/app'),
  logger = require('../lib/log'),
  db = require('../src/models/index'),
  _ = require('lodash');

db.sequelize
  .sync({force: false})
  .finally((err)=>{
    if(err){
      logger.debug('Encountered an error while connecting to Sequelize. Error msg: ' + err);
      logger.debug('Terminating.');
      throw err[0];
    }

    app.listen(CONSTANTS.port, function() {
      logger.info('Express server listening on port ' + CONSTANTS.port);
      logger.verbose('Verbosity: ' + CONSTANTS.verbosity);
    });

    var exitHandler = _.once((error) => {
      if (error) {
        logger.error('Stopping server', {stack: error.stack});
      }
      else {
        logger.info('Stopping server.');
      }
      process.exit();
    });

  });
