## Modules

* [mysql](#module_mysql)
    * [module.exports](#exp_module_mysql--module.exports) ⏏
        * [~MySQL](#module_mysql--module.exports..MySQL)
            * [new MySQL(connectParam)](#new_module_mysql--module.exports..MySQL_new)
            * [._CLASS](#module_mysql--module.exports..MySQL.MySQL+_CLASS)
            * [.connection](#module_mysql--module.exports..MySQL.MySQL+connection) : <code>boolean</code> &#124; <code>pgPromise</code> &#124; <code>IMain</code>
            * [.options](#module_mysql--module.exports..MySQL.MySQL+options)
            * [.connect()](#module_mysql--module.exports..MySQL+connect) ⇒ <code>mysql</code> &#124; <code>IMain</code> &#124; <code>Error</code>
            * [._request(sql, [param])](#module_mysql--module.exports..MySQL+_request) ⇒ <code>Promise</code>
            * [.setData(sql, [param])](#module_mysql--module.exports..MySQL+setData) ⇒ <code>Promise</code>
            * [.transactionRequest(sqlList, [paramList])](#module_mysql--module.exports..MySQL+transactionRequest) ⇒ <code>Promise</code>
        * [~mysql](#module_mysql--module.exports..mysql) : <code>mysql</code> &#124; <code>IMain</code> &#124; <code>\*</code>
* [postgresql](#module_postgresql)
    * [module.exports](#exp_module_postgresql--module.exports) ⏏
        * [~PostgreSQL](#module_postgresql--module.exports..PostgreSQL)
            * [new PostgreSQL(connectParam)](#new_module_postgresql--module.exports..PostgreSQL_new)
            * [._CLASS](#module_postgresql--module.exports..PostgreSQL.PostgreSQL+_CLASS)
            * [.connection](#module_postgresql--module.exports..PostgreSQL.PostgreSQL+connection) : <code>boolean</code> &#124; <code>pgPromise</code> &#124; <code>IMain</code>
            * [.options](#module_postgresql--module.exports..PostgreSQL.PostgreSQL+options)
            * [.connect()](#module_postgresql--module.exports..PostgreSQL+connect) ⇒ <code>pgPromise</code> &#124; <code>IMain</code> &#124; <code>Error</code>
            * [._request(sql, [param])](#module_postgresql--module.exports..PostgreSQL+_request) ⇒ <code>Promise</code>
            * [.setData(sql, [param])](#module_postgresql--module.exports..PostgreSQL+setData) ⇒ <code>Promise</code>
            * [.transactionRequest(sqlList, [paramList])](#module_postgresql--module.exports..PostgreSQL+transactionRequest) ⇒ <code>Promise</code>
        * [~pgPromise](#module_postgresql--module.exports..pgPromise) : <code>pgPromise</code> &#124; <code>IMain</code> &#124; <code>\*</code>
* [redis](#module_redis)
    * [module.exports](#exp_module_redis--module.exports) : <code>Redis</code> ⏏
        * [~Redis](#module_redis--module.exports..Redis)
            * [new Redis(connectParam)](#new_module_redis--module.exports..Redis_new)
            * [._CLASS](#module_redis--module.exports..Redis.Redis+_CLASS)
            * [.connection](#module_redis--module.exports..Redis.Redis+connection) : <code>Boolean</code> &#124; <code>RedisClient</code> &#124; <code>exports.createClient</code>
            * [.options](#module_redis--module.exports..Redis.Redis+options)
            * [.connect()](#module_redis--module.exports..Redis+connect) ⇒ <code>Redis.connection</code>
            * [.getData(queryName, [param])](#module_redis--module.exports..Redis+getData) ⇒ <code>Promise</code>
            * [.setData(queryName, [data], [expire], [param])](#module_redis--module.exports..Redis+setData) ⇒ <code>Promise</code>
            * [.transactionRequest(actionsList, namesList, [dataList], [expiresList])](#module_redis--module.exports..Redis+transactionRequest) ⇒ <code>Promise</code>
        * [~redis](#module_redis--module.exports..redis)

## Functions

* [request(sql, [param])](#request) ⇒ <code>Promise</code>
* [request(sql, [param])](#request) ⇒ <code>Promise</code>

<a name="module_mysql"></a>

## mysql
Модуль работы с базой данных.

**License**: WTFPL  

* [mysql](#module_mysql)
    * [module.exports](#exp_module_mysql--module.exports) ⏏
        * [~MySQL](#module_mysql--module.exports..MySQL)
            * [new MySQL(connectParam)](#new_module_mysql--module.exports..MySQL_new)
            * [._CLASS](#module_mysql--module.exports..MySQL.MySQL+_CLASS)
            * [.connection](#module_mysql--module.exports..MySQL.MySQL+connection) : <code>boolean</code> &#124; <code>pgPromise</code> &#124; <code>IMain</code>
            * [.options](#module_mysql--module.exports..MySQL.MySQL+options)
            * [.connect()](#module_mysql--module.exports..MySQL+connect) ⇒ <code>mysql</code> &#124; <code>IMain</code> &#124; <code>Error</code>
            * [._request(sql, [param])](#module_mysql--module.exports..MySQL+_request) ⇒ <code>Promise</code>
            * [.setData(sql, [param])](#module_mysql--module.exports..MySQL+setData) ⇒ <code>Promise</code>
            * [.transactionRequest(sqlList, [paramList])](#module_mysql--module.exports..MySQL+transactionRequest) ⇒ <code>Promise</code>
        * [~mysql](#module_mysql--module.exports..mysql) : <code>mysql</code> &#124; <code>IMain</code> &#124; <code>\*</code>

<a name="exp_module_mysql--module.exports"></a>

### module.exports ⏏
Модуль работы с базой данных.

**Kind**: Exported member  
<a name="module_mysql--module.exports..MySQL"></a>

#### module.exports~MySQL
Класс работы с базой данных.
При инициализации автоматически инициирует подключение к базе данных и сохраняет его в себе.

**Kind**: inner class of <code>[module.exports](#exp_module_mysql--module.exports)</code>  

* [~MySQL](#module_mysql--module.exports..MySQL)
    * [new MySQL(connectParam)](#new_module_mysql--module.exports..MySQL_new)
    * [._CLASS](#module_mysql--module.exports..MySQL.MySQL+_CLASS)
    * [.connection](#module_mysql--module.exports..MySQL.MySQL+connection) : <code>boolean</code> &#124; <code>pgPromise</code> &#124; <code>IMain</code>
    * [.options](#module_mysql--module.exports..MySQL.MySQL+options)
    * [.connect()](#module_mysql--module.exports..MySQL+connect) ⇒ <code>mysql</code> &#124; <code>IMain</code> &#124; <code>Error</code>
    * [._request(sql, [param])](#module_mysql--module.exports..MySQL+_request) ⇒ <code>Promise</code>
    * [.setData(sql, [param])](#module_mysql--module.exports..MySQL+setData) ⇒ <code>Promise</code>
    * [.transactionRequest(sqlList, [paramList])](#module_mysql--module.exports..MySQL+transactionRequest) ⇒ <code>Promise</code>

<a name="new_module_mysql--module.exports..MySQL_new"></a>

##### new MySQL(connectParam)
Конструктор класса.


| Param | Type | Description |
| --- | --- | --- |
| connectParam | <code>object</code> | Параметры соединения с БД. |

<a name="module_mysql--module.exports..MySQL.MySQL+_CLASS"></a>

##### mySQL._CLASS
Название текущего класса для дебага и лога ошибок

**Kind**: instance property of <code>[MySQL](#module_mysql--module.exports..MySQL)</code>  
<a name="module_mysql--module.exports..MySQL.MySQL+connection"></a>

##### mySQL.connection : <code>boolean</code> &#124; <code>pgPromise</code> &#124; <code>IMain</code>
Свойство для хранения текущего соединения.

**Kind**: instance property of <code>[MySQL](#module_mysql--module.exports..MySQL)</code>  
<a name="module_mysql--module.exports..MySQL.MySQL+options"></a>

##### mySQL.options
Хранилище настроек подключения к Redis

**Kind**: instance property of <code>[MySQL](#module_mysql--module.exports..MySQL)</code>  
<a name="module_mysql--module.exports..MySQL+connect"></a>

##### mySQL.connect() ⇒ <code>mysql</code> &#124; <code>IMain</code> &#124; <code>Error</code>
Создание и получение подключения с БД. Если подключение уже создано, повторно создаваться оно не будет.

**Kind**: instance method of <code>[MySQL](#module_mysql--module.exports..MySQL)</code>  
**Returns**: <code>mysql</code> &#124; <code>IMain</code> &#124; <code>Error</code> - Объект с соединением с БД или объект с ошибкой.  
<a name="module_mysql--module.exports..MySQL+_request"></a>

##### mySQL._request(sql, [param]) ⇒ <code>Promise</code>
Отправка запроса в БД и получение результата.

**Kind**: instance method of <code>[MySQL](#module_mysql--module.exports..MySQL)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с результатом запроса или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>object</code> |  | Объект с данными запроса. |
| [param] | <code>object</code> | <code>{}</code> | Параметры запроса. |

<a name="module_mysql--module.exports..MySQL+setData"></a>

##### mySQL.setData(sql, [param]) ⇒ <code>Promise</code>
Помещение данных в БД.

**Kind**: instance method of <code>[MySQL](#module_mysql--module.exports..MySQL)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>object</code> |  | Объект с данными запроса. |
| [param] | <code>object</code> | <code>{}</code> | Параметры запроса. |

<a name="module_mysql--module.exports..MySQL+transactionRequest"></a>

##### mySQL.transactionRequest(sqlList, [paramList]) ⇒ <code>Promise</code>
Помещение данных в БД через транзакцию.
ВНИМАНИЕ! В MySQL таблицы MyISAM не поддерживают транзакции.

**Kind**: instance method of <code>[MySQL](#module_mysql--module.exports..MySQL)</code>  
**Returns**: <code>Promise</code> - resolve с результатами транзакции reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sqlList | <code>Array.&lt;string&gt;</code> |  | Список SQL-запросов. |
| [paramList] | <code>Array.&lt;object&gt;</code> | <code>[]</code> | Список параметров для запросов. |

<a name="module_mysql--module.exports..mysql"></a>

#### module.exports~mysql : <code>mysql</code> &#124; <code>IMain</code> &#124; <code>\*</code>
Модуль работы с PostgreSQL.

**Kind**: inner constant of <code>[module.exports](#exp_module_mysql--module.exports)</code>  
<a name="module_postgresql"></a>

## postgresql
Модуль работы с базой данных.

**License**: WTFPL  

* [postgresql](#module_postgresql)
    * [module.exports](#exp_module_postgresql--module.exports) ⏏
        * [~PostgreSQL](#module_postgresql--module.exports..PostgreSQL)
            * [new PostgreSQL(connectParam)](#new_module_postgresql--module.exports..PostgreSQL_new)
            * [._CLASS](#module_postgresql--module.exports..PostgreSQL.PostgreSQL+_CLASS)
            * [.connection](#module_postgresql--module.exports..PostgreSQL.PostgreSQL+connection) : <code>boolean</code> &#124; <code>pgPromise</code> &#124; <code>IMain</code>
            * [.options](#module_postgresql--module.exports..PostgreSQL.PostgreSQL+options)
            * [.connect()](#module_postgresql--module.exports..PostgreSQL+connect) ⇒ <code>pgPromise</code> &#124; <code>IMain</code> &#124; <code>Error</code>
            * [._request(sql, [param])](#module_postgresql--module.exports..PostgreSQL+_request) ⇒ <code>Promise</code>
            * [.setData(sql, [param])](#module_postgresql--module.exports..PostgreSQL+setData) ⇒ <code>Promise</code>
            * [.transactionRequest(sqlList, [paramList])](#module_postgresql--module.exports..PostgreSQL+transactionRequest) ⇒ <code>Promise</code>
        * [~pgPromise](#module_postgresql--module.exports..pgPromise) : <code>pgPromise</code> &#124; <code>IMain</code> &#124; <code>\*</code>

<a name="exp_module_postgresql--module.exports"></a>

### module.exports ⏏
Модуль работы с базой данных.

**Kind**: Exported member  
<a name="module_postgresql--module.exports..PostgreSQL"></a>

#### module.exports~PostgreSQL
Класс работы с базой данных.
При инициализации автоматически инициирует подключение к базе данных и сохраняет его в себе.

**Kind**: inner class of <code>[module.exports](#exp_module_postgresql--module.exports)</code>  

* [~PostgreSQL](#module_postgresql--module.exports..PostgreSQL)
    * [new PostgreSQL(connectParam)](#new_module_postgresql--module.exports..PostgreSQL_new)
    * [._CLASS](#module_postgresql--module.exports..PostgreSQL.PostgreSQL+_CLASS)
    * [.connection](#module_postgresql--module.exports..PostgreSQL.PostgreSQL+connection) : <code>boolean</code> &#124; <code>pgPromise</code> &#124; <code>IMain</code>
    * [.options](#module_postgresql--module.exports..PostgreSQL.PostgreSQL+options)
    * [.connect()](#module_postgresql--module.exports..PostgreSQL+connect) ⇒ <code>pgPromise</code> &#124; <code>IMain</code> &#124; <code>Error</code>
    * [._request(sql, [param])](#module_postgresql--module.exports..PostgreSQL+_request) ⇒ <code>Promise</code>
    * [.setData(sql, [param])](#module_postgresql--module.exports..PostgreSQL+setData) ⇒ <code>Promise</code>
    * [.transactionRequest(sqlList, [paramList])](#module_postgresql--module.exports..PostgreSQL+transactionRequest) ⇒ <code>Promise</code>

<a name="new_module_postgresql--module.exports..PostgreSQL_new"></a>

##### new PostgreSQL(connectParam)
Конструктор класса.


| Param | Type | Description |
| --- | --- | --- |
| connectParam | <code>object</code> | Параметры соединения с БД. |

<a name="module_postgresql--module.exports..PostgreSQL.PostgreSQL+_CLASS"></a>

##### postgreSQL._CLASS
Название текущего класса для дебага и лога ошибок

**Kind**: instance property of <code>[PostgreSQL](#module_postgresql--module.exports..PostgreSQL)</code>  
<a name="module_postgresql--module.exports..PostgreSQL.PostgreSQL+connection"></a>

##### postgreSQL.connection : <code>boolean</code> &#124; <code>pgPromise</code> &#124; <code>IMain</code>
Свойство для хранения текущего соединения.

**Kind**: instance property of <code>[PostgreSQL](#module_postgresql--module.exports..PostgreSQL)</code>  
<a name="module_postgresql--module.exports..PostgreSQL.PostgreSQL+options"></a>

##### postgreSQL.options
Хранилище настроек подключения к Redis

**Kind**: instance property of <code>[PostgreSQL](#module_postgresql--module.exports..PostgreSQL)</code>  
<a name="module_postgresql--module.exports..PostgreSQL+connect"></a>

##### postgreSQL.connect() ⇒ <code>pgPromise</code> &#124; <code>IMain</code> &#124; <code>Error</code>
Создание и получение подключения с БД. Если подключение уже создано, повторно создаваться оно не будет.

**Kind**: instance method of <code>[PostgreSQL](#module_postgresql--module.exports..PostgreSQL)</code>  
**Returns**: <code>pgPromise</code> &#124; <code>IMain</code> &#124; <code>Error</code> - Объект с соединением с БД или объект с ошибкой.  
<a name="module_postgresql--module.exports..PostgreSQL+_request"></a>

##### postgreSQL._request(sql, [param]) ⇒ <code>Promise</code>
Отправка запроса в БД и получение результата.

**Kind**: instance method of <code>[PostgreSQL](#module_postgresql--module.exports..PostgreSQL)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с результатом запроса или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>object</code> |  | Объект с данными запроса. |
| [param] | <code>object</code> | <code>{}</code> | Параметры запроса. |

<a name="module_postgresql--module.exports..PostgreSQL+setData"></a>

##### postgreSQL.setData(sql, [param]) ⇒ <code>Promise</code>
Помещение данных в БД.

**Kind**: instance method of <code>[PostgreSQL](#module_postgresql--module.exports..PostgreSQL)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>object</code> |  | Объект с данными запроса. |
| [param] | <code>object</code> | <code>{}</code> | Параметры запроса. |

<a name="module_postgresql--module.exports..PostgreSQL+transactionRequest"></a>

##### postgreSQL.transactionRequest(sqlList, [paramList]) ⇒ <code>Promise</code>
Помещение данных в БД через транзакцию.

**Kind**: instance method of <code>[PostgreSQL](#module_postgresql--module.exports..PostgreSQL)</code>  
**Returns**: <code>Promise</code> - resolve с массивом результататов транзакции reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sqlList | <code>Array.&lt;string&gt;</code> |  | Список SQL-запросов. |
| [paramList] | <code>Array.&lt;object&gt;</code> | <code>[]</code> | Список параметров для запросов. |

<a name="module_postgresql--module.exports..pgPromise"></a>

#### module.exports~pgPromise : <code>pgPromise</code> &#124; <code>IMain</code> &#124; <code>\*</code>
Модуль работы с PostgreSQL.

**Kind**: inner constant of <code>[module.exports](#exp_module_postgresql--module.exports)</code>  
<a name="module_redis"></a>

## redis
Модуль работы с кэшом.

**License**: WTFPL  

* [redis](#module_redis)
    * [module.exports](#exp_module_redis--module.exports) : <code>Redis</code> ⏏
        * [~Redis](#module_redis--module.exports..Redis)
            * [new Redis(connectParam)](#new_module_redis--module.exports..Redis_new)
            * [._CLASS](#module_redis--module.exports..Redis.Redis+_CLASS)
            * [.connection](#module_redis--module.exports..Redis.Redis+connection) : <code>Boolean</code> &#124; <code>RedisClient</code> &#124; <code>exports.createClient</code>
            * [.options](#module_redis--module.exports..Redis.Redis+options)
            * [.connect()](#module_redis--module.exports..Redis+connect) ⇒ <code>Redis.connection</code>
            * [.getData(queryName, [param])](#module_redis--module.exports..Redis+getData) ⇒ <code>Promise</code>
            * [.setData(queryName, [data], [expire], [param])](#module_redis--module.exports..Redis+setData) ⇒ <code>Promise</code>
            * [.transactionRequest(actionsList, namesList, [dataList], [expiresList])](#module_redis--module.exports..Redis+transactionRequest) ⇒ <code>Promise</code>
        * [~redis](#module_redis--module.exports..redis)

<a name="exp_module_redis--module.exports"></a>

### module.exports : <code>Redis</code> ⏏
Модуль работы с кэшом.

**Kind**: Exported member  
<a name="module_redis--module.exports..Redis"></a>

#### module.exports~Redis
Класс работы с кэшом.
При инициализации автоматически инициирует подключение к кэшу и сохраняет его в себе.

**Kind**: inner class of <code>[module.exports](#exp_module_redis--module.exports)</code>  

* [~Redis](#module_redis--module.exports..Redis)
    * [new Redis(connectParam)](#new_module_redis--module.exports..Redis_new)
    * [._CLASS](#module_redis--module.exports..Redis.Redis+_CLASS)
    * [.connection](#module_redis--module.exports..Redis.Redis+connection) : <code>Boolean</code> &#124; <code>RedisClient</code> &#124; <code>exports.createClient</code>
    * [.options](#module_redis--module.exports..Redis.Redis+options)
    * [.connect()](#module_redis--module.exports..Redis+connect) ⇒ <code>Redis.connection</code>
    * [.getData(queryName, [param])](#module_redis--module.exports..Redis+getData) ⇒ <code>Promise</code>
    * [.setData(queryName, [data], [expire], [param])](#module_redis--module.exports..Redis+setData) ⇒ <code>Promise</code>
    * [.transactionRequest(actionsList, namesList, [dataList], [expiresList])](#module_redis--module.exports..Redis+transactionRequest) ⇒ <code>Promise</code>

<a name="new_module_redis--module.exports..Redis_new"></a>

##### new Redis(connectParam)
Конструктор класса.


| Param | Type | Description |
| --- | --- | --- |
| connectParam | <code>object</code> | Параметры подключения к Redis. |

<a name="module_redis--module.exports..Redis.Redis+_CLASS"></a>

##### redis._CLASS
Название текущего класса для дебага и лога ошибок

**Kind**: instance property of <code>[Redis](#module_redis--module.exports..Redis)</code>  
<a name="module_redis--module.exports..Redis.Redis+connection"></a>

##### redis.connection : <code>Boolean</code> &#124; <code>RedisClient</code> &#124; <code>exports.createClient</code>
Свойство для хранения текущего соединения.

**Kind**: instance property of <code>[Redis](#module_redis--module.exports..Redis)</code>  
<a name="module_redis--module.exports..Redis.Redis+options"></a>

##### redis.options
Хранилище настроек подключения к Redis

**Kind**: instance property of <code>[Redis](#module_redis--module.exports..Redis)</code>  
<a name="module_redis--module.exports..Redis+connect"></a>

##### redis.connect() ⇒ <code>Redis.connection</code>
Подключение к кэшу и сохранение подключения в свойстве класса.

**Kind**: instance method of <code>[Redis](#module_redis--module.exports..Redis)</code>  
**Returns**: <code>Redis.connection</code> - Соединение с Redis.  
<a name="module_redis--module.exports..Redis+getData"></a>

##### redis.getData(queryName, [param]) ⇒ <code>Promise</code>
Получение данных из кеша.

**Kind**: instance method of <code>[Redis](#module_redis--module.exports..Redis)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve с данными из кэша или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>string</code> |  | Название запроса для формирования ключа. |
| [param] | <code>object</code> | <code>{}</code> | Параметры получения данных. |

<a name="module_redis--module.exports..Redis+setData"></a>

##### redis.setData(queryName, [data], [expire], [param]) ⇒ <code>Promise</code>
Помещение данных в кэш.

**Kind**: instance method of <code>[Redis](#module_redis--module.exports..Redis)</code>  
**Returns**: <code>Promise</code> - Промис в состоянии resolve или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| queryName | <code>string</code> |  | Название запроса для формирования ключа. |
| [data] | <code>\*</code> | <code>{}</code> | Данные для помещения в кэш. |
| [expire] | <code>number</code> | <code>0</code> | Время жизни данных в кэше. |
| [param] | <code>object</code> | <code>{}</code> | Параметры получения данных. |

<a name="module_redis--module.exports..Redis+transactionRequest"></a>

##### redis.transactionRequest(actionsList, namesList, [dataList], [expiresList]) ⇒ <code>Promise</code>
Отправка транзакционных запросов и получение результатов.

**Kind**: instance method of <code>[Redis](#module_redis--module.exports..Redis)</code>  
**Returns**: <code>Promise</code> - resolve с результатми транзакционных запросов или reject с описанием ошибки.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| actionsList | <code>Array.&lt;string&gt;</code> |  | Список действий для запросов (get || set). |
| namesList | <code>Array.&lt;string&gt;</code> |  | Список названий ключей кэша. |
| [dataList] | <code>Array.&lt;object&gt;</code> | <code>[]</code> | Список данных для помещения в кэш. |
| [expiresList] | <code>Array.&lt;number&gt;</code> | <code>[]</code> | Список указаний времени жизни каждого ключа (при запросах типа set). |

<a name="module_redis--module.exports..redis"></a>

#### module.exports~redis
Работа с Redis.

**Kind**: inner constant of <code>[module.exports](#exp_module_redis--module.exports)</code>  
<a name="request"></a>

## request(sql, [param]) ⇒ <code>Promise</code>
Получение данных из БД.

**Kind**: global function  
**Returns**: <code>Promise</code> - Промис в состоянии resolve или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>object</code> |  | Объект с данными запроса. |
| [param] | <code>object</code> | <code>{}</code> | Параметры запроса. |

<a name="request"></a>

## request(sql, [param]) ⇒ <code>Promise</code>
Получение данных из БД.

**Kind**: global function  
**Returns**: <code>Promise</code> - Промис в состоянии resolve или reject с сообщением об ошибке.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sql | <code>object</code> |  | Объект с данными запроса. |
| [param] | <code>object</code> | <code>{}</code> | Параметры запроса. |

