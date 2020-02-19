// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const {iterateMultilineMatches} =
  require('@kynikos/misc/src/iterateMultilineMatches')


module.exports.parseFile = async function parseFile({
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

  const stream = await readFile(filePath)

  // labelsIsWhitelist XNOR labels.some(...)
  const includeIfNoLabels = labels && labelsIsWhitelist ===
    labels.some((label) => [null, ''].includes(label))

  for (const match of iterateMultilineMatches({
    haystack: stream,
    startMatch,
    continueMatch,
  })) {
    if (!match.lines[0][5].endsWith(ignoreLineComment)) {
      const matchedLabels = match.lines[0][4]
        ? match.lines[0][4].split(labelsSeparator).map((label) => label.trim())
        : []

      let includeMatch

      if (labels == null) {
        includeMatch = true
      } else if (labels === false) {
        includeMatch = matchedLabels.length === 0
      } else if (matchedLabels.length === 0) {
        includeMatch = includeIfNoLabels
      } else {
        // labelsIsWhitelist XNOR matchedLabels.some(...)
        includeMatch = labelsIsWhitelist ===
          matchedLabels.some((matchedLabel) => labels.includes(matchedLabel))
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
