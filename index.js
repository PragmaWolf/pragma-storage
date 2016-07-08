'use strict';
/**
 * Модуль работы с внешними хранилищами (БД и кэш).
 * @module storage
 * @license WTFPL
 */

/** Модуль работы с файловой системой */
const fs = require('fs');
/** Модуль работы с файловыми путями */
const path = require('path');
/**
 * Модуль проверки JSON данных по JSON схемам.
 * @type {ZSchema}
 */
const ZSchema = require('z-schema');
/** Модуль обработки и возврата ошибок в блоках catch у Promise. */
const catchError = require('./modules/catcherr');

/**
 * Класс работы с внешними хранилищами (БД и кэш).
 */
class Storage {
    /** Конструктор класса */
    constructor() {
        /**
         * Название текущего класса для дебага и лога ошибок
         * @type {string}
         * @private
         */
        this._CLASS = this.constructor.name.toString();

        /** JSON-схема проверки настроек
         * @type {string}
         * @private
         */
        this.settingsSchema = require('./schemas/settings.json');

        /** JSON-схема проверки списка запросов
         * @type {string}
         * @private
         */
        this.queriesSchema = require('./schemas/queries.json');

        /**
         * Путь до папки с модулями-расширениями для работы с отдельными хранилищами.
         * @type {string}
         * @private
         */
        this.extendsFolder = `${__dirname}/extends/`;

        /** Хранилище настроек
         * @type {object}
         * @private
         */
        this.settings = {};

        /** Хранилище запросов
         * @type {object}
         * @private
         */
        this.queries = {};

        /** Хранилище соединений
         * @type {object}
         * @private
         */
        this.connections = {};

        /** Название соединения по-умолчанию
         * @type {string}
         * @private
         */
        this.connectionName = 'main';

        /** Состояние хранилища
         * @type {string}
         */
        this.state = 'initial';

        /** Готово ли хранилище к работе.
         * @type {boolean}
         */
        this.ready = false;

        /**
         * Модуль проверки JSON данных по JSON схемам.
         * @type {ZSchema}
         * @private
         */
        this.validator = new ZSchema();

        Object.defineProperties(this, {
            _CLASS:         {
                configurable: false,
                enumerable:   false,
                writable:     false
            },
            settingsSchema: {
                configurable: false,
                enumerable:   false,
                writable:     false
            },
            queriesSchema:  {
                configurable: false,
                enumerable:   false,
                writable:     false
            },
            extendsFolder:  {
                configurable: false,
                enumerable:   false,
                writable:     false
            },
            settings:       {
                enumerable: false
            },
            queries:        {
                enumerable: false
            },
            connections:    {
                configurable: false,
                enumerable:   false
            },
            connectionName: {
                configurable: false,
                enumerable:   false
            },
            validator:      {
                configurable: false,
                enumerable:   false,
                writable:     false
            }
        });
    }

    /**
     * Проверка списка запросов на соответствие JSON-схеме.
     * @param {object} queries Объект со списком запросов.
     * @returns {Promise} Промис в состоянии resolve с массивом json или reject с сообщением об ошибке.
     * @private
     */
    _validateQueries(queries) {
        if (!queries || Object.keys(queries).length === 0) {
            return Promise.resolve({});
        }

        return this._jsonSchemaValidator(queries, this.queriesSchema);
    }

    /**
     * Проверка переданного JSON-массива на соответствие указанной JSON-схемы.
     * @param {object=} [json={}] JSON-массив для проверки.
     * @param {object=} [schema={}] JSON-схема для проверки переданного JSON-массива.
     * @returns {Promise} Промис в состоянии resolve с массивом json или reject с сообщением об ошибке.
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
     * Проверка наличия запроса по имени.
     * @param {string} name Название запроса.
     * @returns {boolean} TRUE если есть запрос, FALSE, если нет.
     * @private
     */
    _existQuery(name) {
        return (name in this.queries);
    }

    /**
     * Проверка настроек на соответствие JSON-схеме.
     * @param {object} settings Объект с настройками.
     * @returns {Promise} Промис в состоянии resolve с массивом json или reject с сообщением об ошибке.
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
     * Подгрузка и инициализация расширяющих модулей для подключения к БД или кэшу.
     * @returns {Promise} Промис в состоянии resolve если расширения загружены или reject с ошибкой
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
     * Применение настроек для одного подключения.
     * @param {object} settings Настройки подключения.
     * @param {string=} [connectionName='main'] Название подключения.
     * @private
     */
    _applyOneConnection(settings, connectionName = 'main') {
        connectionName = connectionName || this.connectionName;

        this.connections[connectionName] = {
            db:    false,
            cache: false
        };

        if (settings.driver && settings.connection) {
            this.connections[connectionName].db = new this[settings.driver](settings.connection);
        }

        // подключение кэша
        if (settings.redis) {
            this.connections[connectionName].cache = new this.redis(settings.redis);
        }
    }

    /**
     * Применение настроек для нескольких подключений.
     * @param {object} settings Объект с именованными настройками подключения.
     * @private
     */
    _applyMultiConnection(settings) {
        for (let name in settings) {
            this._applyOneConnection(settings[name], name);
        }
    }

    /**
     * Применение настроек в зависимости от содержания объекта с настройками.
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
     * Проверка и применение полученных настроек.
     * @param {object} settings Объект с настройками.
     * @returns {Promise} Промис в состоянии resolve или reject с сообщением об ошибке.
     * @private
     */
    addSettings(settings) {
        return this._validateSettings(settings)
            .then(result => {
                this.settings = result;
                return Promise.resolve(this.settings);
            })
            .then(() => { // подгрузка расширений
                return this._loadExtends();
            })
            .then(() => { // применение настроек
                this._applySettings();
            });
    }

    /**
     * Проверка и применение полученного списка запросов.
     * @param {object} queries Объект со списком запросов.
     * @returns {Promise} Промис в состоянии resolve или reject с сообщением об ошибке.
     * @private
     */
    addQueries(queries) {
        return this._validateQueries(queries)
            .then(result => {
                this.queries = Object.assign(this.queries, result);
                return Promise.resolve(this.queries);
            });
    }

    /**
     * Инициализатор класса.
     * @param {object=} [settings={}] Объект с настройками подключений.
     * @param {object=} [queries={}] Объект с запросами в БД.
     * @example
     * storage.init({}, {})
     *     .then(result => console.log('Storage ready', storage.ready))
     *     .catch(error => console.error(error));
     * @returns {Promise} Промис в состоянии resolve с объектом Storage или reject с ошибкой.
     */
    init(settings = {}, queries = {}) {
        this.ready = false;
        this.state = 'waiting';
        return this.addSettings(settings) // проверка и добавление настроек
            .then(() => { // проверка и добавление запросов
                return this.addQueries(queries);
            })
            .then(() => {
                this.state = 'ready';
                this.ready = !!Object.keys(this.settings);
                return Promise.resolve(this.ready);
            })
            .catch(error => { // перебрасываем ошибку
                this.state = 'failed';
                return catchError(`${this.init.name}`, error);
            });
    }

    /**
     * Получение объекта с неинициализированным модулем подключения по названию.
     * @param {string} [driverName=''] Навание модуля.
     * @returns {{}} Объект с неинициализированным модулем подключения.
     */
    getDriver(driverName = '') {
        return this[driverName] || null;
    }

    /**
     * Получение соединения с БД по названию.
     * @param {string} connectionName Название соединения.
     * @returns {Object} Инициализированный молудь с соединением с БД.
     */
    getDBConnection(connectionName) {
        connectionName = connectionName || this.connectionName;

        return this.connections[connectionName].db || null;
    }

    /**
     * Получение соединения с кэшом по названию.
     * @param {string} connectionName Название соединения.
     * @returns {Object} Инициализированный молудь с соединением с кэшом.
     */
    getCacheConnection(connectionName) {
        connectionName = connectionName || this.connectionName;

        return this.connections[connectionName].cache || null;
    }

    /**
     * Проверка названия и запроса и наличия соединений с хранилищами для данного запроса.
     * @param {string} queryName Название запроса.
     * @returns {Promise} Промис в состоянии resolve с данными запроса или reject с сообщением об ошибке.
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
     * Добавление в запрос дополнительных частей.
     * Добавление дополнительных частей запроса зависит от наличия свойств в параметрах запроса к БД.
     * @param {object} query Объект с описанием запроса.
     * @param {object} param Объект с параметрами для запроса к БД.
     * @returns {Promise} resolve с обновленным запросом или reject с сообщением об ошибке.
     * @private
     */
    _additionQuery(query, param) {
        return new Promise((resolve, reject) => {
            try {
                if (query.addition) {
                    let addition = '';
                    for (let name in query.addition) {
                        addition = (name in param) ? query.addition[name] : '';
                        query.sql = query.sql.replace(`$>${name}<`, addition);
                    }
                }

                resolve(query);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Получение данных из хранилищ (кэш или БД).
     * Автоматически кэширует данные, если в настройках запроса установлен флаг кеширования.
     * @param {string} queryName Название схемы данных для запроса.
     * @param {object=} [param={}] Параметры для получения данных.
     * @returns {Promise} Промис в состоянии resolve с результатами получения данных, или reject с сообщением об ошибке.
     */
    getData(queryName, param = {}) {
        let query = {};

        return this._checkName(queryName) // проверка имени запроса и наличия соединения с хранилищами
            .then(result => {
                query = result;
                return Promise.resolve(result);
            })
            .then(result => { // запрос данных в кэше
                if (this.connections[result.connection].cache) {
                    return this.connections[result.connection].cache.getData(queryName, param);
                }

                return Promise.resolve(null);
            })
            .then(result => {// запрос в БД
                // нет модуля работы с БД
                if (!this.connections[query.connection].db) {
                    return Promise.resolve(result);
                }

                // формируем и отправляем запрос в БД
                return this._additionQuery(query, param) // дополнение запроса
                    .then(result => { // отправка запроса в БД
                        return this.connections[result.connection].db.getData(result.sql, param);
                    })
                    .then(result => { // запись полученных данных в кэш
                        if (this.connections[query.connection].cache && result && query.caching) {
                            this.connections[query.connection].cache.setData(queryName, param, result, query.expire);
                        }

                        return Promise.resolve(result);
                    });
            })
            .catch(error => { // перебрасываем ошибку
                return catchError(`${this.getData.name}`, error);
            });
    }

    /**
     * Получение данных напрямую из БД, минуя кэш.
     * Результаты запроса кэшироваться не будут.
     * @param {string} queryName Название схемы данных для запроса.
     * @param {object=} [param={}] Параметры для запроса в БД.
     * @returns {Promise} resolve с ответом БД или reject с сообщением об ошибке.
     */
    getFromDB(queryName, param = {}) {
        return this._checkName(queryName) // проверка имени запроса и наличия соединения с хранилищами
            .then(result => {
                return this._additionQuery(result, param);
            })
            .then(result => {// запрос в БД
                return this.connections[result.connection].db.getData(result.sql, param);
            })
            .catch(error => { // перебрасываем ошибку
                return catchError(`${this.getFromDB.name}`, error);
            });
    }

    /**
     * Получение данных только из кэша.
     * @param {string} [connectionName='main'] Название соединения из настроек.
     * @param {string} cacheName Название ключа кэша.
     * @returns {Promise} Промис в состоянии resolve с результатами получения данных, или reject с сообщением об ошибке.
     */
    getFromCache(connectionName, cacheName) {
        connectionName = connectionName || this.connectionName;

        return this.connections[connectionName].cache.getData(cacheName)
            .catch(error => { // перебрасываем ошибку
                return catchError(`${this.getFromCache.name}`, error);
            });
    }

    /**
     * Помещение данных в хранилище (БД).
     * @param {string} queryName Название схемы данных для запроса.
     * @param {object} [param={}] Параметры для помещения в хранилище.
     * @returns {Promise} Промис в состоянии resolve, или reject с сообщением об ошибке.
     */
    setToDB(queryName, param = {}) {
        return this._checkName(queryName) // проверка имени запроса и наличия соединения с хранилищами
            .then(result => { // дополнение запроса
                return this._additionQuery(result, param);
            })
            .then(result => { // запись данных в БД
                return this.connections[result.connection].db.setData(result.sql, param);
            })
            .catch(error => { // перебрасываем ошибку
                return catchError(`${this.setToDB.name}`, error);
            });
    }

    /**
     * Помещение данных только в кэш.
     * @param {string} connectionName Название соединения из настроек.
     * @param {string} cacheName Название ключа кэша.
     * @param {object} data Данные для кэширования.
     * @param {number} expire Время жизни кэша. 0 - кэш не будет устаревать.
     * @returns {Promise} resolve с результатом сохранения данных в кэше reject с сообщением об ошибке.
     */
    setToCache(connectionName, cacheName, data, expire = 0) {
        connectionName = connectionName || this.connectionName;

        return this.connections[connectionName].cache.setData(cacheName, data, expire)
            .catch(error => { // перебрасываем ошибку
                return catchError(`${this.transactionToDB.name}`, error);
            });
    }

    /**
     * Генератор массива проверок имен для транзакционных запросов.
     * @param {string[]} namesList Список имен.
     * @private
     */
    *_checkTransactionNames(namesList) {
        for (let index in namesList) {
            yield this._checkName(namesList[index]);
        }
    }

    /**
     * Генератор массива для пакетного добавления в транзакционные запросы дополнительных частей.
     * @param {object[]} queriesList Массив со списком описаний запросов.
     * @param {object[]} [paramList=[]] Массив с параметрами для запросов в БД.
     * @private
     */
    *_additionTransactionQuery(queriesList, paramList = []) {
        for (let index in queriesList) {
            yield this._additionQuery(queriesList[index], paramList[index] || {});
        }
    }

    /**
     * Проверка наличия одинаковых подключений к БД для транзакционных запросов.
     * @param {object[]} connectionsList Массив со списком описаний запросов.
     * @returns {Promise} resolve с полученным массивом со списком описаний запросов reject с сообщением об ошибке.
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
     * Получение массива текстов SQL-запросов из массива описаний запросов для транзакционных запросов.
     * @param {object[]} connectionsList Массив с описаниями запросов.
     * @returns {Promise} resolve с массивом с текстами запросов reject с сообщением об ошибке.
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
     * Отправка транзакционных запросов в БД и получение результатов.
     * @param {string[]} sqlList Массив названий запросов.
     * @param {object[]} [paramList=[]] Массив объектов с параметрами запросов.
     * @returns {Promise} resolve с массивом с результатми транзакционного запроса reject с сообщением об ошибке.
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

        // переданных имен
        return Promise.all([...checkNamesList])
            .then(connectionsList => { // должны быть одинаковые названия подключений
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
            .catch(error => { // перебрасываем ошибку
                return catchError(`${this.transactionToDB.name}`, error);
            });
    }

    /**
     * Отправка транзакционных запросов в кэш и получение результатов.
     * @param {string} connectionName Название соединения из настроек, через которое будут идти запросы.
     * @param {string[]} actionsList Список действий для запросов (get || set).
     * @param {string[]} namesList Список названий ключей кэша.
     * @param {array} [dataList=[]] Список данных для помещения в кэш.
     * @param {number[]} [expiresList=[]] Список указаний времени жизни каждого ключа (при запросах типа set).
     * @returns {Promise} resolve с результатми транзакционных запросов или reject с описанием ошибки.
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
            .catch(error => { // перебрасываем ошибку
                return catchError(`${this.getFromCache.name}`, error);
            });
    }

    /**
     * Обновление данных из БД в кэше. С возвращением полученных данных.
     * @param {String} queryName Название схемы данных для запроса.
     * @param {Object=} [param={}] Параметры для получения данных.
     * @returns {Promise} Промис в состоянии resolve с результатами получения данных, или reject с сообщением об ошибке.
     */
    reloadFromDBToCache(queryName, param = {}) {
        let query = {};

        return this._checkName(queryName) // проверка имени запроса и наличия соединения с хранилищами
            .then(result => {
                query = result;
                return Promise.resolve(true);
            })
            .then(() => { // дополнение запроса
                return this._additionQuery(query, param);
            })
            .then(result => {// запрос в БД
                // нет модуля работы с БД
                if (!this.connections[query.connection].db) {
                    return Promise.resolve(null);
                }

                return this.connections[result.connection].db.getData(result.sql, param);
            })
            .then(result => { // запись полученных данных в кэш
                if (this.connections[query.connection].cache) {
                    if (result && query.caching) {
                        this.connections[query.connection].cache.setData(queryName, result, query.expire, param);
                    }
                }

                return Promise.resolve(result);
            })
            .catch(error => { // перебрасываем ошибку
                return catchError(`${this.reloadFromDBToCache.name}`, error);
            });
    }
}

/**
 * Модуль работы с внешними хранилищами (БД и кэш).
 * @type {Storage}
 */
module.exports = new Storage();
