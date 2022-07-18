'use strict';

const orm = require('./main.js');
const config = require('./test/config.js');

orm.setDriverName('pg');
orm.setConfig(config.postgres);

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
const demo = async () => {
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
    console.log('Commited');
  } catch (e) {
    console.error(e);
    await uow.rollback();
  }

  await orm.run(async (uow) => {
    await uow.client.delete(0);
  }).then(() => console.log('Deleted'));
};

demo().then(() => orm.shutdown());
