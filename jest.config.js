/* eslint-env node */
/* eslint-disable no-sync,no-await-in-loop,no-process-env */

// https://jestjs.io/docs/en/configuration.html

module.exports = {
  bail: 1,
  clearMocks: true,
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    // Keep in sync with Webpack's resolve.alias
    // Keep modules that require to be transpiled with babel-just in sync with
    // Webpack's Babel configuration (if applicable)
  },
  testRegex: [
    '\\.test\\.js$',
  ],
}
