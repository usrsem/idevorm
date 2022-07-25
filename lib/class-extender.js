'use strict';

module.exports = (cls, extension, name) => {
  const ExtendedClass = class extends cls {};
  if (!name) {
    name = cls.prototype.constructor.name() + 'Extended';
  }
  Object.defineProperty(ExtendedClass, 'name', { value: name });
  Object.assign(ExtendedClass, extension);
  return ExtendedClass;
};
