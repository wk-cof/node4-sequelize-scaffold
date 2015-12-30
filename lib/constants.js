'use strict';
var env = require('./env.json') || {};

const CONSTANTS = {
  "port":  process.env.PORT || process.env.app_port || env.port || 8001,
  "verbosity": process.env.verbosity || env.verbosity || 'info',
  "db_name": process.env.db_name || env.db_name || null,
  "db_user": process.env.db_user || env.db_user || null,
  "db_password": process.env.db_password || env.db_password || null,
  "db_host": process.env.db_host || env.db_host || null,
  "db_dialect": process.env.db_dialect || env.db_dialect || "mysql"
};

module.exports = CONSTANTS;