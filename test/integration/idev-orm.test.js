'use strict';

const assert = require('assert');
const { describe, it, before, after } = require('mocha');
const config = require('../config.js');
const orm = require('../../main.js');


module.exports = () => describe('IdevOrm', () => {
  before(() => {
    orm.setDriverName('pg');
    orm.setConfig(config.postgres);
    orm.addSchema('client', config.clientSchema);
  });

  after(async () => await orm.shutdown());

  it('Extends repository', async () => {
    const extension = {
      async getTableColumns() {
        const sql = ('SELECT * FROM INFORMATION_SCHEMA.COLUMNS ' +
                     'WHERE TABLE_NAME = $1');
        const response = await this._crud.query(sql, ['client']);
        return response.fields;
      }
    };

    orm.extendRepository('client', extension);

    const repeository = orm.getRepository('client');
    const columns = await repeository.getTableColumns();

    assert(columns.length > Object.keys(config.clientSchema).length);
  });
});
