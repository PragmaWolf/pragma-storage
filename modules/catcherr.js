'use strict';
/**
 * Модуль обработки и передачи дальше ошибок в блоках catch у Promise.
 * @module catcherr
 */

/**
 * Персональные настройки логгера на основе winston.
 * @type {*|{error: Function, warn: Function, info: Function, verbose: Function, debug: Function, silly: Function}}
 */
const log = require('./log');

/**
 * Модуль обработки и возврата ошибок в блоках catch у Promise.
 * @param {String} object Название объекта.
 * @param {String|Object} error Объект ошибки.
 * @param {String} [level=warn] Уровень ошибки.
 * @returns {Promise} Промис в состоянии reject с сообзщением об ошибке.
 */
module.exports = (object, error, level = 'warn') => {
    log[level](`${object}:`, error);
    return Promise.reject(error);
};
