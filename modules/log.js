'use strict';
/**
 * Логгер на основе модуля winston.
 * @module log
 */

/** Логгер winston. */
const winston = require('winston');

/**
 * Персональные настройки логгера на основе winston.
 * @returns {{error: Function, warn: Function, info: Function, verbose: Function, debug: Function, silly: Function}}
 */
module.exports = new (winston.Logger)({
    exitOnError: false,
    transports:  [new (winston.transports.Console)({
        timestamp: true,
        colorize:  true,
        level:     'silly',
        label:     'Storage.io',
        json:      false
    })]
});
