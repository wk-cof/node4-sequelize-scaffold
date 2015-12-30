'use strict';
var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  lodash = require('lodash'),
  db = {},
  log = require('../../lib/log'),
  CONSTANTS = require('../../lib/constants');

var sequelize = new Sequelize(CONSTANTS.db_name, CONSTANTS.db_user, CONSTANTS.db_password, {
    host: CONSTANTS.db_host,
    dialect: CONSTANTS.db_dialect,
    pool: {maxConnections: 20},
    logging: log.verbose,
    timezone: '-04:00UTC' //Set the timezone to local time, since default is UTC
  });

//Read in the model files and create them
fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);