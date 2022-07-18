'use strict';

const assert = require('assert').strict;
const { describe, it, afterEach, after } = require('mocha');
const { Pool } = require('pg');
const config = require('../config.js');
const getFactories = require('../../lib/repository-abstract-factory.js');

const schema = {
  _meta: { tableName: 'client', idFieldName: 'telegramId' },
  telegramId: { id: true, type: 'integer' },
  telegramUsername: { type: 'string', optional: true },
  telegramFullname: { type: 'string' },
  createdAt: { type: 'date' },
};
const schemas = new Set();
schemas.add(schema);
const pool = new Pool(config.postgres);
const factories = getFactories('pg', schemas);
const factory = factories.get('client');
const repository = factory(pool);

const id = 0;
const client = {
  telegramId: id,
  telegramUsername: 'testUsername',
  telegramFullname: 'testFullname',
  createdAt: new Date('1990-07-07'),
};

const select = async (id) => pool.query(
  'SELECT * FROM "client" WHERE "telegramId"=$1', [id]).then((res) => {
  if (res.rows.length === 1) return res.rows[0];
  else return res.rows;
});

module.exports = () => describe('CrudRepository', () => {
  afterEach(async () => {
    await pool.query('DELETE FROM "client" WHERE "telegramId"=$1', [0]);
    await pool.query('DELETE FROM "client" WHERE "telegramId"=$1', [-1]);
  });

  after(async () => await pool.end());

  it('Creates new entity', async () => {
    await repository.create(client);
    const newClient = await select(id);
    assert(newClient);
  });

  it('Fails on creating existing entity', async () => {
    let error;
    try {
      await repository.create(client);
      await repository.create(client);
    } catch (e) {
      error = e;
    }
    assert(error);
  });

  it('Reads existing entity', async () => {
    await repository.create(client);
    const newClient = await repository.read(id);
    assert.strictEqual(client.telegramId, newClient.telegramId);
  });

  it('Fails when reads not existing entity', async () => {
    let error;
    try {
      await repository.read(-1);
    } catch (e) {
      error = e;
    }
    assert(error);
  });

  it('Reads all existing entities', async () => {
    await repository.create(client);
    const clients = await repository.readAll();
    assert.equal(clients.length, 1);
  });

  it('Updates existing entity', async () => {
    const updatedClient = {
      telegramId: id,
      telegramUsername: 'updatedUsername',
      telegramFullname: 'updatedFullname',
      createdAt: new Date(),
    };
    await repository.create(client);
    await repository.update(updatedClient);
    const newClient = await select(id);
    assert.deepStrictEqual(
      updatedClient.telegramUsername,
      newClient.telegramUsername
    );
  });

  it('When updates not existing entity does not create it', async () => {
    const updatedClient = {
      telegramId: 1,
      telegramUsername: 'updatedUsername',
      telegramFullname: 'updatedFullname',
      createdAt: new Date(),
    };
    await repository.update(updatedClient);
    const newClient = await select(1);
    assert.deepStrictEqual(newClient, []);
  });

  it('Deletes existing entity', async () => {
    await repository.create(client);
    await repository.delete(id);
    const newClient = await select(id);
    assert.deepStrictEqual(newClient, []);
  });

  it('Not fails when deleting not existing entity', async () => {
    try {
      await repository.delete(id);
    } catch (e) {
      assert.ifError(e);
    }
  });
});
