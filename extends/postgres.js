'use strict';
/**
 * Модуль работы с базой данных.
 * @module postgresql
 * @license WTFPL
 */

/**
 * Модуль работы с PostgreSQL.
 * @type {pgPromise|IMain|*}
 */
const pgPromise = require('pg-promise')();

/**
 * Класс работы с базой данных.
 * При инициализации автоматически инициирует подключение к базе данных и сохраняет его в себе.
 */
class PostgreSQL {
    /**
     * Конструктор класса.
     * @param {object} connectParam Параметры соединения с БД.
     */
    constructor(connectParam) {
        /** Название текущего класса для дебага и лога ошибок */
        this._CLASS = this.constructor.name.toString();

        /**
         * Свойство для хранения текущего соединения.
         * @type {boolean|pgPromise|IMain}
         */
        this.connection = false;

        /** Хранилище настроек подключения к Redis */
        this.options = connectParam;

        // инициализируем подключение к кэшу
        this.connect();
    }

    /**
     * Создание и получение подключения с БД. Если подключение уже создано, повторно создаваться оно не будет.
     * @returns {pgPromise|IMain|Error} Объект с соединением с БД или объект с ошибкой.
     */
    connect() {
        try {
            // если коннект еще не установлен
            if (!this.connection) {
                this.connection = pgPromise(this.options);
            }

            return this.connection;
        } catch (error) {
            return error;
        }
    }

    /**
     * Отправка запроса в БД и получение результата.
     * @param {object} sql Объект с данными запроса.
     * @param {object=} [param={}] Параметры запроса.
     * @returns {Promise} Промис в состоянии resolve с результатом запроса или reject с сообщением об ошибке.
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
     * Помещение данных в БД.
     * @param {object} sql Объект с данными запроса.
     * @param {object=} [param={}] Параметры запроса.
     * @returns {Promise} Промис в состоянии resolve или reject с сообщением об ошибке.
     */
    setData(sql, param = {}) {
        return this._request(sql, param);
    }

    /**
     * Получение данных из БД.
     * @param {object} sql Объект с данными запроса.
     * @param {object=} [param={}] Параметры запроса.
     * @returns {Promise} Промис в состоянии resolve или reject с сообщением об ошибке.
     * @alias request
     */
    getData(sql, param = {}) {
        return this._request(sql, param);
    }

    /**
     * Генератор параллельных запросов к БД для транзакции.
     * @param {string[]} sqlList Список SQL-запросов.
     * @param {object[]} [paramList=[]] Список параметров для запросов.
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
     * Помещение данных в БД через транзакцию.
     * @param {string[]} sqlList Список SQL-запросов.
     * @param {object[]} [paramList=[]] Список параметров для запросов.
     * @returns {Promise} resolve с массивом результататов транзакции reject с сообщением об ошибке.
     */
    transactionRequest(sqlList, paramList = []) {
        return this.connection.tx(() => {
            let requestsList = [];

            for (let index in sqlList) {
                if (sqlList.hasOwnProperty(index)) {
                    requestsList.push(this.any(sqlList[index], paramList[index] || {}));
                }
            }

            return this.batch(requestsList);
        });
    }
}

/** Модуль работы с базой данных. */
module.exports = PostgreSQL;
