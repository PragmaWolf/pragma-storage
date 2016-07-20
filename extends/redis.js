'use strict';

const redis = require('redis');

/** Extension for Redis cache. */
class Redis {
    /** @param {Object} connectParam Parameters for connection to cache. */
    constructor(connectParam) {
        this._CLASS = this.constructor.name.toString();

        /**
         * Connection to cache.
         * @type {Boolean|RedisClient|exports.createClient}
         */
        this.connection = false;

        // prefix for cache keys must be ended by colon
        if (('prefix' in connectParam) && !connectParam.prefix.endsWith(':')) {
            connectParam.prefix += ':';
        }

        /** Connection settings */
        this.options = connectParam;

        // initialize connection
        this.connect();
    }

    /**
     * Initialize connection
     * @returns {Redis.connection} Connection to cache.
     */
    connect() {
        try {
            if (!this.connection) {
                this.connection = redis.createClient(this.options);
            }

            return this.connection;
        } catch (error) {
            return error;
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Set parameters for query to string for use in cache key.
     * @param {Object=} [param={}] Parameters for queery.
     * @returns {String} String for use in cache key.
     * @private
     */
    _compileParam(param = {}) {
        let key = '';

        if (typeof param !== 'object' || Object.keys(param).length === 0) {
            return key;
        }

        for (let paramName in param) {
            if (param.hasOwnProperty(paramName)) {
                let paramVal = param[paramName];

                // обрезка длины строковых значений
                if (typeof param[paramName] === 'string' && param[paramName].length > 16) {
                    paramVal = paramVal.substr(0, 15);
                }

                key += `:${paramName}:${paramVal}`;
            }
        }

        return key;
    }

    /**
     * Generate cache key.
     * @param {String} queryName Query name.
     * @param {Object=} [param={}] Parameters for query.
     * @returns {String} Cache key.
     * @private
     */
    _compileKey(queryName, param = {}) {
        return `${queryName}${this._compileParam(param)}`;
    }

    /**
     * Get data from cache.
     * @param {String} queryName Query name.
     * @param {Object=} [param={}] Parameters for query.
     * @returns {Promise.<Array|Error>} Resolve with data from cache. Reject with error.
     */
    getData(queryName, param = {}) {
        let cacheKey = this._compileKey(queryName, param);

        return new Promise(
            // получаем данные из кэша
            (resolve, reject) => {
                this.connection.get(cacheKey, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                });
            })
            .then(result => { // парсим полученные данные
                if (!result) {
                    return Promise.resolve(null);
                }

                try {
                    let parsed = JSON.parse(result);
                    return Promise.resolve(parsed);
                } catch (error) {
                    return Promise.resolve(result);
                }
            });
    }

    /**
     * Putting datd to cache.
     * @param {String} queryName Query name.
     * @param {*=} [data={}] Data for placed in cache.
     * @param {Number=} [expire=0] Cache lifetime.
     * @param {Object=} [param={}] Parameters for query.
     * @returns {Promise.<Array|Error>} Resolve with result of putting data to cache. Reject with error.
     */
    setData(queryName, data = {}, expire = 0, param = {}) {
        let cacheKey = this._compileKey(queryName, param);

        return new Promise(
            // пихаем данные в кэш
            (resolve, reject) => {
                data = JSON.stringify(data);
                if (expire > 0) {
                    this.connection.setex(cacheKey, expire, data, (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        resolve(result);
                    });
                } else {
                    this.connection.set(cacheKey, data, (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        resolve(result);
                    });
                }
            });
    }

    /**
     * Transaction queries to cache.
     * @param {String[]} actionsList Actions list ("get" or "set").
     * @param {String[]} namesList Cache keys list.
     * @param {Object[]} [dataList=[]] List of data to placing in cache.
     * @param {Number[]} [expiresList=[]] List of cache lifetimes (only for action "set").
     * @returns {Promise.<Array|Error>} Resolve with result of putting data to cache. Reject with error.
     */
    transactionRequest(actionsList, namesList, dataList = [], expiresList = []) {
        return new Promise(
            (resolve, reject) => {
                // generate queries list
                let multiRequests = [];
                for (let index in actionsList) {
                    if (!actionsList.hasOwnProperty(index)) {
                        continue;
                    }

                    let oneRequest = [];
                    let action = 'get';
                    if (actionsList[index] === 'set') {
                        action = expiresList[index] ? 'setex' : 'set';
                    }
                    if (expiresList[index]) {
                        oneRequest = [
                            action,
                            namesList[index],
                            expiresList[index],
                            JSON.stringify(dataList[index])
                        ];
                    } else {
                        oneRequest = [
                            action,
                            namesList[index],
                            JSON.stringify(dataList[index])
                        ];
                    }
                    multiRequests.push(oneRequest);
                }

                // send queries to cache and get results
                this.connection.multi(multiRequests)
                    .exec((error, results) => {
                        if (error) {
                            reject(error);
                        }

                        resolve(results);
                    });
            })
            .then(result => {
                Promise.resolve(result.map(value => {
                    if (!value) {
                        return null;
                    }

                    try {
                        return JSON.parse(result);
                    } catch (error) {
                        return result;
                    }
                }));
            });
    }
}

module.exports = Redis;
