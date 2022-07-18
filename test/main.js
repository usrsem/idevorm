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

  for (const dirName of dirNames) {
    const dirPath = `${path}/${dirName}`;
    const run = () => loadTestModules(dirPath)
      .forEach((module) => module());
    describe(dirName, run);
  }
};

const unitTestsPath = `${__dirname}/unit/`;

describe('Unit', () => runTests(unitTestsPath));
