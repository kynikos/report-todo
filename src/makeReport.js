// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

const {groupAsyncGeneratorByNested} =
  require('@kynikos/misc/src/groupAsyncGeneratorByNested')
const {reportMarkdown} = require('./reportMarkdown')


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

  switch (reportMode) {
  // case 'generator' is handled in the main function (it doesn't require
  // grouping or sorting)
  case 'markdown':
    return reportMarkdown(groupedMatches, reportOptions)
  default:
    throw new Error(`Unexpected report mode: ${reportMode}`)
  }
}
