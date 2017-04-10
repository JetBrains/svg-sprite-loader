const chai = require('chai');

module.exports = () => {
  const config = {
    files: [
      'lib/**/*.js'
    ],

    tests: [
      'test/*.test.js'
    ],

    testFramework: 'mocha',

    env: {
      type: 'node',
      runner: 'node'  // or full path to any node executable
    },

    setup: (wallaby) => {
      const mocha = wallaby.testFramework;

      mocha.ui('bdd');
      chai.should();
    }
  };

  return config;
};
