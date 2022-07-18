'use strict';

const drivers = require('./drivers.js');

const factories = new Map();

factories.set('pg', (config) => {
  const { Pool } = require('pg');
  const pool = new Pool(config);
  new drivers.PostgresDriver(pool);
});

module.exports = (driverName, config) => {
  if (!factories.has(driverName)) throw new Error(
    `Unknown db name ${driverName}`);
  const abstractFactory = factories.get(driverName);
  return abstractFactory(config);
};
