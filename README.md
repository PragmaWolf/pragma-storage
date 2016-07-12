# Module works with external storage (database and cache). #

## Used and tested on ##

- NodeJS 6+ [Documentation](https://nodejs.org/dist/latest-v5.x/docs/api/)
- Redis 3+ [Documentation](http://redis.io/documentation)
- PostgreSQL 9.5+ [Documentation](http://www.postgresql.org/docs/9.5/interactive/index.html)
- MySQL 5.7+ [Documentation](http://dev.mysql.com/doc/)
- ES2015

## Install ##

```bash
npm i -save pragma-storage
```

## Connection ##

```javascript
const pragmaStorage = require('pragma-storage');
```

## Initialization ##

```javascript
pragmaStorage.init(options, queries);
```

### Options ###

To connect to multiple databases and/or caches:

```json
{
    "keyValue": {
        "driver": "mysql",
        "connection": {
            "host": "127.0.0.1",
            "port": 3306,
            "database": "dbName",
            "user": "userName",
            "password": "secret"
        },
        "redis": {
            "host": "127.0.0.1",
            "port": 6379,
            "db": 1,
            "prefix": "mysql:"
        }
    },
    "production":  {
        "driver":     "postgres",
        "connection": {
            "host":     "127.0.0.1",
            "port":     5432,
            "database": "dbName",
            "user":     "userName",
            "password": "secret"
        },
        "redis":      {
            "host":   "127.0.0.1",
            "port":   6379,
            "db":     2,
            "prefix": "postgres"
        }
}
```

__keyValue__ - Connection name. The name of this parameter can be any of your choice.

__keyValue.driver__ - `string|boolean` - What database is used (`'mysql'` or `'postgres'`). It can be `false` if you do not need a database connection.

__keyValue.connection__ - `object|boolean` - Connection parameters for database. It can be `false` if you do not need a database connection.

__keyValue.connection.host__ - `string` - Database host.

__keyValue.connection.port__ - `number` - Database port.

__keyValue.connection.database__ - `string` - Database name.

__keyValue.connection.user__ - `string` - Database user name.

__keyValue.connection.password__ - `string` - Database user password.

__keyValue.redis__ - `object|boolean` - Connection parameters for Redis. It can be `false` if you do not need a Redis connection.

__keyValue.redis.host__ - `string` - Redis host.

__keyValue.redis.port__ - `number` - Redis port.

__keyValue.redis.database__ - `number` - Redis database number.

__keyValue.redis.prefix__ - `string` - Prefix for all keys in Redis.

To connect to a one database and/or cache:

```json
{
    "driver": "postgres",
    "connection": {
        "host": "127.0.0.1",
        "port": 5432,
        "database": "dbName",
        "user": "userName",
        "password": "secret"
    },
    "redis": {
        "host": "127.0.0.1",
        "port": 6379,
        "db": 0,
        "prefix": "cache:"
}
```

__driver__ - `string|boolean` - What database is used (`'mysql'` or `'postgres'`). It can be `false` if you do not need a database connection.

__connection__ - `object|boolean` - Connection parameters for database. It can be `false` if you do not need a database connection.

__connection.host__ - `string` - Database host.

__connection.port__ - `number` - Database port.

__connection.database__ - `string` - Database name.

__connection.user__ - `string` - Database user name.

__connection.password__ - `string` - Database user password.

__redis__ - `object|boolean` - Connection parameters for Redis. It can be `false` if you do not need a Redis connection.

__redis.host__ - `string` - Redis host.

__redis.port__ - `number` - Redis port.

__redis.database__ - `number` - Redis database number.

__redis.prefix__ - `string` - Prefix for all keys in Redis.

### Queries ###

```json
{
    "queryName": {
        "connection": false,
        "sql": "SELECT * FROM table_postgres WHERE id = $(insertId) $>additionParam< LIMIT 5;",
        "caching": false,
        "expire": 0,
        "addition": {
            "additionParam": "AND otherField = $(value)"
        }
}
```

If you connect to only one database/cache in connection settings will be created automatically name `main`. It can be used to query lists instead of specifying `false`.

__queryName__ - Query name in list. The name of this parameter can be any of your choice.

__queryName.connection__ - `string` - Connection name from options. It can be `false` if you used single database connection.

__queryName.sql__ - `string` - The text of the SQL query to the database.

__queryName.caching__ - `boolean` - Using or not cache for this query.

__queryName.expire__ - `number` - Cache lifetime in milliseconds.

__queryName.addition__ - `object|boolean` - Additional parameters for SQL query. It can be `false` if you do not need use additional parameters. The name of this parameter can be any of your choice.

__queryName.addition.additionParam__ - `string` - Part of the SQL query which should be added to the main SQL query (`queryName.sql`).

Additional request parameters to be used if a parameter with the same name is present in the data transmitted to the query. To optional parameter was added to the main body of the request is necessary to specify the design of adding space `$>additionParam<`.

## Methods ##

### addSettings(options); ###

__options__ - `object` - See options description.

Return `Promise`.

Changing the settings have already initialized module. The new settings will replace the old, listed at initialization.

```javascript
let newOptions = {
                     keyValue:     {
                         driver:     'mysql',
                         connection: {
                             host:     '127.0.0.1',
                             port:     3306,
                             database: 'dbName',
                             user:     'userName',
                             password: 'secret'
                         },
                         redis:      { //
                             host:   '127.0.0.1',
                             port:   6379,
                             db:     1,
                             prefix: 'mysql:'
                         }
                     },
                     production:  {
                         driver:     'postgres',
                         connection: {
                             host:     '127.0.0.1',
                             port:     5432,
                             database: 'dbName',
                             user:     'userName',
                             password: 'secret'
                         },
                         redis:      {
                             host:   '127.0.0.1',
                             port:   6379,
                             db:     2,
                             prefix: 'postgres'
                         }
                 };

pragmaStorage.addSettings(newOptions);
```

### addQueries(queries); ###

__queries__ - `object` - See queries description.

Return `Promise`.

The change request list already initialized module. The new list replaces the old query provided during initialization.

```javascript
let newQueries = {
                     getSomeData:         {
                         connection: 'keyValue',
                         sql:        `SELECT * FROM table_mysql LIMIT 5;`,
                         caching:    true,
                         expire:     360000,
                         addition:   false
                     },
                     queryName:    {
                         connection: false,
                         sql:        `SELECT * FROM table_postgres WHERE id = $(insertId) $>additionParam< LIMIT 5;`,
                         caching:    false,
                         expire:     0,
                         addition:   {
                             additionParam: `AND otherField = $(value)`
                         }
                 };

pragmaStorage.addQueries(newQueries);
```

### getDriver(driverName) ###

__driverName__ - `string` - Existing values `mysql`, `postgres`, `redis`. Other values return null.

Return driver object or `null`.

Getting object uninitialized module connection to a database or cache by name. Options `mysql`,` postgres`, `redis`. For manual handling is not provided for the module PragmaStorage.

```javascript
const postgres = pragmaStorage.getDriver('postgres');
```

### getDBConnection(connectionName) ###

__connectionName__ - `string` - Connection name specified in the module settings.

Return database connection object or `null`.

Getting active connections to the database by name specified in the settings. For manual handling is not provided for the module PragmaStorage.

```javascript
const dbConnection = pragmaStorage.getDBConnection('keyValue');
```

### getCacheConnection(connectionName) ###

__connectionName__ - `string` - Connection name specified in the module settings.

Return cache connection object or `null`.

Getting active compound with keshom the title specified in the settings. For manual handling is not provided for the module PragmaStorage.

```javascript
const cacheConnection = pragmaStorage.getCacheConnection('keyValue');
```

### getData(queryName[, param]) ###

__queryName__ - `string` - The name of the query specified in the request list.

__param__ - `object` - The object with the parameters for the query.

Return `Promise`.

Getting data from storage (cache or database). First requesting cache, if the data is not found in the cache, the data will be requested from the database. Automatically cache data from the database, if the query caching setting is set the flag.

```javascript
let param = {
    insertId: 1,
    additionParam: 1
};

pragmaStorage.getData('queryName', param)
    .then(result => {
        // Do something
    })
    .catch(error => {
        console.error(error);
    });
```

### getFromDB(queryName[, param]) ###

__queryName__ - `string` - The name of the query specified in the request list.

__param__ - `object` - The object with the parameters for the query.

Return `Promise`.

Retrieving data from the database directly, bypassing the cache. Query results are not cached.

```javascript
let param = {
    insertId: 1,
    additionParam: 1
};

pragmaStorage.getFromDB('queryName', param)
    .then(result => {
        // Do something
    })
    .catch(error => {
        console.error(error);
    });
```

### getFromCache(connectionName, cacheName) ###

__connectionName__ - `string` - Connection name specified in the module settings.

__cacheName__ - `string` - Name of the cache key.

Return `Promise`.

Retrieving data from the cache only, without using the database.

```javascript
pragmaStorage.getFromCache('keyValue', 'CacheKey')
    .then(result => {
        // Do something
    })
    .catch(error => {
        console.error(error);
    });
```

### setToDB(queryName[, param]) ###

__queryName__ - `string` - Name of the query specified in the request list.

__param__ - `object` - Object with the parameters for the query.

Return `Promise`.

Putting data in a database. The data is not cached.

```javascript
let param = {
    insertId: 1,
    additionParam: 1
};

pragmaStorage.setToDB('queryName', param)
    .then(result => {
        // Do something
    })
    .catch(error => {
        console.error(error);
    });
```

### setToCache(connectionName, cacheName, data[, expire]) ###

__connectionName__ - `string` - Connection name specified in the module settings.

__cacheName__ - `string` - Name of the cache key.

__data__ - `any` - Data to be placed in the cache.

__expire__ - `number` - Cache lifetime in milliseconds. Default value `0`.

Return `Promise`.

```javascript
let data = [1, 2, 3, 4, 5];

pragmaStorage.setToCache('keyValue', 'CacheKey', data, 60000)
    .then(result => {
        // Do something
    })
    .catch(error => {
        console.error(error);
    });
```

### transactionToDB(sqlList[, paramList]) ###

__sqlList__ - `string[]` - List the names of queries in the request list.

__paramList__ - `object[]` - Array of object with the parameters for the each query in the `sqlList`. Parameters may be an empty object.

Return `Promise`. In resolve will be array of queries results.

```javascript
let sqlList = [
    'queryNameOne',
    'queryNameTwo',
    'queryNameThree'
];

let parameters = [
    {
        insertId: 1,
    },
    {},
    {
        queryParam: 'something'
    },
];

pragmaStorage.transactionToDB(sqlList, paramList = [])
    .then(result => {
        // Do something
    })
    .catch(error => {
        console.error(error);
    });
```

### transactionToCache(connectionName, actionsList, namesList[, dataList, expiresList]) ###

__connectionName__ - `string` - Connection name specified in the module settings.

__actionsList__ - `string[]` - Action list for requests (`get` or `set`).

__namesList__ - `string[]` - List cache key name for each action in the `actionsList`.

__dataList__ - `any[]` - List of data to be placed in the cache for each action in the `actionsList`.

__expiresList__ - `number[]` - The list of directives lifetime for each action `set` in the `actionsList`. For action `get` lifetime value must be `0`.

Return `Promise`. In resolve will be array of queries results.

Sending transactional requests to the cache and get the results.

```javascript
let actions = [
    'set',
    'set',
    'get'
];

let names = [
    'casheNameOne',
    'casheNameOne',
    'casheNameThee'
];

let data = [
    'something',
    {
        something: true
    },
    {}
];

let expires = [
    10000,
    20000,
    0
];

pragmaStorage.transactionToCache('keyValue', actions, names, data, expires)
    .then(result => {
        // Do something
    })
    .catch(error => {
        console.error(error);
    });
```

### reloadFromDBToCache(queryName[, param]) ###

__queryName__ - `string` - The name of the query specified in the request list.

__param__ - `object` - The object with the parameters for the query.

Return `Promise`.

Retrieving data from the database and placing them in the cache.

```javascript
let param = {
    insertId: 1,
    additionParam: 1
};

pragmaStorage.reloadFromDBToCache('queryName', param)
    .then(result => {
        // Do something
    })
    .catch(error => {
        console.error(error);
    });
```

# License #

[wtfpl]: wtfpl-badge-1.png "WTFPL License :)"
![No WTFPL License image :(][wtfpl]
