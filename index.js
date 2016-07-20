'use strict';
/**
 * Module works with external storage (database and cache).
 * @module pragmaStorage
 * @license WTFPL
 */

const fs = require('fs');
const path = require('path');
const ZSchema = require('z-schema');

/** Error handling module for catch on Promise. */
const catchError = require('./modules/catcherr');

/** Class works with external storage (database and cache). */
class PragmaStorage {
    constructor() {
        /** The name of the current class for debug and error log */
        this._CLASS = this.constructor.name.toString();

        /** JSON-schema for check settings */
        this.settingsSchema = require('./schemas/settings.json');
        /** JSON-schema for check queries list */
        this.queriesSchema = require('./schemas/queries.json');
        /** The path to the folder with the modules, extensions to work with individual stores. */
        this.extendsFolder = `${__dirname}/extends/`;
        /** Settings object */
        this.settings = {};
        /** Queries object */
        this.queries = {};
        /** Connections to storages */
        this.connections = {};
        /** Default connection name */
        this.connectionName = 'main';
        /** PragmaStorage state */
        this.state = 'initial';
        /** PragmaStorage ready for work */
        this.ready = false;
        /** JSON-schemas validator object */
        this.validator = new ZSchema();

        /** Parameter contains Redis module */
        this.redis = null;
        /** Parameter contains MySQL module */
        this.mysql = null;
        /** Parameter contains PostgreSQL module */
        this.postgres = null;
        /** Parameter contains Memcache module */
        this.memcache = null;
    }

    /**
     * Check the list of requests for compliance with JSON-scheme.
     * @param {Object} queries Object list requests.
     * @returns {Promise.<Object|Error>} Resolve with empty object, if requests list is empty or checked list
     *     requests. Reject with error.
     * @private
     */
    _validateQueries(queries) {
        if (!queries || Object.keys(queries).length === 0) {
            return Promise.resolve({});
        }

        return this._jsonSchemaValidator(queries, this.queriesSchema);
    }

    /**
     * Checking transferred JSON-array to meet the specified JSON-scheme.
     * @param {Object=} [json={}] JSON for checking.
     * @param {Object=} [schema={}] JSON-scheme to check the transmitted JSON.
     * @returns {Promise.<Object|Error>} Validated JSON or error message.
     * @private
     */
    _jsonSchemaValidator(json = {}, schema = {}) {
        return new Promise(
            (resolve, reject) => {
                this.validator.validate(json, schema, error => {
                    if (error) {
                        reject(error);
                    }

                    resolve(json);
                });
            });
    }

    /**
     * Check query in list by query name
     * @param {String} name Query name.
     * @returns {Boolean} TRUE if query exists or FALSE if not exists.
     * @private
     */
    _existQuery(name) {
        return (name in this.queries);
    }

    /**
     * Check module settings by JSON-schema.
     * @param {Object} settings Object with settings.
     * @returns {Promise.<Object|Error>} Resolve with empty object, if settings is empty or checked settings. Reject
     *     with error.
     * @private
     */
    _validateSettings(settings) {
        if (!settings || Object.keys(settings).length === 0) {
            return Promise.resolve({});
        }

        settings = Object.assign(this.settings, settings);

        if ((('driver' in settings) || ('connection' in settings) || ('redis' in settings)) &&
            Object.keys(settings) > 3) {
            return catchError(`Validate settings`, new Error(`Incorrect settings`));
        }

        return this._jsonSchemaValidator(settings, this.settingsSchema);
    }

    /**
     * Loading expands modules for working with DB and cache.
     * @returns {Promise.<Boolean|Error>} Resolve with TRUE if expands modules loaded. Reject with error.
     * @private
     */
    _loadExtends() {
        return new Promise(
            (resolve, reject) => {
                fs.readdir(this.extendsFolder, (error, result) => {
                    if (error) {
                        reject(error);
                    }

                    resolve(result);
                });
            })
            .then(mayBeFiles => {
                return mayBeFiles.map(file => {
                    file = `${this.extendsFolder}${file}`;
                    if (fs.statSync(file).isFile()) {
                        return file;
                    }

                    return false;
                });
            })
            .then(files => {
                let name;
                for (let file in files) {
                    if (files[file]) {
                        name = path.basename(files[file], '.js');
                        if (!this[name]) {
                            this[name] = require(files[file]);
                        }
                    }
                }

                return Promise.resolve(true);
            });
    }

    /**
     * Set settings for a single connection.
     * @param {Object} settings Object with connection settings.
     * @param {String=} [connectionName='main'] Connection name by default. If not set< will be used name "main".
     * @private
     */
    _applyOneConnection(settings, connectionName = 'main') {
        connectionName = connectionName || this.connectionName;

        this.connections[connectionName] = {
            db: false,
            cache: false
        };

        if (settings.driver && settings.connection) {
            this.connections[connectionName].db = new this[settings.driver](settings.connection);
        }

        if (settings.redis) {
            this.connections[connectionName].cache = new this.redis(settings.redis); // eslint-disable-line new-cap
        }
    }

    /**
     * Set settings for a multiple connection.
     * @param {Object} settings Object with connection settings.
     * @private
     */
    _applyMultiConnection(settings) {
        for (let name in settings) {
            if (settings.hasOwnProperty(name)) {
                this._applyOneConnection(settings[name], name);
            }
        }
    }

    /**
     * Apply settings depending on the content of the settings object.
     * @private
     */
    _applySettings() {
        if (('driver' in this.settings) || ('redis' in this.settings)) {
            this._applyOneConnection(this.settings);
        } else {
            this._applyMultiConnection(this.settings);
        }
    }

    /**
     * Check and apply settings. The old settings will be replaced by new.
     * @param {Object} settings Object with settings.
     * @returns {Promise.<Boolean|Error>} Resolve with TRUE if settings applied. Reject with error.
     * @private
     */
    addSettings(settings) {
        return this._validateSettings(settings)
            .then(result => {
                this.settings = result;
                return Promise.resolve(this.settings);
            })
            .then(() => {
                return this._loadExtends();
            })
            .then(() => {
                this._applySettings();
                return Promise.resolve(true);
            });
    }

    /**
     * Check and apply queries list. New queries will be merged with the old.
     * @param {Object} queries Object with queries.
     * @returns {Promise.<Boolean|Error>} Resolve with TRUE if queries applied. Reject with error.
     * @private
     */
    addQueries(queries) {
        return this._validateQueries(queries)
            .then(result => {
                this.queries = Object.assign(this.queries, result);
                return Promise.resolve(true);
            });
    }

    /**
     * Module initialization.
     * @param {Object=} [settings={}] Object with settings.
     * @param {Object=} [queries={}] Object with queries.
     * @example
     * storage.init({}, {})
     *     .then(result => console.log(`PragmaStorage ready ${storage.ready}`))
     *     .catch(error => console.error(error));
     * @returns {Promise.<String|Error>} Resolve with module initialization state. Reject with error.
     */
    init(settings = {}, queries = {}) {
        this.ready = false;
        this.state = 'waiting';
        return this.addSettings(settings)
            .then(() => {
                return this.addQueries(queries);
            })
            .then(() => {
                this.state = 'ready';
                this.ready = !!Object.keys(this.settings);
                return Promise.resolve(this.ready);
            })
            .catch(error => {
                this.state = 'failed';
                return catchError(`${this.init.name}`, error);
            });
    }

    /**
     * Getting object uninitialized module connection to a database or cache by name.
     * @param {String} [driverName=''] Module (driver) name.
     * @returns {Object|Null} Uninitialized connection module or NULL.
     */
    getDriver(driverName = '') {
        return this[driverName] || null;
    }

    /**
     * Getting active connections to the database by name specified in the settings.
     * @param {String} connectionName Connection name.
     * @returns {Object|Null} Initialized connection DB module or NULL.
     */
    getDBConnection(connectionName) {
        connectionName = connectionName || this.connectionName;

        return this.connections[connectionName].db || null;
    }

    /**
     * Getting active compound with keshom the title specified in the settings.
     * @param {String} connectionName Connection name.
     * @returns {Object|Null} Initialized connection cache module or NULL.
     */
    getCacheConnection(connectionName) {
        connectionName = connectionName || this.connectionName;

        return this.connections[connectionName].cache || null;
    }

    /**
     * Check exists query settings by name and check exists connection.
     * @param {String} queryName Query settings name.
     * @returns {Promise.<Object|Error>} Resolve with query settings object. Reject with error.
     * @private
     */
    _checkName(queryName) {
        return new Promise(
            (resolve, reject) => {
                if (!this._existQuery(queryName) || !this.queries[queryName]) {
                    return reject(new Error(`${this._CLASS}: can't get query by "${queryName}"`));
                }

                let query = Object.assign({}, this.queries[queryName]);
                query.connection = query.connection || this.connectionName;

                if (!this.connections[query.connection]) {
                    return reject(new Error(`${this._CLASS}: undefined connection "${query.connection}"`));
                }

                resolve(query);
            });
    }

    /**
     * Add to query row additional parameters.
     * @param {Object} query Query settings object.
     * @param {Object} param Parameters for query.
     * @returns {Promise.<Object|Error>} Resolve with query settings object. Reject with error.
     * @private
     */
    _additionQuery(query, param) {
        return new Promise((resolve, reject) => {
            try {
                if (query.addition) {
                    let addition = '';
                    for (let name in query.addition) {
                        if (query.addition.hasOwnProperty(name)) {
                            addition = (name in param) ? query.addition[name] : '';
                            query.sql = query.sql.replace(`$>${name}<`, addition);
                        }
                    }
                }

                resolve(query);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get data from storage (cache or DB). Getting data will be automating cachied, if caching is true.
     * @param {String} queryName Query settings name.
     * @param {Object=} [param={}] Parameters for query.
     * @returns {Promise.<Array|Error>} Resolve with data from storage. Reject with error.
     */
    getData(queryName, param = {}) {
        let query = {};

        return this._checkName(queryName)
            .then(result => {
                query = result;
                return Promise.resolve(result);
            })
            .then(result => {
                if (this.connections[result.connection].cache) {
                    return this.connections[result.connection].cache.getData(queryName, param);
                }

                return Promise.resolve(null);
            })
            .then(result => {
                if (!this.connections[query.connection].db) {
                    return Promise.resolve(result);
                }

                return this._additionQuery(query, param)
                    .then(result => {
                        return this.connections[result.connection].db.getData(result.sql, param);
                    })
                    .then(result => {
                        if (this.connections[query.connection].cache && result && query.caching) {
                            this.connections[query.connection].cache.setData(queryName, param, result, query.expire);
                        }

                        return Promise.resolve(result);
                    });
            })
            .catch(error => {
                return catchError(`${this.getData.name}`, error);
            });
    }

    /**
     * Get data from DB, without using cache. Results not be placed on cache.
     * @param {String} queryName Query settings name.
     * @param {Object=} [param={}] Parameters for query.
     * @returns {Promise.<Array|Error>} Resolve with data from DB. Reject with error.
     */
    getFromDB(queryName, param = {}) {
        return this._checkName(queryName)
            .then(result => {
                return this._additionQuery(result, param);
            })
            .then(result => {
                return this.connections[result.connection].db.getData(result.sql, param);
            })
            .catch(error => {
                return catchError(`${this.getFromDB.name}`, error);
            });
    }

    /**
     * Get data only from cache.
     * @param {String} [connectionName='main'] Name connection to storage.
     * @param {String} cacheName Cache key name.
     * @returns {Promise.<Array|*|Error>} Resolve with data from cache. Reject with error.
     */
    getFromCache(connectionName, cacheName) {
        connectionName = connectionName || this.connectionName;

        return this.connections[connectionName].cache.getData(cacheName)
            .catch(error => {
                return catchError(`${this.getFromCache.name}`, error);
            });
    }

    /**
     * Put data to DB without using cache.
     * @param {String} queryName Query settings name.
     * @param {Object=} [param={}] Parameters for query.
     * @returns {Promise.<Array|Error>} Resolve with result of putting data. Reject with error.
     */
    setToDB(queryName, param = {}) {
        return this._checkName(queryName)
            .then(result => {
                return this._additionQuery(result, param);
            })
            .then(result => {
                return this.connections[result.connection].db.setData(result.sql, param);
            })
            .catch(error => {
                return catchError(`${this.setToDB.name}`, error);
            });
    }

    /**
     * Put data only to cache.
     * @param {String} connectionName Name connection to storage.
     * @param {String} cacheName Cache key name.
     * @param {*} data Data for placed in cache.
     * @param {Number} expire Cache lifetime. 0 - immortal cache.
     * @returns {Promise.<Array|Error>} Resolve with result of putting data. Reject with error.
     */
    setToCache(connectionName, cacheName, data, expire = 0) {
        connectionName = connectionName || this.connectionName;

        return this.connections[connectionName].cache.setData(cacheName, data, expire)
            .catch(error => {
                return catchError(`${this.transactionToDB.name}`, error);
            });
    }

    /**
     * Generate array for checking query names list.
     * @param {String[]} namesList List of query names.
     * @private
     */
    *_checkTransactionNames(namesList) {
        for (let index in namesList) {
            if (namesList.hasOwnProperty(index)) {
                yield this._checkName(namesList[index]);
            }
        }
    }

    /**
     * Generate array for adding to query row additional parameters.
     * @param {Object[]} queriesList Queries settings list.
     * @param {Object[]} [paramList=[]] List parameters for queries.
     * @private
     */
    *_additionTransactionQuery(queriesList, paramList = []) {
        for (let index in queriesList) {
            if (queriesList.hasOwnProperty(index)) {
                yield this._additionQuery(queriesList[index], paramList[index] || {});
            }
        }
    }

    /**
     * Checking for identical connections to the database for transactional queries.
     * @param {Object[]} connectionsList Queries settings list.
     * @returns {Promise.<Object|Error>} Resolve with checked queries settings list. Reject with error.
     * @private
     */
    _checkIdenticalConnections(connectionsList) {
        return new Promise(
            (resolve, reject) => {
                let connectionName = connectionsList[0].connection || this.connectionName;

                let checker = function(element) {
                    return element.connection === connectionName;
                };

                if (connectionsList.every(checker)) {
                    resolve(connectionsList);
                } else {
                    reject(new Error(`Detected for different database connection`));
                }
            });
    }

    /**
     * Getting SQL-queries from queries settings list for transactional queries.
     * @param {Object[]} connectionsList Queries settings list.
     * @returns {Promise.<Array|Error>} Resolve with SQL-queries list. Reject with error.
     * @private
     */
    _extractTransactionQueries(connectionsList) {
        return new Promise((resolve, reject) => {
            try {
                resolve(connectionsList.map(val => {
                    return val.sql;
                }));
            } catch (error) {
                reject(new Error(error));
            }
        });
    }

    /**
     * Sending transactional queries to DB and get the results.
     * @param {String[]} sqlList Queries names list.
     * @param {Object[]} [paramList=[]] Queries parameters list.
     * @returns {Promise.<Array|Error>} Resolve with transactional queries results. Reject with error.
     */
    transactionToDB(sqlList, paramList = []) {
        if (!Array.isArray(sqlList)) {
            Promise.reject(`Names for transaction query must be in array`);
        }

        if (!Array.isArray(paramList)) {
            Promise.reject(`Parameters for transaction query must be in array`);
        }

        let checkNamesList = this._checkTransactionNames(sqlList);
        let connectionName = 'main';

        return Promise.all([...checkNamesList])
            .then(connectionsList => {
                return this._checkIdenticalConnections(connectionsList);
            })
            .then(connectionsList => {
                connectionName = connectionsList[0].connection || connectionName;
                let additionQueries = this._additionTransactionQuery(connectionsList, paramList);

                return Promise.all([...additionQueries]);
            })
            .then(connectionsList => {
                return this._extractTransactionQueries(connectionsList);
            })
            .then(queriesSql => {
                return this.connections[connectionName].db.transactionRequest(queriesSql, paramList);
            })
            .catch(error => {
                return catchError(`${this.transactionToDB.name}`, error);
            });
    }

    /**
     * Sending transactional queries to cache and get results.
     * @param {String} connectionName Name connection to storage.
     * @param {String[]} actionsList Actions list ("get" or "set").
     * @param {String[]} namesList Cache keys list.
     * @param {Array} [dataList=[]] List of data to placing in cache.
     * @param {Number[]} [expiresList=[]] List of cache lifetimes (only for action "set").
     * @returns {Promise.<Array|Error>} Resolve with list results of queries to cache. Reject with error.
     */
    transactionToCache(connectionName, actionsList, namesList, dataList = [], expiresList = []) {
        if (!Array.isArray(actionsList)) {
            Promise.reject(`Actions for transaction query must be in array`);
        }

        if (!Array.isArray(namesList)) {
            Promise.reject(`Names for transaction query must be in array`);
        }

        connectionName = connectionName || this.connectionName;

        return this.connections[connectionName].cache.transactionRequest(actionsList, namesList, dataList, expiresList)
            .catch(error => {
                return catchError(`${this.getFromCache.name}`, error);
            });
    }

    /**
     * Update data in cache from DB. Returned getting from DB data.
     * @param {String} queryName Query settings name.
     * @param {Object=} [param={}] Parameters for query.
     * @returns {Promise.<Array|Error>} Resolve with data from DB. Reject with error.
     */
    reloadFromDBToCache(queryName, param = {}) {
        let query = {};

        return this._checkName(queryName)
            .then(result => {
                query = result;
                return this._additionQuery(query, param);
            })
            .then(result => {
                if (!this.connections[query.connection].db) {
                    return Promise.resolve(null);
                }

                return this.connections[result.connection].db.getData(result.sql, param);
            })
            .then(result => {
                if (this.connections[query.connection].cache) {
                    if (result && query.caching) {
                        this.connections[query.connection].cache.setData(queryName, result, query.expire, param);
                    }
                }

                return Promise.resolve(result);
            })
            .catch(error => {
                return catchError(`${this.reloadFromDBToCache.name}`, error);
            });
    }
}

module.exports = new PragmaStorage();
