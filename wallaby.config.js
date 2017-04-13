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
      runner: 'node'
    },

    // eslint-disable-next-line no-shadow
    setup: (wallaby) => {
      const mocha = wallaby.testFramework;
      mocha.ui('bdd');
    }
  };

  return config;
};
