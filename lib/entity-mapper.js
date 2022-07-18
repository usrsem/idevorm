'use strict';

const strategies = require('./strategies.js');

module.exports = class EntityMapper {
  constructor(schema) {
    this._schema = schema;
  }

  parse(record) {
    for (const key in record) {
      const fieldMetaInfo = this._schema[key];
      if (!fieldMetaInfo) throw new Error(`Key ${key} not found in schema`);
      const fieldData = record[key];
      const needToMap = !(fieldMetaInfo.optional && fieldData === null);
      if (needToMap) {
        const strategy = strategies[fieldMetaInfo.type];
        record[key] = strategy(fieldData);
      }
    }
    return record;
  }

  parseMany(records) {
    return records.map((record) => this.parse(record));
  }
};
