'use strict';

const mysql = require('mysql');

/** Extension for DB MySQL/MariaDB. */
class MySQL {
    /** @param {object} connectParam Parameters for connection to cache. */
    constructor(connectParam) {
        this._CLASS = this.constructor.name.toString();

        /**
         * Connection to DB.
         * @type {boolean|pgPromise|IMain}
         */
        this.connection = false;

        /** Connection settings */
        this.options = connectParam;

        // initialize connection
        this.connect();
    }

    /**
     * Initialize connection
     * @returns {mysql|IMain|Error} Connection to DB.
     */
    connect() {
        try {
            if (!this.connection) {
                this.options.connectionLimit = this.options.poolSize;

                this.connection = mysql.createPool(this.options);

                // add handle named placeholders
                this.connection.config.queryFormat = function(query, values) {
                    if (values) {
                        return query.replace(/:(\w+)/g, function(txt, key) {
                            if (values.hasOwnProperty(key)) {
                                return this.escape(values[key]);
                            }
                            return txt;
                        }.bind(this));
                    }

                    return query;
                };
            }

            return this.connection;
        } catch (error) {
            return error;
        }
    }

    /**
     * Send request to DB and getting result.
     * @param {Object} sql Query row.
     * @param {Object=} [param={}] Query parameters.
     * @returns {Promise.<Array|Error>} Resolve with query result. Reject with error.
     */
    _request(sql, param = {}) {
        return new Promise(
            (resolve, reject) => {
                this.connection.query(sql, param, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(result);
                });
            })
            .then(result => {
                if (result.length === 0) {
                    return Promise.resolve(null);
                }

                return Promise.resolve(result);
            });
    }

    /**
     * Set data to DB.
     * @param {Object} sql Query row.
     * @param {Object=} [param={}] Query parameters.
     * @returns {Promise.<Array|Error>} Resolve with query result. Reject with error.
     */
    setData(sql, param = {}) {
        return this._request(sql, param);
    }

    /**
     * Get data from DB.
     * @param {Object} sql Query row.
     * @param {Object=} [param={}] Query parameters.
     * @returns {Promise.<Array|Error>} Resolve with query result. Reject with error.
     */
    getData(sql, param) {
        return this._request(sql, param);
    }

    /**
     * Generate queries list for transaction.
     * @param {String[]} sqlList Queries list.
     * @param {Object[]} [paramList=[]] Queries parameters list.
     * @private
     */
    *_generateRequestsList(sqlList, paramList = []) {
        for (let index in sqlList) {
            if (sqlList.hasOwnProperty(index)) {
                yield this.setData(sqlList[index], paramList[index] || {});
            }
        }
    }

    /**
     * Send queries to DB with transactions.
     * @param {String[]} sqlList Queries list.
     * @param {Object[]} [paramList=[]] Queries parameters list.
     * @returns {Promise} Resolve with array of query results. Reject with error.
     */
    transactionRequest(sqlList, paramList = []) {
        return new Promise(
            (resolve, reject) => {
                // start transaction
                this.connection.beginTransaction(error => {
                    if (error) {
                        reject(error);
                    } else {
                        let requestsList = this._generateRequestsList(sqlList, paramList);

                        // start queries
                        Promise.all([...requestsList])
                            .then(result => { // коммит всех запросов
                                this.connection.commit(error => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(result);
                                    }
                                });
                            })
                            .catch(error => {
                                this.connection.rollback(() => {
                                    reject(error);
                                });
                            });
                    }
                });
            });
    }
}

module.exports = MySQL;
