'use strict';

class PostgresDriver {
  constructor(pool) {
    this._pool = pool;
  }

  get connection() {
    return this._connection;
  }

  get pool() {
    return this._pool;
  }

  async begin() {
    this._connection = await this._pool.connect();
    await this._connection.query('BEGIN');
  }

  async commit() {
    await this._connection.query('COMMIT');
    this._connection.release();
    delete this._connection;
  }

  async rollback() {
    await this._connection.query('ROLLBACK');
    this._connection.release();
  }

  async shutdown() {
    await this._pool.end();
  }
}

module.exports = {
  PostgresDriver,
};
