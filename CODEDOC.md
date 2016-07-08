<a name="module_storage"></a>

## storage
Модуль работы с внешними хранилищами (БД и кэш).

**License**: WTFPL  

* [storage](#module_storage)
    * [module.exports](#exp_module_storage--module.exports) : <code>Storage</code> ⏏
        * [~Storage](#module_storage--module.exports..Storage)
            * [new Storage()](#new_module_storage--module.exports..Storage_new)
            * [.state](#module_storage--module.exports..Storage.Storage+state) : <code>string</code>
            * [.ready](#module_storage--module.exports..Storage.Storage+ready) : <code>boolean</code>
            * [.init([settings], [queries])](#module_storage--module.exports..Storage+init) ⇒ <code>Promise</code>
            * [.getDriver([driverName])](#module_storage--module.exports..Storage+getDriver) ⇒ <code>Object</code>
            * [.getDBConnection(connectionName)](#module_storage--module.exports..Storage+getDBConnection) ⇒ <code>Object</code>
            * [.getCacheConnection(connectionName)](#module_storage--module.exports..Storage+getCacheConnection) ⇒ <code>Object</code>
            * [.getData(queryName, [param])](#module_storage--module.exports..Storage+getData) ⇒ <code>Promise</code>
            * [.getFromDB(queryName, [param])](#module_storage--module.exports..Storage+getFromDB) ⇒ <code>Promise</code>
            * [.getFromCache([connectionName], cacheName)](#module_storage--module.exports..Storage+getFromCache) ⇒ <code>Promise</code>
            * [.setToDB(queryName, [param])](#module_storage--module.exports..Storage+setToDB) ⇒ <code>Promise</code>
            * [.setToCache(connectionName, cacheName, data, expire)](#module_storage--module.exports..Storage+setToCache) ⇒ <code>Promise</code>
            * [.transactionToDB(sqlList, [paramList])](#module_storage--module.exports..Storage+transactionToDB) ⇒ <code>Promise</code>
            * [.transactionToCache(connectionName, actionsList, namesList, [dataList], [expiresList])](#module_storage--module.exports..Storage+transactionToCache) ⇒ <code>Promise</code>
            * [.reloadFromDBToCache(queryName, [param])](#module_storage--module.exports..Storage+reloadFromDBToCache) ⇒ <code>Promise</code>
        * [~fs](#module_storage--module.exports..fs)
        * [~path](#module_storage--module.exports..path)
        * [~ZSchema](#module_storage--module.exports..ZSchema) : <code>ZSchema</code>
        * [~catchError](#module_storage--module.exports..catchError)

<a name="exp_module_storage--module.exports"></a>

### module.exports : <code>Storage</code> ⏏
Модуль работы с внешними хранилищами (БД и кэш).

**Kind**: Exported member  
<a name="module_storage--module.exports..Storage"></a>

#### module.exports~Storage
Класс работы с внешними хранилищами (БД и кэш).

**Kind**: inner class of <code>[module.exports](#exp_module_storage--module.exports)</code>  

* [~Storage](#module_storage--module.exports..Storage)
    * [new Storage()](#new_module_storage--module.exports..Storage_new)
    * [.state](#module_storage--module.exports..Storage.Storage+state) : <code>string</code>
    * [.ready](#module_storage--module.exports..Storage.Storage+ready) : <code>boolean</code>
    * [.init([settings], [queries])](#module_storage--module.exports..Storage+init) ⇒ <code>Promise</code>
    * [.getDriver([driverName])](#module_storage--module.exports..Storage+getDriver) ⇒ <code>Object</code>
    * [.getDBConnection(connectionName)](#module_storage--module.exports..Storage+getDBConnection) ⇒ <code>Object</code>
    * [.getCacheConnection(connectionName)](#module_storage--module.exports..Storage+getCacheConnection) ⇒ <code>Object</code>
    * [.getData(queryName, [param])](#module_storage--module.exports..Storage+getData) ⇒ <code>Promise</code>
    * [.getFromDB(queryName, [param])](#module_storage--module.exports..Storage+getFromDB) ⇒ <code>Promise</code>
    * [.getFromCache([connectionName], cacheName)](#module_storage--module.exports..Storage+getFromCache) ⇒ <code>Promise</code>
    * [.setToDB(queryName, [param])](#module_storage--module.exports..Storage+setToDB) ⇒ <code>Promise</code>
    * [.setToCache(connectionName, cacheName, data, expire)](#module_storage--module.exports..Storage+setToCache) ⇒ <code>Promise</code>
    * [.transactionToDB(sqlList, [paramList])](#module_storage--module.exports..Storage+transactionToDB) ⇒ <code>Promise</code>
    * [.transactionToCache(connectionName, actionsList, namesList, [dataList], [expiresList])](#module_storage--module.exports..Storage+transactionToCache) ⇒ <code>Promise</code>
    * [.reloadFromDBToCache(queryName, [param])](#module_storage--module.exports..Storage+reloadFromDBToCache) ⇒ <code>Promise</code>

<a name="new_module_storage--module.exports..Storage_new"></a>

##### new Storage()
Конструктор класса

<a name="module_storage--module.exports..Storage.Storage+state"></a>

##### storage.state : <code>string</code>
Состояние хранилища

**Kind**: instance property of <code>[Storage](#module_storage--module.exports..Storage)</code>  
<a name="module_storage--module.exports..Storage.Storage+ready"></a>

##### storage.ready : <code>boolean</code>
Готово ли хранилище к работе.

**Kind**: instance property of <code>[Storage](#module_storage--module.exports..Storage)</code>  
<a name="module_storage--module.exports..Storage+init"></a>

##### storage.init([settings], [queries]) ⇒ <code>Promise</code>
Инициализатор класса.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с объектом Storage или reject с ошибкой.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [settings] | <code>object</code> | <code>{}</code> | Объект с настройками подключений. |
| [queries] | <code>object</code> | <code>{}</code> | Объект с запросами в БД. |

**Example**  
```js
storage.init({}, {})
    .then(result => console.log('Storage ready', storage.ready))
    .catch(error => console.error(error));
```
<a name="module_storage--module.exports..Storage+getDriver"></a>

##### storage.getDriver([driverName]) ⇒ <code>Object</code>
Получение объекта с неинициализированным модулем подключения по названию.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Object</code> - Объект с неинициализированным модулем подключения.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [driverName] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | Навание модуля. |

<a name="module_storage--module.exports..Storage+getDBConnection"></a>

##### storage.getDBConnection(connectionName) ⇒ <code>Object</code>
Получение соединения с БД по названию.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Object</code> - Инициализированный молудь с соединением с БД.  

| Param | Type | Description |
| --- | --- | --- |
| connectionName | <code>string</code> | Название соединения. |

<a name="module_storage--module.exports..Storage+getCacheConnection"></a>

##### storage.getCacheConnection(connectionName) ⇒ <code>Object</code>
Получение соединения с кэшом по названию.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Object</code> - Инициализированный молудь с соединением с кэшом.  

| Param | Type | Description |
| --- | --- | --- |
| connectionName | <code>string</code> | Название соединения. |

<a name="module_storage--module.exports..Storage+getData"></a>

##### storage.getData(queryName, [param]) ⇒ <code>Promise</code>
Получение данных из хранилищ (кэш или БД).
Автоматически кэширует данные, если в настройках запроса установлен флаг кеширования.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с результатами получения данных, или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>string</code> |  | Название схемы данных для запроса. |
| [param] | <code>object</code> | <code>{}</code> | Параметры для получения данных. |

<a name="module_storage--module.exports..Storage+getFromDB"></a>

##### storage.getFromDB(queryName, [param]) ⇒ <code>Promise</code>
Получение данных напрямую из БД, минуя кэш.
Результаты запроса кэшироваться не будут.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Promise</code> - resolve с ответом БД или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>string</code> |  | Название схемы данных для запроса. |
| [param] | <code>object</code> | <code>{}</code> | Параметры для запроса в БД. |

<a name="module_storage--module.exports..Storage+getFromCache"></a>

##### storage.getFromCache([connectionName], cacheName) ⇒ <code>Promise</code>
Получение данных только из кэша.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с результатами получения данных, или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [connectionName] | <code>string</code> | <code>&quot;&#x27;main&#x27;&quot;</code> | Название соединения из настроек. |
| cacheName | <code>string</code> |  | Название ключа кэша. |

<a name="module_storage--module.exports..Storage+setToDB"></a>

##### storage.setToDB(queryName, [param]) ⇒ <code>Promise</code>
Помещение данных в хранилище (БД).

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve, или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>string</code> |  | Название схемы данных для запроса. |
| [param] | <code>object</code> | <code>{}</code> | Параметры для помещения в хранилище. |

<a name="module_storage--module.exports..Storage+setToCache"></a>

##### storage.setToCache(connectionName, cacheName, data, expire) ⇒ <code>Promise</code>
Помещение данных только в кэш.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Promise</code> - resolve с результатом сохранения данных в кэше reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| connectionName | <code>string</code> |  | Название соединения из настроек. |
| cacheName | <code>string</code> |  | Название ключа кэша. |
| data | <code>object</code> |  | Данные для кэширования. |
| expire | <code>number</code> | <code>0</code> | Время жизни кэша. 0 - кэш не будет устаревать. |

<a name="module_storage--module.exports..Storage+transactionToDB"></a>

##### storage.transactionToDB(sqlList, [paramList]) ⇒ <code>Promise</code>
Отправка транзакционных запросов в БД и получение результатов.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Promise</code> - resolve с массивом с результатми транзакционного запроса reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sqlList | <code>Array.&lt;string&gt;</code> |  | Массив названий запросов. |
| [paramList] | <code>Array.&lt;object&gt;</code> | <code>[]</code> | Массив объектов с параметрами запросов. |

<a name="module_storage--module.exports..Storage+transactionToCache"></a>

##### storage.transactionToCache(connectionName, actionsList, namesList, [dataList], [expiresList]) ⇒ <code>Promise</code>
Отправка транзакционных запросов в кэш и получение результатов.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Promise</code> - resolve с результатми транзакционных запросов или reject с описанием ошибки.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| connectionName | <code>string</code> |  | Название соединения из настроек, через которое будут идти запросы. |
| actionsList | <code>Array.&lt;string&gt;</code> |  | Список действий для запросов (get || set). |
| namesList | <code>Array.&lt;string&gt;</code> |  | Список названий ключей кэша. |
| [dataList] | <code>array</code> | <code>[]</code> | Список данных для помещения в кэш. |
| [expiresList] | <code>Array.&lt;number&gt;</code> | <code>[]</code> | Список указаний времени жизни каждого ключа (при запросах типа set). |

<a name="module_storage--module.exports..Storage+reloadFromDBToCache"></a>

##### storage.reloadFromDBToCache(queryName, [param]) ⇒ <code>Promise</code>
Обновление данных из БД в кэше. С возвращением полученных данных.

**Kind**: instance method of <code>[Storage](#module_storage--module.exports..Storage)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с результатами получения данных, или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>String</code> |  | Название схемы данных для запроса. |
| [param] | <code>Object</code> | <code>{}</code> | Параметры для получения данных. |

<a name="module_storage--module.exports..fs"></a>

#### module.exports~fs
Модуль работы с файловой системой

**Kind**: inner constant of <code>[module.exports](#exp_module_storage--module.exports)</code>  
<a name="module_storage--module.exports..path"></a>

#### module.exports~path
Модуль работы с файловыми путями

**Kind**: inner constant of <code>[module.exports](#exp_module_storage--module.exports)</code>  
<a name="module_storage--module.exports..ZSchema"></a>

#### module.exports~ZSchema : <code>ZSchema</code>
Модуль проверки JSON данных по JSON схемам.

**Kind**: inner constant of <code>[module.exports](#exp_module_storage--module.exports)</code>  
<a name="module_storage--module.exports..catchError"></a>

#### module.exports~catchError
Модуль обработки и возврата ошибок в блоках catch у Promise.

**Kind**: inner constant of <code>[module.exports](#exp_module_storage--module.exports)</code>  
