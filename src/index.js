// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

// TODO: Start using ES6 module imports when they're no longer experimental
//   in Node.js
const {Channel} = require('queueable')
const {iterateParseFiles} = require('./iterateParseFiles')
const {generateMatches} = require('./generateMatches')
const {makeReport} = require('./makeReport')
const DEFAULT_OPTIONS = require('./defaultOptions')
// The report-todo script needs to import the default options from this module
module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS

// These exports are required by the bin script, which can't require them
// directly, since technically they get bundled in the report-todo library,
// they're not available as independent node_modules libraries
// TODO: Make a Babel plugin to pre-process all oneLine strings at compile time
//   (turn them all into normal strings, properly dedented)
module.exports.oneLine = require('common-tags').oneLine
module.exports.commander = require('commander')

// TODO: NPM recommends also specifying 'engines' in package.json
//   https://docs.npmjs.com/using-npm/developers.html
// TODO: Use a configuration file to sort sections in an arbitrary order
// TODO: Support comments with closing tag, e.g.
//  /* some comment */
// TODO: See also https://pgilad.github.io/leasot/
//       Adapt this as a plugin? Note that it also supports custom parsers
// TODO: How cool would it be if the whole thing could be integrated with
//   GitHub's issue tracker etc.

// TODO: Document that this is using globby, so for example also negated
//   patterns are supported
module.exports.reportTodo = function reportTodo(globs, options = {}) {
  const {
    tags,
    caseInsensitive,
    labelsDelimiters,
    labelsSeparator,
    labels,
    labelsIsBlacklist,
    ignoreLineComment,
    reportMode,
    reportGroupBy,
    reportSortBy,
    reportLinksPrefix,
  } = {
    ...DEFAULT_OPTIONS.reduce((acc, {key, value}) => {
      acc[key] = value
      return acc
    }, {}),
    ...options,
  }

  const todoMatchesChannel = new Channel()

  // Don't await iterateParseFiles(): it will asynchronously push values to the
  // channel, which can then be asynchronously iterated
  // Don't try to filter by tag or label at report time, do it directly at parse
  // time
  iterateParseFiles({
    globs,
    tags,
    caseInsensitive,
    labelsDelimiters,
    labelsSeparator,
    labels,
    labelsIsBlacklist,
    ignoreLineComment,
    todoMatchesChannel,
  })

  const matchGenerator = generateMatches(todoMatchesChannel)

  if (reportMode === 'generator') {
    return matchGenerator
  }

  return makeReport({
    matchGenerator,
    reportGroupBy,
    reportSortBy,
    reportMode,
    reportLinksPrefix,
    labelsSeparator,
  })
}
