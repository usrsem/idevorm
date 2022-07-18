'use strict';

module.exports = class RepositoryUow {
  constructor(repositories, driver) {
    this._repositoriesFactories = repositories;
    this._driver = driver;
  }

  async begin() {
    await this._driver.begin();
    this._addRepositories();
  }

  async rollback() {
    await this._driver.rollback();
    this._clearRepositories();
  }

  async commit() {
    await this._driver.commit();
    this._clearRepositories();
  }

  _addRepositories() {
    for (const [name, factory] of this._repositoriesFactories.entries()) {
      const repository = factory(this._driver.connection);
      this[name] = repository;
    }
  }

  _clearRepositories() {
    for (const entry of this._repositoriesFactories.entries()) {
      delete this[entry[0]];
    }
  }
};
