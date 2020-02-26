// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE


module.exports.reportJson = function reportJson(todos, reportOptions) {
  const json = JSON.stringify(todos, null, 2)
  console.log(json)
  return json
}
