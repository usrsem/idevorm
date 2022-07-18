'use strict';

const assert = require('assert').strict;
const pg = require('pg');
const PostgresCrud = require('../../lib/postgres-crud.js');
const config = require('../config.js');
const { describe, it, after, afterEach } = require('mocha');

const client = {
  telegramId: 0,
  telegramUsername: 'test_username',
  telegramFullname: 'test_fullname',
  createdAt: '2022-07-07',
};

const getClientCopy = () => {
  const copy = {};
  for (const key in client) {
    copy[key] = client[key];
  }
  return copy;
};

const info = {
  tableName: 'client',
  idFieldName: 'telegramId'
};


const _select = (
  `SELECT * FROM "${info.tableName}" ` +
  `WHERE "${info.idFieldName}" = 0`
);

const _delete = (
  `DELETE FROM "${info.tableName}" ` +
  `WHERE "${info.idFieldName}" = 0`
);

module.exports = () => describe('CRUD', () => {
  const pool = new pg.Pool(config.postgres);
  const service = new PostgresCrud(info, pool);

  afterEach(async () => {
    await pool.query(_delete);
  });

  after(async () => {
    await pool.end();
  });

  describe('create', () => {
    it('Should create entity', async () => {
      try {
        await service.create(client);
        const res = await pool.query(_select);
        assert.ok(res.rows[0], client);
      } catch (e) {
        assert.ifError(e);
      }
    });

    it('Should fail on creating existing entity', async () => {
      let error;
      try {
        await service.create(client);
        await service.create(client);
      } catch (e) {
        error = e;
      }
      assert(error);
    });
  });

  describe('read', () => {
    it('Should read existing entity', async () => {
      try {
        await service.create(client);
        const res = await service.read(client.telegramId);
        assert.ok(res.rows[0], client);
      } catch (e) {
        assert.ifError(e);
      }
    });

    it('Should not fail reading not existing entity', async () => {
      try {
        await service.read(client.telegramId);
      } catch (e) {
        assert.ifError(e);
      }
    });
  });

  describe('update', () => {
    it('Should update existing entity', async () => {
      try {
        await service.create(client);
        const copy = getClientCopy();
        copy.telegramUsername = 'anotherUserName';
        await service.update(copy);
        const pgClone = await service.read(client.telegramId);
        assert.ok(copy, pgClone.rows[0]);
      } catch (e) {
        assert.ifError(e);
      }
    });

    it('Should not fail updating not existing entity', async () => {
      try {
        await service.update(client);
      } catch (e) {
        assert.ifError(e);
      }
    });
  });

  describe('delete', () => {
    it('Should delete existing entity', async () => {
      try {
        await service.create(client);
        await service.delete(client.telegramId);
        const res = await pool.query(_select);
        assert.strictEqual(res.rows.length, client.telegramId);
      } catch (e) {
        assert.ifError(e);
      }
    });

    it('Should not fail on deleting not existing entity', async () => {
      try {
        await service.delete(client.telegramId);
      } catch (e) {
        assert.ifError(e);
      }
    });
  });

});
