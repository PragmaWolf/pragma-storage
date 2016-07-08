# Модуль для работы с хранилищами данных]

## Стек технологий
- NodeJS 6+ [Документация](https://nodejs.org/dist/latest-v5.x/docs/api/)
- Redis 3+ [Документация](http://redis.io/documentation)
- PostgreSQL 9.5+ [Документация](http://www.postgresql.org/docs/9.5/interactive/index.html)
- MySQL 5.7+ [Документация](http://dev.mysql.com/doc/)
- ES2015

## Использование

#### Подключение
    const storage = require('storage');

#### Инициализация

    storage.init(options, queries);

#### Запросы

Получение данных

    storage.getter('queryName', param)
        .then(result => {
            console.log(result);
        });

Сохранение данных

    storage.setter('otherQueryName', param)
        .then(() => {
            // Делаем что-то полезное
        });

### Настройки

Для подключений к одной БД и кэшу:

    {
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
            db:     0,
            prefix: 'cache:'
    }

Для подключений к нескольким БД и кэшам:

    {
        keyValue:     {
            driver:     'mysql',
            connection: {
                host:     '127.0.0.1',
                port:     3306,
                database: 'dbName',
                user:     'userName',
                password: 'secret'
            },
            redis:      {
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
    }

### Список запросов

    {
        getSomeData:         {
            connection: 'keyValue',
            sql:        `SELECT * FROM table_mysql LIMIT 5;`,
            caching:    true,
            expire:     360000,
            addition:   false
        },
        getOtherSomeData:    {
            connection: false,
            sql:        `SELECT * FROM table_postgres WHERE id = $(insertId) $>insertMore< LIMIT 5;`,
            caching:    false,
            expire:     0,
            addition:   {
                insertMore: `AND otherField = $(value)`
            }
    }

или, если используется подключение к одной БД и кэшу

    queryName:      {
            connection: false,
            sql:        `SELECT * FROM statistics LIMIT 5;`,
            caching:    false,
            expire:     0,
            addition:   false
    }

# Лицензия
[wtfpl]: wtfpl-badge-1.png "WTFPL License :)"
![No WTFPL License image :(][wtfpl]
