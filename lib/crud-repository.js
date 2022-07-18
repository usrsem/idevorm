'use strict';

module.exports = class CrudRepository {
  constructor(crud, mapper) {
    this._crud = crud;
    this._mapper = mapper;
  }

  async create(record) {
    return this._crud.create(record);
  }

  async read(id) {
    this._crud.read(id)
      .then((res) => {
        if (!res.rows) throw new Error(`Record with id=${id} not found`);
        return this._mapper.parse(res.rows[0]);
      })
      .catch((err) => {
        throw err;
      });
  }

  async update(record) {
    return this._crud.update(record);
  }

  async delete(id) {
    return this._crud.delete(id);
  }
};
