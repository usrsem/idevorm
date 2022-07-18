# idevorm
Lightweight ORM library for node js

## Supported databases
* PostgreSql

## Demo

At first setup orm with db name and it's config:
```js
const orm = require('idevorm');

const config = {
  host: '127.0.0.1',
  port: '5432',
  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
}

orm.setDriverName('pg');
orm.setConfig(config);
```

Then add some schemas:
```js
orm.addSchema('client', {
  telegramId: { id: true, type: 'integer' },
  telegramUsername: { type: 'string', optional: true },
  telegramFullname: { type: 'string' },
  createdAt: { type: 'date' },
});
```
First argument - table name, second - schema, where one field should has
propery `id: true`.

After that import `idevorm` from any place in project and get declarative
Unit of Work, that contains repositories for all schemas:
```js
const uow = orm.getDeclarativeRepositoryUow();

(async () => {
  try {
    await uow.begin();
    const client = {
      telegramId: 0,
      telegramUsername: 'testUsername',
      telegramFullname: 'testFullname',
      createdAt: new Date(),
    };
    await uow.client.create(client);
    await uow.commit();
  } catch (e) {
    console.error(e);
    await uow.rollback();
  }
});
```

Or use more functional syntax:
```js
(async () => {
  await orm.run((uow) => {
    const client = {
      telegramId: 0,
      telegramUsername: 'testUsername',
      telegramFullname: 'testFullname',
      createdAt: new Date(),
    };
    await uow.client.create(client);
})();
```

Also you can get repository directly:
```js
const clientRepository = orm.getRepository('client');
```
