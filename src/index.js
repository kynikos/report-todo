// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

const {Channel} = require('queueable')
const {iterateParseFiles} = require('./iterateParseFiles')
const {generateMatches} = require('./generateMatches')
const {makeReport} = require('./makeReport')

// TODO: Use a configuration file to sort sections in an arbitrary order
// TODO: Support comments with closing tag, e.g.
//  /* some comment */
// TODO: How cool would it be if the whole thing could be integrated with
//   GitHub's issue tracker etc.

const DEFAULT_OPTIONS = {
  tags: ['TODO', 'FIXME', 'BUG'],
  caseSensitive: true,
  labelsDelimiters: ['[', ']'],
  labelsSeparator: ',',
  labels: null,
  labelsIsWhitelist: true,
  ignoreLineComment: 'report-todo-ignore-line',
  reportMode: 'markdown',
  reportGroupBy: ['labels'],
  reportSortBy: ['filePath', 'startLineNo'],
  reportOptions: {
    // Each report mode defines its default options in its function definition
  },
}


// TODO: Document that this is using globby, so for example also negated
//   patterns are supported
// TODO: See also https://pgilad.github.io/leasot/
//       Adapt this as a plugin? Note that it also supports custom parsers
module.exports.reportTodo = function reportTodo(globs, options = {}) {
  const {
    tags,
    caseSensitive,
    labelsDelimiters,
    labelsSeparator,
    labels,
    labelsIsWhitelist,
    ignoreLineComment,
    reportMode,
    reportGroupBy,
    reportSortBy,
    reportOptions,
  } = {...DEFAULT_OPTIONS, ...options}

  const todoMatchesChannel = new Channel()

  // Don't await iterateParseFiles(): it will asynchronously push values to the
  // channel, which can then be asynchronously iterated
  // Don't try to filter by tag or label at report time, do it directly at parse
  // time
  iterateParseFiles({
    globs,
    tags,
    caseSensitive,
    labelsDelimiters,
    labelsSeparator,
    labels,
    labelsIsWhitelist,
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
    reportOptions,
    labelsSeparator,
  })
}
