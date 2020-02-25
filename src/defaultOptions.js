// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

module.exports = [
  {
    key: 'tags',
    value: ['TODO', 'FIXME', 'BUG'],
  },
  {
    key: 'caseInsensitive',
    value: false,
  },
  {
    key: 'labelsDelimiters',
    value: ['[', ']'],
  },
  {
    key: 'labelsSeparator',
    value: ',',
  },
  {
    key: 'labels',
    value: null,
  },
  {
    key: 'labelsIsBlacklist',
    value: false,
  },
  {
    key: 'ignoreLineComment',
    value: 'report-todo-ignore-line',
  },
  {
    key: 'reportMode',
    value: 'markdown',
  },
  {
    key: 'reportGroupBy',
    value: ['labels'],
  },
  {
    key: 'reportSortBy',
    value: ['filePath', 'startLineNo'],
  },
  {
    key: 'reportOptions',
    value: {
      // Each report mode defines its default options in its function definition
    },
  },
]
