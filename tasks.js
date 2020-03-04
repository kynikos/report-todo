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
  eslint,
} = require('@kynikos/tasks/subprocess')
const {
  linkSelf,
  linkDependencies,
  maintainPackageDependencies,
} = require('@kynikos/tasks/dependencies')
const {jest} = require('@kynikos/tasks/testing')
const {
  writePkgbuildNodeJs,
  makePkgbuild,
  installPkgbuild,
} = require('@kynikos/tasks/packaging')
const {releaseProcedure} = require('@kynikos/tasks/releasing')
const {makeReadme} = require('./aux/README')
const {reportTodo} = require('./src/index')
const packageJson = require('./package.json')

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

commander
  .command('docs')
  .description('build the documentation')
  .action(() => docs())

commander
  .command('pkg-setup')
  .description('set up the PKGBUILD file')
  .action(() => setupPkg())

commander
  .command('pkg-make')
  .description('make the PKGBUILD file')
  .action(() => makePkg())

commander
  .command('pkg-install')
  .description('install the Pacman tarball')
  .option('--pkgrel <NUMBER>', "set the 'pkgrel' number", 1)
  .action(({pkgrel}) => installPkg({pkgrel}))

commander
  .command('release')
  .description('build and release the application')
  .action(() => release())

commander.parse(process.argv)

// TODO[setup]: The @kynikos dependencies should only provide peerDependencies

function maintainDependencies() {
  maintainPackageDependencies(
    __dirname,
    [/^@kynikos\//u],
    true,
  )
  // Testing the report-todo global script requires having run 'npm link' and
  // 'npm link report-todo'
  linkSelf({cwd: __dirname, ask: true})
}


function lint() {
  // See also the .eslintignore file
  return eslint([__dirname])
}


function runTests({
  testNameRegex,
  verbose,
  printConsole,
  printReceived,
  updateExpected,
}) {
  jest({
    testNamePattern: testNameRegex,
    verbose,
    printConsole,
    printReceived: printReceived ? 'JEST_PRINT_RECEIVED_VALUES' : false,
    updateExpected: updateExpected ? 'JEST_UPDATE_EXPECTED_VALUES' : false,
  })
}


async function todo() {
  fs.writeFileSync(
    './aux/TODO.md',
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


async function docs() {
  return fs.writeFileSync(
    './README.md',
    await makeReadme(),
  )
}


function setupPkg() {
  return writePkgbuildNodeJs(
    {
      pkgbuildPath: './aux/PKGBUILD',
      buildDir: './build/',
    },
    {
      Maintainers: [
        `${packageJson.author.name} <${packageJson.author.email}>`,
      ],
      pkgname: packageJson.name,
      pkgver: packageJson.version,
      pkgrel: 1,
      pkgdesc: packageJson.description,
      url: packageJson.homepage,
      license: [packageJson.license],
    },
  )
}


function makePkg() {
  return makePkgbuild({buildDir: './build/', pkgbuildPath: './aux/PKGBUILD'})
}


function installPkg({pkgrel}) {
  const tarballPath =
    `${packageJson.name}-${packageJson.version}-${pkgrel}-any.pkg.tar.xz`
  return installPkgbuild({buildDir: './build/', tarballPath})
}


function release() {
  releaseProcedure({
    buildDocumentation: () => docs(),
    setupDistributionPackages: () => setupPkg(),
    testBuildDistributionPackages: () => makePkg(),
    testInstallDistributionPackages: () => installPkg(),
  })
}
