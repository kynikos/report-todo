// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE


module.exports.generateMatches = async function *generateMatches(todoMatchesChannel) {
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
