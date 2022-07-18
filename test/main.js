'use strict';

const { describe } = require('mocha');
const { readdirSync } = require('fs');

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);

const loadTestModules = (dirPath) =>
  readdirSync(dirPath)
    .map((file) => require(`${dirPath}/${file}`));

const runTests = (path) => {
  const dirNames = getDirectories(path);

  if (dirNames.length > 0) {
    for (const dirName of dirNames) {
      console.log('dirName', dirName);
      const dirPath = `${path}/${dirName}`;
      const run = () => loadTestModules(dirPath)
        .forEach((module) => module());
      describe(dirName, run);
    }
  } else {
    loadTestModules(path).forEach((module) => module());
  }
};

const unitTestsPath = `${__dirname}/unit/`;
console.log(unitTestsPath);

describe('Unit', () => runTests(unitTestsPath));
