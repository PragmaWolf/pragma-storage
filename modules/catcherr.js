'use strict';

const log = require('./log');

/**
 * Error handling and returns for catch blocks in Promise.
 * @param {String} object Object name.
 * @param {String|Object} error Error object.
 * @param {String} [level=warn] Error level.
 * @returns {Promise.<Error>} Reject with error.
 */
module.exports = (object, error, level = 'warn') => {
    log[level](`${object}:`, error);
    return Promise.reject(error);
};
