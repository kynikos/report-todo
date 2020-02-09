#!/usr/bin/env node

/* eslint-disable no-sync,no-await-in-loop,no-use-before-define,no-console */
const path = require('path')
const {emptyDirSync, copySync: xCopySync} = require('fs-extra')
const process = require('process')
const {spawnSync} = require('child_process')
const readlineSync = require('readline-sync')
// TODO[setup]: minimist is a simpler alternative to commander.js
const commander = require('commander')
const {
  npmInteractive,
  npxInteractive,
} = require('@kynikos/tasks/subprocess')
const {
  linkDependencies,
  maintainPackageDependencies,
} = require('@kynikos/tasks/dependencies')

commander
  .command('deps')
  .description('run semi-automated dependency maintenance operations')
  .action(() => maintainDependencies())

commander
  .command('lint')
  .description('lint the source code')
  .action(() => lint())

commander
  .command('test [REGEX]')
  .description('run the automated tests; optionally only run tests with a name \
that matches REGEX')
  // eslint-disable-next-line jest/require-top-level-describe,jest/no-disabled-tests,jest/expect-expect,jest/valid-title
  .action((regex) => test(regex))

commander.parse(process.argv)

// TODO[setup]: The @kynikos dependencies should only provide peerDependencies

function maintainDependencies() {
  maintainPackageDependencies(
    __dirname,
    ['@kynikos'],
    true,
  )
}


function lint() {
  // See also the .eslintignore file
  return npxInteractive(['eslint', __dirname])
}


function test(testNameRegex) {
  npxInteractive([
    'jest',
    ...testNameRegex ? ['--testNamePattern', testNameRegex] : [],
  ])
}
