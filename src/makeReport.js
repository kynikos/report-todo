// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

const {groupAsyncGeneratorByNested} =
  require('@kynikos/misc/src/groupAsyncGeneratorByNested')
const {sortGroupedMatches} = require('./sortGroupedMatches')
const {reportJson} = require('./reportJson')
const {reportMarkdown} = require('./reportMarkdown')
const {reportObject} = require('./reportObject')


module.exports.makeReport = async function makeReport({
  matchGenerator,
  reportGroupBy,
  reportSortBy,
  reportMode,
  reportOptions,
  labelsSeparator,
}) {
  const groupedMatches = await groupAsyncGeneratorByNested(
    matchGenerator,
    reportGroupBy,
    {
      // Don't use '<NO LABEL>' because the '<' could be mistaken as HTML by
      // some report generators
      emptyArrayReplacement: '[NO LABEL]',
    },
  )

  const groupedSortedMatches = sortGroupedMatches(
    groupedMatches,
    reportGroupBy,
    reportSortBy,
  )

  // TODO: JSON, XML, table (plain text), CSV, MediaWiki, VSCode
  //   See also leasot's modes
  switch (reportMode) {
  // case 'generator' is handled in the main function (it doesn't require
  // grouping or sorting)
  case 'json':
    return reportJson(groupedSortedMatches, reportOptions)
  case 'markdown':
    return reportMarkdown(groupedSortedMatches, reportOptions, labelsSeparator)
  case 'object':
    return reportObject(groupedSortedMatches, reportOptions)
  default:
    throw new Error(`Unexpected report mode: ${reportMode}`)
  }
}
