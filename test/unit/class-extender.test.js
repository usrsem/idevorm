'use strict';

const assert = require('assert').strict;
const { describe, it } = require('mocha');
const extend = require('../../lib/class-extender.js');
const CrudRepository = require('../../lib/crud-repository.js');

module.exports = () => describe('Class extender', () => {
  it('Creates new extended class', () => {
    class Foo {}
    const extension = { bar() {} };
    const FooExtended = extend(Foo, extension);
    assert.notStrictEqual(FooExtended, Foo);

    const foo = new FooExtended();
    assert.strictEqual(foo.bar, extension.bar);
  });

  it('Gives default name', () => {
    const extension = {};
    const cls = extend(CrudRepository, extension);
    const after = cls.prototype.constructor.name;
    const mustbe = 'CrudRepositoryExtended';
    assert.strictEqual(after, mustbe);
  });

  it('Uses given name', () => {
    const extension = {};
    const name = 'SomeStupidName';
    const cls = extend(CrudRepository, extension, name);
    const after = cls.prototype.constructor.name;
    assert.strictEqual(after, name);
  });
});
