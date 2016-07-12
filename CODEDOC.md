<a name="module_pragmaStorage"></a>

## pragmaStorage
Module works with external storage (database and cache).

**License**: WTFPL  

* [pragmaStorage](#module_pragmaStorage)
    * [module.exports](#exp_module_pragmaStorage--module.exports) : <code>PragmaStorage</code> ⏏
        * [~PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)
            * [._CLASS](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+_CLASS)
            * [.settingsSchema](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+settingsSchema)
            * [.queriesSchema](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+queriesSchema)
            * [.extendsFolder](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+extendsFolder)
            * [.settings](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+settings)
            * [.queries](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+queries)
            * [.connections](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+connections)
            * [.connectionName](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+connectionName)
            * [.state](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+state)
            * [.ready](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+ready)
            * [.validator](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+validator)
            * [.redis](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+redis)
            * [.mysql](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+mysql)
            * [.postgres](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+postgres)
            * [.memcache](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+memcache)
            * [.init([settings], [queries])](#module_pragmaStorage--module.exports..PragmaStorage+init) ⇒ <code>Promise</code>
            * [.getDriver([driverName])](#module_pragmaStorage--module.exports..PragmaStorage+getDriver) ⇒ <code>Object</code>
            * [.getDBConnection(connectionName)](#module_pragmaStorage--module.exports..PragmaStorage+getDBConnection) ⇒ <code>Object</code>
            * [.getCacheConnection(connectionName)](#module_pragmaStorage--module.exports..PragmaStorage+getCacheConnection) ⇒ <code>Object</code>
            * [.getData(queryName, [param])](#module_pragmaStorage--module.exports..PragmaStorage+getData) ⇒ <code>Promise</code>
            * [.getFromDB(queryName, [param])](#module_pragmaStorage--module.exports..PragmaStorage+getFromDB) ⇒ <code>Promise</code>
            * [.getFromCache([connectionName], cacheName)](#module_pragmaStorage--module.exports..PragmaStorage+getFromCache) ⇒ <code>Promise</code>
            * [.setToDB(queryName, [param])](#module_pragmaStorage--module.exports..PragmaStorage+setToDB) ⇒ <code>Promise</code>
            * [.setToCache(connectionName, cacheName, data, expire)](#module_pragmaStorage--module.exports..PragmaStorage+setToCache) ⇒ <code>Promise</code>
            * [.transactionToDB(sqlList, [paramList])](#module_pragmaStorage--module.exports..PragmaStorage+transactionToDB) ⇒ <code>Promise</code>
            * [.transactionToCache(connectionName, actionsList, namesList, [dataList], [expiresList])](#module_pragmaStorage--module.exports..PragmaStorage+transactionToCache) ⇒ <code>Promise</code>
            * [.reloadFromDBToCache(queryName, [param])](#module_pragmaStorage--module.exports..PragmaStorage+reloadFromDBToCache) ⇒ <code>Promise</code>
        * [~catchError](#module_pragmaStorage--module.exports..catchError)

<a name="exp_module_pragmaStorage--module.exports"></a>

### module.exports : <code>PragmaStorage</code> ⏏
Module works with external storage (database and cache).

**Kind**: Exported member  
<a name="module_pragmaStorage--module.exports..PragmaStorage"></a>

#### module.exports~PragmaStorage
Class works with external storage (database and cache).

**Kind**: inner class of <code>[module.exports](#exp_module_pragmaStorage--module.exports)</code>  

* [~PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)
    * [._CLASS](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+_CLASS)
    * [.settingsSchema](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+settingsSchema)
    * [.queriesSchema](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+queriesSchema)
    * [.extendsFolder](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+extendsFolder)
    * [.settings](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+settings)
    * [.queries](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+queries)
    * [.connections](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+connections)
    * [.connectionName](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+connectionName)
    * [.state](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+state)
    * [.ready](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+ready)
    * [.validator](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+validator)
    * [.redis](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+redis)
    * [.mysql](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+mysql)
    * [.postgres](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+postgres)
    * [.memcache](#module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+memcache)
    * [.init([settings], [queries])](#module_pragmaStorage--module.exports..PragmaStorage+init) ⇒ <code>Promise</code>
    * [.getDriver([driverName])](#module_pragmaStorage--module.exports..PragmaStorage+getDriver) ⇒ <code>Object</code>
    * [.getDBConnection(connectionName)](#module_pragmaStorage--module.exports..PragmaStorage+getDBConnection) ⇒ <code>Object</code>
    * [.getCacheConnection(connectionName)](#module_pragmaStorage--module.exports..PragmaStorage+getCacheConnection) ⇒ <code>Object</code>
    * [.getData(queryName, [param])](#module_pragmaStorage--module.exports..PragmaStorage+getData) ⇒ <code>Promise</code>
    * [.getFromDB(queryName, [param])](#module_pragmaStorage--module.exports..PragmaStorage+getFromDB) ⇒ <code>Promise</code>
    * [.getFromCache([connectionName], cacheName)](#module_pragmaStorage--module.exports..PragmaStorage+getFromCache) ⇒ <code>Promise</code>
    * [.setToDB(queryName, [param])](#module_pragmaStorage--module.exports..PragmaStorage+setToDB) ⇒ <code>Promise</code>
    * [.setToCache(connectionName, cacheName, data, expire)](#module_pragmaStorage--module.exports..PragmaStorage+setToCache) ⇒ <code>Promise</code>
    * [.transactionToDB(sqlList, [paramList])](#module_pragmaStorage--module.exports..PragmaStorage+transactionToDB) ⇒ <code>Promise</code>
    * [.transactionToCache(connectionName, actionsList, namesList, [dataList], [expiresList])](#module_pragmaStorage--module.exports..PragmaStorage+transactionToCache) ⇒ <code>Promise</code>
    * [.reloadFromDBToCache(queryName, [param])](#module_pragmaStorage--module.exports..PragmaStorage+reloadFromDBToCache) ⇒ <code>Promise</code>

<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+_CLASS"></a>

##### pragmaStorage._CLASS
The name of the current class for debug and error log

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+settingsSchema"></a>

##### pragmaStorage.settingsSchema
JSON-schema for check settings

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+queriesSchema"></a>

##### pragmaStorage.queriesSchema
JSON-schema for check queries list

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+extendsFolder"></a>

##### pragmaStorage.extendsFolder
The path to the folder with the modules, extensions to work with individual stores.

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+settings"></a>

##### pragmaStorage.settings
Settings object

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+queries"></a>

##### pragmaStorage.queries
Queries object

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+connections"></a>

##### pragmaStorage.connections
Connections to storages

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+connectionName"></a>

##### pragmaStorage.connectionName
Default connection name

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+state"></a>

##### pragmaStorage.state
PragmaStorage state

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+ready"></a>

##### pragmaStorage.ready
PragmaStorage ready for work

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+validator"></a>

##### pragmaStorage.validator
JSON-schemas validator object

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+redis"></a>

##### pragmaStorage.redis
Parameter contains Redis module

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+mysql"></a>

##### pragmaStorage.mysql
Parameter contains MySQL module

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+postgres"></a>

##### pragmaStorage.postgres
Parameter contains PostgreSQL module

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage.PragmaStorage+memcache"></a>

##### pragmaStorage.memcache
Parameter contains Memcache module

**Kind**: instance property of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
<a name="module_pragmaStorage--module.exports..PragmaStorage+init"></a>

##### pragmaStorage.init([settings], [queries]) ⇒ <code>Promise</code>
Инициализатор класса.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с объектом PragmaStorage или reject с ошибкой.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>Object</code> | <code>{}</code> | Объект с настройками подключений. |
| [queries] | <code>Object</code> | <code>{}</code> | Объект с запросами в БД. |

**Example**  
```js
storage.init({}, {})
    .then(result => console.log(`PragmaStorage ready ${storage.ready}`))
    .catch(error => console.error(error));
```
<a name="module_pragmaStorage--module.exports..PragmaStorage+getDriver"></a>

##### pragmaStorage.getDriver([driverName]) ⇒ <code>Object</code>
Получение объекта с неинициализированным модулем подключения по названию.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Object</code> - Объект с неинициализированным модулем подключения.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [driverName] | <code>String</code> | <code>&#x27;&#x27;</code> | Навание модуля. |

<a name="module_pragmaStorage--module.exports..PragmaStorage+getDBConnection"></a>

##### pragmaStorage.getDBConnection(connectionName) ⇒ <code>Object</code>
Получение соединения с БД по названию.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Object</code> - Инициализированный молудь с соединением с БД.  

| Param | Type | Description |
| --- | --- | --- |
| connectionName | <code>String</code> | Название соединения. |

<a name="module_pragmaStorage--module.exports..PragmaStorage+getCacheConnection"></a>

##### pragmaStorage.getCacheConnection(connectionName) ⇒ <code>Object</code>
Получение соединения с кэшом по названию.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Object</code> - Инициализированный молудь с соединением с кэшом.  

| Param | Type | Description |
| --- | --- | --- |
| connectionName | <code>String</code> | Название соединения. |

<a name="module_pragmaStorage--module.exports..PragmaStorage+getData"></a>

##### pragmaStorage.getData(queryName, [param]) ⇒ <code>Promise</code>
Получение данных из хранилищ (кэш или БД).
Автоматически кэширует данные, если в настройках запроса установлен флаг кеширования.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с результатами получения данных, или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>String</code> |  | Название схемы данных для запроса. |
| [param] | <code>Object</code> | <code>{}</code> | Параметры для получения данных. |

<a name="module_pragmaStorage--module.exports..PragmaStorage+getFromDB"></a>

##### pragmaStorage.getFromDB(queryName, [param]) ⇒ <code>Promise</code>
Получение данных напрямую из БД, минуя кэш.
Результаты запроса кэшироваться не будут.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Promise</code> - resolve с ответом БД или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>String</code> |  | Название схемы данных для запроса. |
| [param] | <code>Object</code> | <code>{}</code> | Параметры для запроса в БД. |

<a name="module_pragmaStorage--module.exports..PragmaStorage+getFromCache"></a>

##### pragmaStorage.getFromCache([connectionName], cacheName) ⇒ <code>Promise</code>
Получение данных только из кэша.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с результатами получения данных, или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [connectionName] | <code>String</code> | <code>&#x27;main&#x27;</code> | Название соединения из настроек. |
| cacheName | <code>String</code> |  | Название ключа кэша. |

<a name="module_pragmaStorage--module.exports..PragmaStorage+setToDB"></a>

##### pragmaStorage.setToDB(queryName, [param]) ⇒ <code>Promise</code>
Помещение данных в хранилище (БД).

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve, или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>String</code> |  | Название схемы данных для запроса. |
| [param] | <code>Object</code> | <code>{}</code> | Параметры для помещения в хранилище. |

<a name="module_pragmaStorage--module.exports..PragmaStorage+setToCache"></a>

##### pragmaStorage.setToCache(connectionName, cacheName, data, expire) ⇒ <code>Promise</code>
Помещение данных только в кэш.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Promise</code> - resolve с результатом сохранения данных в кэше reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| connectionName | <code>String</code> |  | Название соединения из настроек. |
| cacheName | <code>String</code> |  | Название ключа кэша. |
| data | <code>\*</code> |  | Данные для кэширования. |
| expire | <code>Number</code> | <code>0</code> | Время жизни кэша. 0 - кэш не будет устаревать. |

<a name="module_pragmaStorage--module.exports..PragmaStorage+transactionToDB"></a>

##### pragmaStorage.transactionToDB(sqlList, [paramList]) ⇒ <code>Promise</code>
Отправка транзакционных запросов в БД и получение результатов.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Promise</code> - resolve с массивом с результатми транзакционного запроса reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sqlList | <code>Array.&lt;String&gt;</code> |  | Массив названий запросов. |
| [paramList] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | Массив объектов с параметрами запросов. |

<a name="module_pragmaStorage--module.exports..PragmaStorage+transactionToCache"></a>

##### pragmaStorage.transactionToCache(connectionName, actionsList, namesList, [dataList], [expiresList]) ⇒ <code>Promise</code>
Отправка транзакционных запросов в кэш и получение результатов.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Promise</code> - resolve с результатми транзакционных запросов или reject с описанием ошибки.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| connectionName | <code>String</code> |  | Название соединения из настроек, через которое будут идти запросы. |
| actionsList | <code>Array.&lt;String&gt;</code> |  | Список действий для запросов (get || set). |
| namesList | <code>Array.&lt;String&gt;</code> |  | Список названий ключей кэша. |
| [dataList] | <code>Array</code> | <code>[]</code> | Список данных для помещения в кэш. |
| [expiresList] | <code>Array.&lt;Number&gt;</code> | <code>[]</code> | Список указаний времени жизни каждого ключа (при запросах типа set). |

<a name="module_pragmaStorage--module.exports..PragmaStorage+reloadFromDBToCache"></a>

##### pragmaStorage.reloadFromDBToCache(queryName, [param]) ⇒ <code>Promise</code>
Обновление данных из БД в кэше. С возвращением полученных данных.

**Kind**: instance method of <code>[PragmaStorage](#module_pragmaStorage--module.exports..PragmaStorage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с результатами получения данных, или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>String</code> |  | Название схемы данных для запроса. |
| [param] | <code>Object</code> | <code>{}</code> | Параметры для получения данных. |

<a name="module_pragmaStorage--module.exports..catchError"></a>

#### module.exports~catchError
Error handling module for catch on Promise.

**Kind**: inner constant of <code>[module.exports](#exp_module_pragmaStorage--module.exports)</code>  
