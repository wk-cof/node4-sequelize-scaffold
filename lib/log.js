'use strict';
var winston = require('winston');
var CONSTANTS = require('./constants');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { level: CONSTANTS.verbosity, colorize: true });
module.exports = winston;