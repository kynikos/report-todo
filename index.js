// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

const fs = require('fs')
const globby = require('globby')
const {Channel} = require('queueable')
const _escapeRegExp = require('lodash.escaperegexp')
const {iterateMultilineMatches} =
  require('@kynikos/misc/src/iterateMultilineMatches')

// TODO: Support comments with closing tag, e.g.
//  /* some comment */

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

  if (reportMode === 'generator') {
    return generateMatches(todoMatchesChannel)
  }

  const groupedMatches = reportGroupBy && reportSortBy && todoMatchesChannel

  switch (reportMode) {
  // case 'generator' is handled above (doesn't require grouping or sorting)
  case 'markdown':
    return reportMarkdown(groupedMatches, reportOptions)
  default:
    throw new Error(`Unexpected report mode: ${reportMode}`)
  }
}


function makeStartMatch({
  tags,
  regExpFlags,
  labelsDelimiters,
}) {
  const regExpTags = tags.map((tag) => _escapeRegExp(tag)).join('|')

  const startRegExp = new RegExp(
    // Trailing whitespace is meaningful in Markdown, so preserve it in the
    // matched line
    [
      `^(.*?)\\b@?(${regExpTags})\\b\\s*`,
      // Don't try to implement the label black/whitelist in the regular
      // expression, since that would just make non-matching labels part of the
      // comment text; same goes for ignoreLineComment
      `(\\${labelsDelimiters[0]}(.+?)\\${labelsDelimiters[1]})?\\s*`,
      ':?\\s*(.*)',
    ].join(''),
    regExpFlags,
  )

  return (line) => {
    const match = startRegExp.exec(line)
    let continueRegExp = null

    if (match) {
      continueRegExp = new RegExp(
        // Trailing whitespace is meaningful in Markdown, so preserve it in the
        // matched line
        `^${_escapeRegExp(match[1])}((()))(\\s+)(.*)`,
        regExpFlags,
      )
    }

    return [match, continueRegExp]
  }
}


function makeContinueMatch(regExpFlags) {
  return (continueRegExp, currentMatch, line) => {
    const match = continueRegExp.exec(line)
    let continueRegExp2 = null

    if (match) {
      continueRegExp2 = currentMatch.lines.length > 1
        ? continueRegExp
        : new RegExp(
          // If this is the second matched line, determine the fixed (minimum)
          // indentation here and change continueRegExp
          // Trailing whitespace is meaningful in Markdown, so preserve it in
          // the matched line
          `^${_escapeRegExp(currentMatch.lines[0][1])}(((())))${
            _escapeRegExp(match[4])}(.*)`,
          regExpFlags,
        )
    }

    return [match, continueRegExp2]
  }
}


async function iterateParseFiles({
  globs, tags, caseSensitive, labelsDelimiters, labelsSeparator,
  labels, labelsIsWhitelist, ignoreLineComment, todoMatchesChannel,
}) {
  const regExpFlags = caseSensitive ? 'u' : 'ui'

  const startMatch = makeStartMatch({
    tags,
    regExpFlags,
    labelsDelimiters,
  })
  const continueMatch = makeContinueMatch(regExpFlags)

  for await (const filePath of globby.stream(globs)) {
    // Don't await parseFile() even if using fs.readFile() instead of
    // fs.readFileSync(): it will asynchronously push values to the
    // channel, which can then be asynchronously iterated
    parseFile({
      startMatch,
      continueMatch,
      labelsSeparator,
      labels,
      labelsIsWhitelist,
      ignoreLineComment,
      todoMatchesChannel,
      filePath,
    })
  }

  todoMatchesChannel.push('all-files-started-parsing')
}


function parseFile({
  startMatch,
  continueMatch,
  labelsSeparator,
  labels,
  labelsIsWhitelist,
  ignoreLineComment,
  todoMatchesChannel,
  filePath,
}) {
  todoMatchesChannel.push('started-parsing-file')

  // No need to use fs.readFile(), since the function calling this one
  // (iterateParseFiles()) is called asynchronously (and not awaited)
  // eslint-disable-next-line no-sync
  const stream = fs.readFileSync(filePath)

  for (const match of iterateMultilineMatches({
    haystack: stream,
    startMatch,
    continueMatch,
  })) {
    if (!match.lines[0][5].endsWith(ignoreLineComment)) {
      const matchedLabels = match.lines[0][4]
        ? match.lines[0][4].split(labelsSeparator)
        : []

      let includeMatch

      if (labels == null) {
        includeMatch = true
      } else if (matchedLabels.length === 0) {
        includeMatch =
          labels === false ||
          // labelsIsWhitelist XNOR labels.some(...)
          labelsIsWhitelist ===
            labels.some((label) => [null, ''].includes(label))
      } else {
        // labelsIsWhitelist XNOR matchedLabels.some(...)
        includeMatch = labelsIsWhitelist ===
          matchedLabels.some((matchedLabel) => labels.include(matchedLabel))
      }

      if (includeMatch) {
        todoMatchesChannel.push({
          filePath,
          tag: match.lines[0][2],
          startLineNo: match.startLineNo,
          lines: match.lines.map((line) => line[5]),
          labels: matchedLabels,
        })
      }
    }
  }

  todoMatchesChannel.push('finished-parsing-file')
}


async function *generateMatches(todoMatchesChannel) {
  let allFilesStartedParsing = false
  let filesToParse = 0

  for await (const todoMatch of todoMatchesChannel) {
    if (todoMatch.filePath == null) {
      switch (todoMatch) {
      case 'started-parsing-file':
        filesToParse++
        break
      case 'finished-parsing-file':
        filesToParse--
        break
      case 'all-files-started-parsing':
        allFilesStartedParsing = true
        break
      default:
        throw new Error('Unknown event')
      }
      // Don't put this test inside the 'finished-parsing-file' case because it
      // would never be reached if no files to parse were found
      if (filesToParse <= 0 && allFilesStartedParsing) {
        break
      }
    } else {
      yield todoMatch
    }
  }
}


async function reportMarkdown(groupedMatches, reportOptions) {
  for await (const match of groupedMatches) {
    //match.lines.join('<br>')
    console.log(match)
  }
}
