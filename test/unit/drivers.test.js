'use strict';

const assert = require('assert').strict;
const { describe, it, beforeEach } = require('mocha');
const drivers = require('../../lib/drivers.js');
const FakePostgresPool = require('../fakes/postgres-pool.js');

module.exports = () => describe('Drivers', () => {
  let pool, driver;

  beforeEach(() => {
    pool = new FakePostgresPool();
    driver = new drivers.PostgresDriver(pool);
  });

  describe('Postgres', () => {
    it('Begins connection', async () => {
      await driver.begin();
      assert(pool.begun());
    });

    it('Commits connection', async () => {
      await driver.begin();
      await driver.commit();
      assert(pool.commited());
    });

    it('Releases connection on commit', async () => {
      await driver.begin();
      await driver.commit();
      assert(pool.connectionReleased());
    });

    it('Rolls back conntection', async () => {
      await driver.begin();
      await driver.rollback();
      assert(pool.rolledback());
    });

    it('Releases connection on rollback', async () => {
      await driver.begin();
      await driver.rollback();
      assert(pool.connectionReleased());
    });

    it('Shutdowns pool', async () => {
      await driver.shutdown();
      assert(pool.shuteddown());
    });
  });
});
