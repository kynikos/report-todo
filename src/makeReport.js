// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

const {groupAsyncGeneratorByNested} =
  require('@kynikos/misc/src/groupAsyncGeneratorByNested')
const {sortGroupedMatches} = require('./sortGroupedMatches')
const {reportMarkdown} = require('./reportMarkdown')
const {reportObject} = require('./reportObject')


module.exports.makeReport = async function makeReport({
  matchGenerator,
  reportGroupBy,
  reportSortBy,
  reportMode,
  reportOptions,
}) {
  const groupedMatches = await groupAsyncGeneratorByNested(
    matchGenerator,
    reportGroupBy,
    {
      emptyArrayReplacement: '',
    },
  )

  const groupedSortedMatches = sortGroupedMatches(
    groupedMatches,
    reportGroupBy,
    reportSortBy,
  )

  switch (reportMode) {
  // case 'generator' is handled in the main function (it doesn't require
  // grouping or sorting)
  case 'markdown':
    return reportMarkdown(groupedSortedMatches, reportOptions)
  case 'object':
    return reportObject(groupedSortedMatches, reportOptions)
  default:
    throw new Error(`Unexpected report mode: ${reportMode}`)
  }
}
