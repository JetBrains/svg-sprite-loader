// const chai = require('chai');

module.exports = () => {
  const config = {
    files: [
      { pattern: 'lib/*.js' },
      { pattern: 'lib/**/*.js' },
      { pattern: 'test/tests-*.js', instrument: false }
    ],

    tests: [
      { pattern: 'test/*.test.js' }
    ],

    testFramework: 'mocha',

    env: {
      type: 'node',
      runner: 'node'  // or full path to any node executable
    },

    setup: (wallaby) => {
      const mocha = wallaby.testFramework;

      mocha.ui('bdd');
      // chai.should();
    }
  };

  return config;
};
