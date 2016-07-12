'use strict';
/**
 * Модуль работы с кэшом.
 * @module redis
 * @license WTFPL
 */

/** Работа с Redis. */
const redis = require('redis');
/**
 * Класс работы с кэшом.
 * При инициализации автоматически инициирует подключение к кэшу и сохраняет его в себе.
 */
class Redis {
    /**
     * Конструктор класса.
     * @param {object} connectParam Параметры подключения к Redis.
     */
    constructor(connectParam) {
        /** Название текущего класса для дебага и лога ошибок */
        this._CLASS = this.constructor.name.toString();

        /**
         * Свойство для хранения текущего соединения.
         * @type {Boolean|RedisClient|exports.createClient}
         */
        this.connection = false;

        // префикс для ключей Redis должен заканчиваться на двоеточие
        if (('prefix' in connectParam) && !connectParam.prefix.endsWith(':')) {
            connectParam.prefix += ':';
        }

        /** Хранилище настроек подключения к Redis */
        this.options = connectParam;

        // инициализируем подключение к кэшу
        this.connect();
    }

    /**
     * Подключение к кэшу и сохранение подключения в свойстве класса.
     * @returns {Redis.connection} Соединение с Redis.
     */
    connect() {
        try {
            // если коннект еще не установлен
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
     * Формирование параметров в строку для добавления в ключ кэша.
     * @param {object=} [param={}] Параметры получения данных.
     * @returns {string} Сформированные параметры для добавления в ключ кэша.
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
     * Формирование ключа кэша.
     * @param {string} queryName Название запроса для формирования ключа.
     * @param {object=} [param={}] Параметры получения данных.
     * @returns {string} Сформированный ключ для кэша.
     * @private
     */
    _compileKey(queryName, param = {}) {
        return `${queryName}${this._compileParam(param)}`;
    }

    /**
     * Получение данных из кеша.
     * @param {string} queryName Название запроса для формирования ключа.
     * @param {object=} [param={}] Параметры получения данных.
     * @returns {Promise} Промис в состоянии resolve с данными из кэша или reject с сообщением об ошибке.
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
     * Помещение данных в кэш.
     * @param {string} queryName Название запроса для формирования ключа.
     * @param {*=} [data={}] Данные для помещения в кэш.
     * @param {number=} [expire=0] Время жизни данных в кэше.
     * @param {object=} [param={}] Параметры получения данных.
     * @returns {Promise} Промис в состоянии resolve или reject с сообщением об ошибке.
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
     * Отправка транзакционных запросов и получение результатов.
     * @param {string[]} actionsList Список действий для запросов (get || set).
     * @param {string[]} namesList Список названий ключей кэша.
     * @param {object[]} [dataList=[]] Список данных для помещения в кэш.
     * @param {number[]} [expiresList=[]] Список указаний времени жизни каждого ключа (при запросах типа set).
     * @returns {Promise} resolve с результатми транзакционных запросов или reject с описанием ошибки.
     */
    transactionRequest(actionsList, namesList, dataList = [], expiresList = []) {
        return new Promise(
            (resolve, reject) => {
                // формирование списка запросов
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

                // отправка запросов в кэш и получение результатов
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

/**
 * Модуль работы с кэшом.
 * @type {Redis}
 */
module.exports = Redis;
