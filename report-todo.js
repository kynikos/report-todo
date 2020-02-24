#! /usr/bin/env node

// This requires having run 'npm link' and 'npm link report-todo'
const {reportTodo} = require('report-todo')
// TODO[setup]: minimist is a simpler alternative to commander.js
const commander = require('commander')

const DEFAULT_EXCLUDES = [
  // Inspiration for exclude defaults:
  // https://docs.npmjs.com/using-npm/developers.html#keeping-files-out-of-your-package
  'CVS/',
  '.git/',
  '.hg/',
  'node_modules/',
  '.svn/',
  '*.log',
  '*.swp',
]

commander
  .description('parse trees of files and generate a report of TODO etc. ' +
    'comments')
  .arguments('[globs...]')
  .option('--no-default-excludes', 'do not exclude some patterns such as ' +
    '\'.git\' by default, i.e. only strictly use the \'globs\' explicitly ' +
    'passed on the command line; use --print-default-excludes to print a list' +
    'of the patterns excluded by default')
  .option('--print-default-excludes', 'print a list of the patterns excluded ' +
    'by default; use --no-default-excludes to reset the patterns')
  .action((globs, options) => main({globs, ...options}))

commander.parse(process.argv)


function main({globs, defaultExcludes, printDefaultExcludes}) {
  if (printDefaultExcludes) {
    for (const pattern of DEFAULT_EXCLUDES) {
      console.log(pattern)
    }
    return
  }

  if (!globs.length) globs.push('.')

  if (defaultExcludes) {
    globs.push(...DEFAULT_EXCLUDES.map((pattern) => `!${pattern}`))
  }

  reportTodo(
    globs,
  )
}
