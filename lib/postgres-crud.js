'use strict';

module.exports = class PostgresCrud {
  constructor({ tableName, idFieldName }, connection) {
    this._tableName = tableName;
    this._idFieldName = idFieldName;
    this._connection = connection;
  }

  async query(sql, args) { return await this._connection.query(sql, args); }

  // TODO: Use array of field's names and values
  async create(record) {
    const keys = Object.keys(record);
    const nums = new Array(keys.length);
    const data = new Array(keys.length);

    let i = 0;
    for (const key of keys) {
      data[i] = record[key];
      nums[i] = `$${++i}`;
    }

    const fields = '"' + keys.join('", "') + '"';
    const params = nums.join(', ');
    const sql = `INSERT INTO "${this._tableName}" (${fields}) ` +
                `VALUES (${params})`;

    return this.query(sql, data);
  }

  async read(id, fields = ['*']) {
    const names = fields.join(', ');
    const sql = `SELECT ${names} FROM ${this._tableName}`;
    if (!id) return this.query(sql);
    return this.query(`${sql} WHERE ${this._idFieldName} = $1`, [id]);
  }

  // TODO: Use arrays of fields names and values
  async update(record) {
    const id = record[this._idFieldName];
    const keys = Object.keys(record);
    const updates = new Array(keys.length);
    const data = new Array(++keys.length);

    let i = 0;
    for (const key in record) {
      data[i] = record[key];
      updates[i] = `"${key}" = $${++i}`;
    }

    data.pop();
    data.push(id);

    const delta = updates.join(', ');
    const sql = `UPDATE ${this._tableName} ` +
                `SET ${delta} ` +
                `WHERE "${this._idFieldName}" = $${++i}`;
    return this.query(sql, data);
  }

  async delete(id) {
    const sql = `DELETE FROM ${this._tableName} ` +
                `WHERE "${this._idFieldName}" = $1`;
    return this.query(sql, [id]);
  }
};
