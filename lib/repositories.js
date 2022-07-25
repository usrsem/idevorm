'use strict';

const CrudRepository = require('./crud-repository.js');

class DefaultMap extends Map {
  constructor(defaultFunction, entries) {
    if (!defaultFunction && !entries) throw new Error(
      'Default function should be passed');
    super(entries);
    this._default = defaultFunction;
  }

  get(key) {
    if (!this.has(key)) this.set(key, this._default());
    return super.get(key);
  }
}

const repositories = DefaultMap(() => CrudRepository);

module.exports = {
  getRepositoryClass: (tableName) => repositories.get(tableName),
  setRepositoryClass: (tableName, cls) => repositories.set(tableName, cls),
};
