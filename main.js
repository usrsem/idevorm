'use strict';

const IdevOrm = require('./lib/idev-orm.js');
const processSchema = require('./lib/schema-processor.js');

const orm = new IdevOrm(processSchema);

const gracefulShutdown = () => orm.shutdown().then(() => process.exit(0));

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = orm;
