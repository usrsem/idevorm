'use strict';

const EntityMapper = require('./entity-mapper.js');
const CrudRepository = require('./crud-repository.js');
const getCrudFactory = require('./crud-abstract-factory.js');

module.exports = (driverName, schemas) => {
  const factories = new Map();

  for (const schema of schemas) {
    const mapper = new EntityMapper(schema);
    const key = schema._meta.tableName;
    const factory = (connection) => {
      const crudFactory = getCrudFactory(driverName);
      const crud = crudFactory(schema, connection);
      const repository = new CrudRepository(crud, mapper);
      return repository;
    };
    factories.set(key, factory);
  }

  return factories;
};
