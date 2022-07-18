'use strict';

const strategiesNames = Object.keys(require('./strategies.js'));

const checkType = (type) => strategiesNames.includes(type);

module.exports = (tableName, schema) => {
  if (!schema._meta) {
    schema._meta = { tableName };
  } else if (!schema._meta.tableName) {
    schema._meta.tableName = tableName;
  }

  let idFound = !!schema._meta.idFieldName;

  for (const key in schema) {
    if (key === '_meta') continue;
    const fieldType = schema[key].type;
    if (!checkType(fieldType)) throw new Error(
      `Type ${fieldType} not implemented`);
    if (schema[key].id) {
      if (!idFound) {
        schema._meta.idFieldName = key;
        idFound = true;
      } else throw new Error('Only one id field required');
    }
  }

  if (!idFound) throw new Error('No one field with id property passed');

  return schema;
};
