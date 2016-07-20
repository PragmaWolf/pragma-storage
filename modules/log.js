'use strict';

const winston = require('winston');

/**
 * Customized settings for logger module "winston".
 * @returns {Object} Configured logger object.
 */
module.exports = new (winston.Logger)({
    exitOnError: false,
    transports:  [new (winston.transports.Console)({
        timestamp: true,
        colorize:  true,
        level:     'silly',
        label:     'PragmaStorage',
        json:      false
    })]
});
