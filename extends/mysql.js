'use strict';
/**
 * Модуль работы с базой данных.
 * @module mysql
 * @license WTFPL
 */

/**
 * Модуль работы с PostgreSQL.
 * @type {mysql|IMain|*}
 */
const mysql = require('mysql');

/**
 * Класс работы с базой данных.
 * При инициализации автоматически инициирует подключение к базе данных и сохраняет его в себе.
 */
class MySQL {
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
     * @returns {mysql|IMain|Error} Объект с соединением с БД или объект с ошибкой.
     */
    connect() {
        try {
            // если коннект еще не установлен
            if (!this.connection) {
                this.options.connectionLimit = this.options.poolSize;

                this.connection = mysql.createPool(this.options);

                // добавляем обработку именованных плейсхолдеров
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
     * Отправка запроса в БД и получение результата.
     * @param {object} sql Объект с данными запроса.
     * @param {object=} [param={}] Параметры запроса.
     * @returns {Promise} Промис в состоянии resolve с результатом запроса или reject с сообщением об ошибке.
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
     * @param {object} [param={}] Параметры запроса.
     * @returns {Promise} Промис в состоянии resolve или reject с сообщением об ошибке.
     * @alias request
     */
    getData(sql, param) {
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
                yield this.setData(sqlList[index], paramList[index] || {});
            }
        }
    }

    /**
     * Помещение данных в БД через транзакцию.
     * ВНИМАНИЕ! В MySQL таблицы MyISAM не поддерживают транзакции.
     * @param {string[]} sqlList Список SQL-запросов.
     * @param {object[]} [paramList=[]] Список параметров для запросов.
     * @returns {Promise} resolve с результатами транзакции reject с сообщением об ошибке.
     */
    transactionRequest(sqlList, paramList = []) {
        return new Promise(
            (resolve, reject) => {
                // запуск транзакции
                this.connection.beginTransaction(error => {
                    if (error) {
                        reject(error);
                    } else {
                        let requestsList = this._generateRequestsList(sqlList, paramList);

                        // запуск запросов
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

/** Модуль работы с базой данных. */
module.exports = MySQL;
