#!/usr/bin/env node

/* eslint-disable no-sync,no-await-in-loop,no-use-before-define,no-console */
const fs = require('fs')
const process = require('process')
const {oneLine: L} = require('common-tags')
const {
  eslint,
} = require('@kynikos/tasks/subprocess')
const {
  linkSelf,
  maintainPackageDependencies,
} = require('@kynikos/tasks/dependencies')
const {jest} = require('@kynikos/tasks/testing')
const {
  writePkgbuildNodeJs,
  makePkgbuild,
  installPkgbuild,
} = require('@kynikos/tasks/packaging')
const {
  releaseProcedure,
  npmPublish,
  submitToAur,
} = require('@kynikos/tasks/releasing')
const {wrapCommander} = require('@kynikos/tasks/commander')
const {makeReadme} = require('./aux/README')
const {reportTodo} = require('./src/index')
const packageJson = require('./package.json')

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
      packageInstallLicense: './LICENSE',
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


function publishToNpm() {
  // Don't recreate the tarball, or its checksum will change
  return npmPublish({
    tarball: `./build/${packageJson.name}-${packageJson.version}.tgz`,
    public: true,
  })
}


function publishToAur() {
  return submitToAur({
    buildDir: './build/',
    pkgbase: packageJson.name,
    pkgver: packageJson.version,
  })
}


function release() {
  releaseProcedure({
    // releaseDependencies,
    // checkoutProductionBranch,
    updateVersion: L`Did you update the version number in package.json?
      Do it manually, don't use npm-version`,
    updateDependencies: () => maintainDependencies(),
    recompileApplication: false,
    runTests: () => runTests({}),
    checkRelatedFunctionality: false,
    lintCode: () => lint(),
    updateTodo: () => todo(),
    updateDatabaseDiagram: false,
    // updateChangelog,
    // updateDocumentation,
    buildDocumentation: () => docs(),
    setupDistributionPackages: () => setupPkg(),
    testBuildDistributionPackages: () => makePkg(),
    testInstallDistributionPackages: () => installPkg(),
    // testInstalledDistributionPackages,
    // commitReleaseChanges,
    deployApplication: false,
    deployOtherServices: false,
    publishDocumentation: false,
    // pushToRemoteGitRepository,
    publishToPackageIndex: () => publishToNpm(),
    publishToSoftwareDistributions: () => publishToAur(),
    // announceRelease,
    // advertiseRelease,
    // restoreDevelopmentEnvironment,
  })
}


const commander = wrapCommander({
  maintainDependencies,
  lint,
  runTests,
  todo,
  docs,
  setupPkg,
  makePkg,
  installPkg,
  publishToNpm,
  publishToAur,
  release,
})

commander.parse(process.argv)
