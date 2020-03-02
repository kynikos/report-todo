#!/usr/bin/env node

/* eslint-disable no-sync,no-await-in-loop,no-use-before-define,no-console */
const path = require('path')
const fs = require('fs')
const {emptyDirSync, copySync: xCopySync} = require('fs-extra')
const process = require('process')
const {spawnSync} = require('child_process')
const readlineSync = require('readline-sync')
const {oneLine: L} = require('common-tags')
// TODO[setup]: minimist is a simpler alternative to commander.js
const commander = require('commander')
const {
  npmInteractive,
  npxInteractive,
} = require('@kynikos/tasks/subprocess')
const {
  linkSelf,
  linkDependencies,
  maintainPackageDependencies,
} = require('@kynikos/tasks/dependencies')
const {reportTodo} = require('./src/index')

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
  .description(L`run the automated tests; optionally only run tests with a name
    that matches REGEX`)
  .option('-v, --verbose', 'display all individual test results')
  .option('-c, --print-console', 'let tests print messages through the console')
  .option('-p, --print-received', L`print received test values for debugging
    or updating the expected values after changing the tests (it implies
    --print-console)`)
  .option('-u, --update-expected', L`overwrite the expected test files with the
    received values, useful after changing the tests`)
  // eslint-disable-next-line jest/require-top-level-describe,jest/no-disabled-tests,jest/expect-expect,jest/valid-title
  .action((regex, {verbose, printConsole, printReceived, updateExpected}) => {
    runTests({
      testNameRegex: regex,
      verbose,
      printConsole,
      printReceived,
      updateExpected,
    })
  })

commander
  .command('todo')
  .description('generate a todo-report for this very program')
  .action(() => todo())

commander.parse(process.argv)

// TODO[setup]: The @kynikos dependencies should only provide peerDependencies

function maintainDependencies() {
  maintainPackageDependencies(
    __dirname,
    ['@kynikos'],
    true,
  )
  // Testing the report-todo global script requires having run 'npm link' and
  // 'npm link report-todo'
  linkSelf({cwd: __dirname, ask: true})
}


function lint() {
  // See also the .eslintignore file
  return npxInteractive(['eslint', __dirname])
}


function runTests({
  testNameRegex,
  verbose,
  printConsole,
  printReceived,
  updateExpected,
}) {
  if (printReceived) {
    // eslint-disable-next-line no-process-env
    process.env.JEST_PRINT_RECEIVED_VALUES = 'true'
  }
  if (updateExpected) {
    // eslint-disable-next-line no-process-env
    process.env.JEST_UPDATE_EXPECTED_VALUES = 'true'
  }

  const args = [
    'jest',
    `--silent=${printConsole || printReceived ? 'false' : 'true'}`,
  ]

  if (verbose) args.push('--verbose')
  if (testNameRegex) args.push('--testNamePattern', testNameRegex)

  npxInteractive(args)
}


async function todo() {
  fs.writeFileSync(
    './TODO.md',
    await reportTodo(
      [
        '.',
        '!./node_modules',
        '!./test',
      ],
      {
        reportMode: 'markdown',
      },
    ),
  )
}
