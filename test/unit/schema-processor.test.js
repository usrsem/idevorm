'use strict';

const assert = require('assert').strict;
const { describe, it } = require('mocha');
const processSchema = require('../../lib/schema-processor.js');

module.exports = () => describe('Schema processor', () => {
  it('Fails if there aren\'t any field with id property', () => {
    assert.throws(() => processSchema('foo', {
      bar: { type: 'integer' },
      baz: { type: 'string' },
    }));
  });

  it('Fails if passed not implemented type', () => {
    assert.throws(() => processSchema('foo', {
      bar: { id: true, type: 'not implemented type' },
    }));
  });

  it('Fails if there are more then one field with id property', () => {
    assert.throws(() => processSchema('foo', {
      bar: { type: 'integer', id: true },
      baz: { type: 'string', id: true },
    }));
  });

  it('Creates _meta object', () => {
    const before = {
      bar: { type: 'integer', id: true },
      baz: { type: 'string' },
    };
    const after = processSchema('foo', before);
    const mustbe = {
      _meta: { tableName: 'foo', idFieldName: 'bar' },
      bar: { type: 'integer', id: true },
      baz: { type: 'string' },
    };
    assert.deepEqual(after, mustbe);
  });

  it('Rewrites tableName', () => {
    const before = {
      _meta: { tableName: 'someName' },
      bar: { type: 'integer', id: true },
      baz: { type: 'string' },
    };
    const after = processSchema('foo', before);

    assert.strictEqual(after._meta.tableName, before._meta.tableName);
  });
});
