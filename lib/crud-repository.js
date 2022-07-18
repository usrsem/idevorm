'use strict';

module.exports = class CrudRepository {
  constructor(crud, mapper) {
    this._crud = crud;
    this._mapper = mapper;
  }

  async create(record) {
    await this._crud.create(record);
  }

  async read(id) {
    const res = await this._crud.read(id);
    if (res.rows.length === 0) throw new Error(
      `Record with id=${id} not found`);
    return this._mapper.parse(res.rows[0]);
  }

  async readAll() {
    const res = await this._crud.read();
    return this._mapper.parseMany(res.rows);
  }

  async update(record) {
    await this._crud.update(record);
  }

  async delete(id) {
    await this._crud.delete(id);
  }
};
