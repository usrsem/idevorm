'use strict';

const assert = require('assert');
const { describe, it } = require('mocha');
const EntityMapper = require('../../lib/entity-mapper.js');

module.exports = () => describe('EntityMapper', () => {
  it('Fails on getting key that does not exists in schema', () => {
    const schema = {};
    const undertest = new EntityMapper(schema);
    const before = { foo: '123' };
    assert.throws(() => undertest.parse(before));
  });

  it('Converts entity', () => {
    const schema = {
      foo: { type: 'string' },
      bar: { type: 'integer' },
      baz: { type: 'boolean' },
      gaz: { type: 'date' },
    };
    const undertest = new EntityMapper(schema);
    const before = {
      foo: 'some string',
      bar: '123',
      baz: 'true',
      gaz: new Date('2022-05-06').toISOString(),
    };
    const after = undertest.parse(before);
    const mustbe = {
      foo: 'some string',
      bar: 123,
      baz: true,
      gaz: new Date('2022-05-06'),
    };
    assert.deepStrictEqual(after, mustbe);
  });
});
