// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

const _escapeRegExp = require('lodash.escaperegexp')
const globby = require('globby')
const {parseFile} = require('./parseFile')


module.exports.iterateParseFiles = async function iterateParseFiles({
  globs, tags, caseInsensitive, labelsDelimiters, labelsSeparator,
  labels, labelsIsWhitelist, ignoreLineComment, todoMatchesChannel,
}) {
  const regExpFlags = caseInsensitive ? 'ui' : 'u'

  const startMatch = makeStartMatch({
    tags,
    regExpFlags,
    labelsDelimiters,
  })
  const continueMatch = makeContinueMatch(regExpFlags)

  for await (const filePath of globby.stream(globs)) {
    // Don't await parseFile(): it will asynchronously queue values to the
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
      `^(.*?)\\b(${regExpTags})\\b\\s*`,
      // Don't try to implement the label black/whitelist in the regular
      // expression, since that would just make non-matching labels part of the
      // comment text; same goes for ignoreLineComment
      `(${
        _escapeRegExp(labelsDelimiters[0])
      }(.+?)${
        _escapeRegExp(labelsDelimiters[1])
      })?\\s*:?\\s*(.*)`,
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
