#!/usr/bin/env node

/* eslint-disable no-sync,no-await-in-loop,no-use-before-define,no-console */
const fs = require('fs')
const process = require('process')
const {oneLine: L} = require('common-tags')
const {
  eslint,
  webpackInteractive,
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
const {reportTodo: reportTodoSrc} = require('./src/index')
const packageJson = require('./package.json')

// TODO[setup]: The @kynikos dependencies should only provide peerDependencies


function init() {
  // Technically also 'npm install' is required, but this very script can't be
  // executed until that command is run a first time directly in the console
  linkSelf({cwd: __dirname, ask: false})
}


function maintainDependencies() {
  maintainPackageDependencies(
    __dirname,
    [/^@kynikos\//u],
    true,
  )
  // The report-todo bin script requires (at least for testing) this very
  // library to be npm-linked
  // Having run the 'init' task should be enough
  linkSelf({cwd: __dirname, ask: true})
}


function lint() {
  // See also the .eslintignore file
  return eslint([__dirname])
}


function build({production}) {
  return webpackInteractive([production ? '--env.production' : '--env'])
}


function runTests({
  // TODO[setup]: Optionally require the compiled library from dist/ to test it
  //   Especially do it when testing a release
  testNameRegex,
  verbose,
  printConsole,
  printReceived,
  updateExpected,
}) {
  // The report-todo bin script requires (at least for testing) this very
  // library to be npm-linked
  // Having run the 'init' task should be enough
  // linkSelf({cwd: __dirname, ask: true})

  jest({
    testNamePattern: testNameRegex,
    verbose,
    printConsole,
    printReceived: printReceived ? 'JEST_PRINT_RECEIVED_VALUES' : false,
    updateExpected: updateExpected ? 'JEST_UPDATE_EXPECTED_VALUES' : false,
  })
}


async function todo({labelOnly}) {
  fs.writeFileSync(
    './TODO.md', // report-todo-ignore-line
    await reportTodoSrc(
      [
        '.',
        '!./.git',
        '!./aux/DEMO.js',
        '!./build',
        '!./dist',
        '!./node_modules',
        '!./README.md',
        '!./test/expected',
        '!./test/fixtures',
        '!./TODO.md', // report-todo-ignore-line
      ],
      {
        labels: labelOnly ? [null] : null,
        labelsIsBlacklist: Boolean(labelOnly),
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
    // updateMetafiles,
    // checkNodeJsWebpackConfiguration,
    // releaseDependencies,
    // checkoutProductionBranch,
    updateVersion: L`Did you update the version number in package.json?
      Do it manually, don't use npm-version`,
    updateDependencies: () => maintainDependencies(),
    recompileApplication: () => build({production: true}),
    // TODO[setup]: Require the compiled library from dist/ to test it when
    //   testing a release
    runTests: () => runTests({}),
    checkRelatedFunctionality: false,
    lintCode: () => lint(),
    updateTodo: () => todo({}),
    updateDatabaseDiagram: false,
    // updateChangelog,
    // updateDocumentation,
    buildDocumentation: () => docs(),
    setupDistributionPackages: () => setupPkg(),
    // TODO[setup]: Create a separate package with normal package.json
    //   dependencies installed in node_modules
    //   For example restore the normal separation between 'dependencies' and
    //   'devDependencies' in package.json, but, when building the
    //   compiled/bundled version, temporarily merge 'dependencies' into
    //   'devDependencies'
    testBuildDistributionPackages: () => makePkg(),
    // TODO[setup]: Allow changing pkgrel
    testInstallDistributionPackages: () => installPkg({pkgrel: 1}),
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
  init,
  maintainDependencies,
  lint,
  build,
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
