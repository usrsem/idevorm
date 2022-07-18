'use strict';

module.exports = {
  integer: (value) => {
    const res = Number(value);
    if (!Number.isInteger(res)) throw new Error(
      `Integer expected, got ${value}`);
    return res;
  },

  string: (value) => value,

  boolean: (value) => {
    const lowercased = value.toLowerCase();
    if (lowercased === 'true') return true;
    if (lowercased === 'false') return false;
    throw new Error(`Expected boolean string got ${value}`);
  },

  date: (value) => {
    const res = new Date(value);
    if (isNaN(res.getDate())) throw new Error(
      `Expected date sting got ${value}`);
    return res;
  },
};
