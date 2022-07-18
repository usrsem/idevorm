'use strict';

const orm = require('./application/db/main.js');
const config = require('./application/config.js');

orm.setDriverName('pg');
orm.setConfig(config.db.postgres);

// In schemas file
orm.addSchema('client', {
  telegramId: { id: true, type: 'integer' },
  telegramUsername: { type: 'string', optional: true },
  telegramFullname: { type: 'string' },
  createdAt: { type: 'date' },
});

// Any place in project
const uow = orm.getDeclarativeRepositoryUow();

// Declarative style with UoW
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

// or more simple syntax
(async () => {
  await orm.run((uow) => {
    const client = {
      telegramId: 0,
      telegramUsername: 'testUsername',
      telegramFullname: 'testFullname',
      createdAt: new Date(),
    };
    await uow.client.create(client);
  });
})();


// Need to run at gracefull shutdown
(async () => await orm.shutdown())();
