/* eslint-env node */
/* eslint-disable no-sync,no-await-in-loop,no-process-env */
const path = require('path')

// https://jestjs.io/docs/en/configuration.html

module.exports = {
  bail: 1,
  clearMocks: true,
  coverageDirectory: 'coverage',
  testRegex: [
    '\\.test\\.js$',
  ],
}
