'use strict';

module.exports = {
  postgres: {
    host: process.env['IDEVORM_POSTGRES_HOST'] || '127.0.0.1',
    port: process.env['IDEVORM_POSTGRES_PORT'] || '5432',
    database: process.env['IDEVORM_POSTGRES_DB_NAME'] || 'postgres',
    user: process.env['IDEVORM_POSTGRES_USER'] || 'postgres',
    password: process.env['IDEVORM_POSTGRES_PASSWORD'] || 'postgres',
  }
};
