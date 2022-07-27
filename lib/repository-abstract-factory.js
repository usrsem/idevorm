'use strict';

const EntityMapper = require('./entity-mapper.js');
const getCrudFactory = require('./crud-abstract-factory.js');
const { getRepositoryClass } = require('./repositories.js');

module.exports = (driverName, schemas) => {
  const factories = new Map();

  for (const schema of schemas) {
    const mapper = new EntityMapper(schema);
    const key = schema._meta.tableName;
    const factory = (connection) => {
      const crudFactory = getCrudFactory(driverName);
      const crud = crudFactory(schema, connection);
      const RepositoryClass = getRepositoryClass(schema._meta.tableName);
      const repository = new RepositoryClass(crud, mapper);
      return repository;
    };
    factories.set(key, factory);
  }

  return factories;
};
