// The shebang is added by webpack's BannerPlugin, otherwise webpack gets
// confused by it
// #! /usr/bin/env node

// TODO[setup]: minimist is a simpler alternative to commander.js
// This requires having run 'npm link' and 'npm link report-todo'
// Some libraries such as commander can't be required directly as normal
// libraries, since technically they get bundled in the report-todo library,
// so they're not available as independent node_modules libraries
const {DEFAULT_OPTIONS, reportTodo, oneLine: L, commander} =
  require('report-todo')

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
  // eslint-disable-next-line function-paren-newline
  .description(
    // eslint-disable-next-line prefer-template
    L`Generate a report of TODO etc. comments parsed under trees of files rooted
      at each GLOB.` +
    '\n\n' +
    L`Multiple GLOB patterns are supported; patterns are
      parsed with globby, which for
      example also supports negative matches, see
      https://github.com/sindresorhus/globby for more information; if GLOBs are
      not specified, the current directory is used as the only root; some
      patterns are also excluded by default, see also the --no-default-excludes
      option.`,
  // eslint-disable-next-line function-paren-newline
  )
  .arguments('[GLOBs...]')

for (const option of DEFAULT_OPTIONS) {
  if (option.cliFlags && option.cliDesc) {
    commander.option(option.cliFlags, option.cliDesc(option), option.cliProcess)
  }
}

commander
  .option('--no-default-excludes', L`do not exclude some patterns by default,
    i.e. only strictly use the GLOBs explicitly
    passed on the command line; the patterns excluded by default are [
    ${DEFAULT_EXCLUDES.join(' ')} ]`)

commander
  .action((globs, options) => main(globs, options))
  .parse(process.argv)


async function main(globs, options) {
  if (!globs.length) globs.push('.')

  if (options.defaultExcludes) {
    globs.push(...DEFAULT_EXCLUDES.map((pattern) => `!${pattern}`))
  }

  // eslint-disable-next-line no-console
  console.log(await reportTodo(
    globs,
    // Don't use 'options' directly, otherwise it will include all the undefined
    // values and break the program
    {...options},
  ))
}
