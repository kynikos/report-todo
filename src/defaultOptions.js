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
    cliDesc: ({value}) => L`comma-separated whitelist of tags to parse;
      default is "${value.join(',')}"`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'labels',
    value: null,
    cliFlags: '-l, --labels <LABEL1,LABEL2...>',
    // TODO: Document that the Node API supports more values for 'label'
    //   e.g. null (both for the whole option or within the labels) and false
    cliDesc: (option) => L`comma-separated whitelist of labels to include in the
      results; using an empty string in the list will also include results
      without labels; it is enough for a match with multiple labels to have only
      of them in the whitelist to be included in the results;
      default is to include all results regardless of their labels`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'labelsDelimiters',
    value: ['[', ']'],
    cliFlags: '--labels-delimiters <OPEN,CLOSE>',
    cliDesc: ({value}) => L`two comma-separated strings that are used to
      enclose labels; default is ${value.map((del) => `"${del}"`).join(' ')}`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'labelsSeparator',
    value: ',',
    cliFlags: '--labels-separator <SEP>',
    cliDesc: ({value}) => L`string to be used to separate labels;
      default is "${value}"`,
  },
  {
    key: 'labelsIsBlacklist',
    value: false,
    cliFlags: '-b, --labels-is-blacklist',
    cliDesc: (option) => L`treat --labels as a blacklist instead;
      using an empty string in --labels will exclude results without labels;
      it is enough for a match with multiple labels to have only of
      them in the --labels to be excluded from the results;
      --labels is a whitelist by default`,
  },
  {
    key: 'caseInsensitive',
    value: false,
    cliFlags: '-i, --case-insensitive',
    cliDesc: (option) => L`parse tags and labels case-insensitively; default
      is to also match letter case`,
  },
  {
    key: 'ignoreLineComment',
    value: 'report-todo-ignore-line',
    cliFlags: '--ignore-line-comment <COMMENT>',
    cliDesc: ({value}) => L`the string to be appended to lines to exclude them
      from the results; default is "${value}"`,
  },
  {
    key: 'reportMode',
    value: 'markdown',
    // TODO: Document that the Node API supports more report modes
    choices: ['json', 'markdown'],
    cliFlags: '-m, --report-mode <MODE>',
    cliDesc: ({value, choices}) => L`the generated report mode; one of
      ${choices.map((choice) => `"${choice}"`).join(', ')}; more modes are
      available through the Node API; default is "${value}"`,
  },
  {
    key: 'reportGroupBy',
    value: ['labels'],
    cliFlags: '-g, --report-group-by <KEY1,KEY2...>',
    choices: ['filePath', 'tag', 'startLineNo', 'lines', 'labels'],
    cliDesc: ({value, choices}) => L`comma-separated, ordered list of keys by
      which results are grouped and (possibly nested) report sections created;
      one or more of ${choices.map((choice) => `"${choice}"`).join(', ')};
      default is "${value.join(',')}"`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'reportSortBy',
    value: ['filePath', 'startLineNo'],
    cliFlags: '-s, --report-sort-by <KEY1,KEY2...>',
    choices: ['filePath', 'tag', 'startLineNo', 'lines', 'labels'],
    cliDesc: ({value, choices}) => L`comma-separated, ordered list of keys by
      which results are sorted within report sections;
      one or more of ${choices.map((choice) => `"${choice}"`).join(', ')};
      default is "${value.join(',')}"`,
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
