'use strict';

const pgPromise = require('pg-promise')();

/** Extension for DB PostgreSQL. */
class PostgreSQL {
    /** @param {Object} connectParam Parameters for connection to cache. */
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
     * @returns {pgPromise|IMain|Error} Connection to DB.
     */
    connect() {
        try {
            if (!this.connection) {
                this.connection = pgPromise(this.options);
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
        return this.connection.any(sql, param)
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
    getData(sql, param = {}) {
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
                yield this.connection.any(sqlList[index], paramList[index] || {});
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
        return this.connection.tx(() => {
            let requestsList = [];

            for (let index in sqlList) {
                if (sqlList.hasOwnProperty(index)) {
                    requestsList.push(this.connection.any(sqlList[index], paramList[index] || {}));
                }
            }

            return this.batch(requestsList);
        });
    }
}

module.exports = PostgreSQL;
