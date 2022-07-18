'use strict';

const assert = require('assert').strict;
const { describe, it } = require('mocha');
const strategies = require('../../lib/strategies.js');

module.exports = () => describe('Strategies', () => {
  describe('integer', () => {
    it('converts string to integer', () => {
      const before = '123';
      const after = strategies.integer(before);
      const mustbe = 123;
      assert.strictEqual(after, mustbe);
    });
    it('fails on converting float', () => {
      assert.throws(() => {
        const before = '12.3';
        strategies.integer(before);
      });
    });
    it('fails on NaN converting', () => {
      assert.throws(() => {
        const before = 'some string';
        strategies.integer(before);
      });
    });
  });
  describe('string', () => {
    it('returns existing string', () => {
      const before = 'some string';
      const after = strategies.string(before);
      const mustbe = 'some string';
      assert.strictEqual(after, mustbe);
    });
  });
  describe('boolean', () => {
    it('converts string with true in all cases', () => {
      const tests = ['true', 'True', 'TRUE'];
      for (const before of tests) {
        const after = strategies.boolean(before);
        const mustbe = true;
        assert.strictEqual(
          after, mustbe,
          `before: ${before}, after: ${after}, mustbe: ${mustbe}`
        );
      }
    });
    it('converts string with false in all cases', () => {
      const tests = ['false', 'False', 'FALSE'];
      for (const before of tests) {
        const after = strategies.boolean(before);
        const mustbe = false;
        assert.strictEqual(
          after, mustbe,
          `before: ${before}, after: ${after}, mustbe: ${mustbe}`
        );
      }
    });
    it('fails on converting not a boolean', () => {
      assert.throws(() => {
        const before = 'not a boolean string';
        strategies.boolean(before);
      });
    });
  });
  describe('date', () => {
    it('converts iso datetime string to Date', () => {
      const mustbe = new Date('2022-05-04');
      const before = mustbe.toISOString();
      const after = strategies.date(before);
      assert.ok(after, mustbe);
    });
    it('fails on converting not a date string', () => {
      assert.throws(() => {
        const before = 'not a date string';
        strategies.date(before);
      });
    });
  });
});
