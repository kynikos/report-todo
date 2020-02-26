// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

const {oneLine: L} = require('common-tags')

module.exports = [
  {
    key: 'tags',
    value: ['TODO', 'FIXME', 'BUG'],
    cliFlags: '-t, --tags <TAG1,TAG2...>',
    cliDesc: ({value}) => L`comma-separated whitelist of tags to parse
      (default: "${value.join(',')}")`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'labels',
    value: null,
    cliFlags: '-l, --labels <LABEL1,LABEL2...>',
    cliDesc: (option) => L`comma-separated whitelist of labels to include in the
      results (default is to include all results regardless of their labels)`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'labelsDelimiters',
    value: ['[', ']'],
    cliFlags: '--labels-delimiters <OPEN,CLOSE>',
    cliDesc: ({value}) => L`two comma-separated strings that are used to
      enclose labels (default: ${value.map((del) => `"${del}"`).join(' ')})`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'labelsSeparator',
    value: ',',
    cliFlags: '--labels-separator <SEP>',
    cliDesc: ({value}) => L`string to be used to separate labels
      (default: "${value}")`,
  },
  {
    key: 'labelsIsBlacklist',
    value: false,
    cliFlags: '-b, --labels-is-blacklist',
    cliDesc: (option) => L`treat --labels as a blacklist instead (it is a
      whitelist by default)`,
  },
  {
    key: 'caseInsensitive',
    value: false,
    cliFlags: '-i, --case-insensitive',
    cliDesc: (option) => L`parse tags and labels case-insensitively (default
      is to also match letter case)`,
  },
  {
    key: 'ignoreLineComment',
    value: 'report-todo-ignore-line',
    cliFlags: '--ignore-line-comment <COMMENT>',
    cliDesc: ({value}) => L`the string to be appended to lines to exclude them
      from the results (default: "${value}")`,
  },
  {
    key: 'reportMode',
    value: 'markdown',
    choices: ['json', 'markdown'],
    cliFlags: '-m, --report-mode <MODE>',
    cliDesc: ({value, choices}) => L`the generated report mode; one of
      ${choices.map((choice) => `"${choice}"`).join(', ')}; more modes are
      available through the Node API; (default: "${value}")`,
  },
  {
    key: 'reportGroupBy',
    value: ['labels'],
    cliFlags: '-g, --report-group-by <KEY1,KEY2...>',
    choices: ['filePath', 'tag', 'startLineNo', 'lines', 'labels'],
    cliDesc: ({value, choices}) => L`comma-separated, ordered list of keys by
      which results are grouped and (possibly nested) report sections created;
      one or more of ${choices.map((choice) => `"${choice}"`).join(', ')}
      (default: "${value.join(',')}")`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'reportSortBy',
    value: ['filePath', 'startLineNo'],
    cliFlags: '-s, --report-sort-by <KEY1,KEY2...>',
    choices: ['filePath', 'tag', 'startLineNo', 'lines', 'labels'],
    cliDesc: ({value, choices}) => L`comma-separated, ordered list of keys by
      which results are sorted within report sections;
      one or more of ${choices.map((choice) => `"${choice}"`).join(', ')}
      (default: "${value.join(',')}")`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'reportOptions',
    value: {
      // Each report mode defines its default options in its function definition
    },
    // cliFlags: '--report-options',
    // cliDesc: (option) => L``,
  },
]
