'use strict';

const RepositoryUow = require('./repository-uow.js');
const getDriver = require('./driver-factory.js');
const getRepositoriesFactories = require('./repository-abstract-factory.js');

module.exports = class IdevOrm {
  constructor(schemaProcessor) {
    this._schemaProcessor = schemaProcessor;
    this._schemas = new Set();
  }

  setDriverName(dbName) {
    this._driverName = dbName;
  }

  setConfig(config) {
    this._config = config;
  }

  addSchema(tableName, schema) {
    this._schemas.add(this._schemaProcessor(tableName, schema));
  }

  getDeclarativeRepositoryUow() {
    this._initDriverIfNeeded();
    this._initRepositoriesFactoriesIfNeeded();
    return new RepositoryUow(this._repositoriesFactories, this._driver);
  }

  async run(afunc) {
    const uow = this.getDeclarativeRepositoryUow();
    try {
      await uow.begin();
      const res = afunc(uow);
      await uow.commit();
      return res;
    } catch (e) {
      await uow.rollback();
      throw e;
    }
  }

  getRepository(tableName) {
    this._initDriverIfNeeded();
    this._initRepositoriesFactoriesIfNeeded();
    for (const [name, factory] of this._repositoriesFactories.entries()) {
      if (name === tableName) return factory(this._driver.pool);
    }
    throw new Error(`Repository for table ${tableName} not found`);
  }

  _initRepositoriesFactoriesIfNeeded() {
    if (!this._repositoriesFactories) {
      this._repositoriesFactories = getRepositoriesFactories(
        this._driverName, this._schemas
      );
    }
  }

  _initDriverIfNeeded() {
    if (!this._driver) {
      if (!this._driverName) throw new Error('Driver name should be specified');
      if (!this._config) throw new Error('Config should be specified');
      this._driver = getDriver(this._driverName, this._config);
    }

  }

  async shutdown() {
    await this._driver.shutdown();
  }
};
