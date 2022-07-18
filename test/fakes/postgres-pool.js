'use strict';

module.exports = class FakePostgresPool {
  constructor() {
    const connection = {
      connected: false,
      commited: false,
      rolledback: false,
      released: false,
    };

    connection.query = (sql) => {
      if (sql === 'BEGIN') {
        connection.connected = true;
      } else if (sql === 'COMMIT') {
        connection.commited = true;
      } else if (sql === 'ROLLBACK') {
        connection.rolledback = true;
      }
    };

    connection.release = () => {
      connection.released = true;
    };

    this.isShuteddown = false;
    this.connection = connection;
  }

  connect() {
    return this.connection;
  }

  end() {
    console.log('ending pool');
    this.isShuteddown = true;
  }

  begun() {
    return this.connection.connected;
  }

  commited() {
    return this.connection.commited;
  }

  rolledback() {
    return this.connection.rolledback;
  }

  connectionReleased() {
    return this.connection.released;
  }

  shuteddown() {
    return this.shuteddown;
  }
};
