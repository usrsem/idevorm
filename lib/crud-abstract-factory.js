'use strict';

const PostgresCrud = require('./postgres-crud.js');

const postgresCrudFactory = (schema, connection) => {
  const info = {
    tableName: schema._meta.tableName,
    idFieldName: schema._meta.idFieldName,
  };
  return new PostgresCrud(info, connection);
};

const factories = new Map();
factories.set('pg', postgresCrudFactory);

module.exports = (driverName) => {
  if (!factories.has(driverName)) throw new Error(
    `Unknown driver name: ${driverName}`);
  return factories.get(driverName);
};
