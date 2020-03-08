// This file is part of report-todo
// Copyright (C) 2019-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/report-todo/blob/master/LICENSE

const {oneLine: L} = require('common-tags')

module.exports = [
  {
    key: 'tags',
    value: ['TODO', 'FIXME', 'BUG'],
    desc: () => 'array of tags to parse',
    cliFlags: '-t, --tags <TAG1,TAG2...>',
    cliDesc: ({value}) => L`comma-separated whitelist of tags to parse;
      default is "${value.join(',')}"`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'labels',
    value: null,
    desc: () => L`whitelist array of labels to include in the results; adding
      \`null\` or an empty string in the array will also include results without
      labels; setting \`labels=false\` will only include results without labels;
      it is enough for a match with multiple labels to have only of them in the
      whitelist to be included in the results
      default is to include all results regardless of their labels`,
    cliFlags: '-l, --labels <LABEL1,LABEL2...>',
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
    desc: () => 'array of two strings that are used to enclose labels',
    cliFlags: '--labels-delimiters <OPEN,CLOSE>',
    cliDesc: ({value}) => L`two comma-separated strings that are used to
      enclose labels; default is ${value.map((del) => `"${del}"`).join(' ')}`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'labelsSeparator',
    value: ',',
    desc: () => 'string to be used to separate labels',
    cliFlags: '--labels-separator <SEP>',
    cliDesc: ({value}) => L`string to be used to separate labels;
      default is "${value}"`,
  },
  {
    key: 'labelsIsBlacklist',
    value: false,
    desc: () => L`treat \`labels\` as a blacklist instead;
      using \`null\` or an empty string in \`labels\` will exclude results
      without labels; it is enough for a match with multiple labels to have only
      of them in the \`labels\` to be excluded from the results; \`labels\` is a
      whitelist by default`,
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
    desc: () => L`parse tags and labels case-insensitively; default
    is to also match letter case`,
    cliFlags: '-i, --case-insensitive',
    cliDesc: (option) => L`parse tags and labels case-insensitively; default
      is to also match letter case`,
  },
  {
    key: 'ignoreLineComment',
    value: 'report-todo-ignore-line',
    desc: () => L`the string to be appended to lines to exclude them
      from the results`,
    cliFlags: '--ignore-line-comment <COMMENT>',
    cliDesc: ({value}) => L`the string to be appended to lines to exclude them
      from the results; default is "${value}"`,
  },
  {
    key: 'reportMode',
    value: 'markdown',
    choices: ['generator', 'object', 'json', 'markdown'],
    cliChoices: ['json', 'markdown'],
    desc: ({choices}) => L`the generated report mode; one of
      ${choices.map((choice) => `"${choice}"`).join(', ')}; "generator" returns
      an asynchronous generator that yields results as they are found (files are
      opened asynchronously, so the order of the results is not guaranteed to
      be the same at every run); "object" returns a grouped and sorted
      JavaScript object; "json" returns a JSON string; "markdown" returns a
      Markdown document`,
    cliFlags: '-m, --report-mode <MODE>',
    cliDesc: ({value, cliChoices}) => L`the generated report mode; one of
      ${cliChoices.map((choice) => `"${choice}"`).join(', ')}; more modes are
      available through the Node.js API; default is "${value}"`,
  },
  {
    key: 'reportGroupBy',
    value: ['labels'],
    choices: ['filePath', 'tag', 'startLineNo', 'lines', 'labels'],
    cliChoices: ['filePath', 'tag', 'startLineNo', 'lines', 'labels'],
    desc: ({choices}) => L`ordered array of keys by which results are grouped
      and (possibly nested) report sections created;
      one or more of ${choices.map((choice) => `"${choice}"`).join(', ')}`,
    cliFlags: '-g, --report-group-by <KEY1,KEY2...>',
    cliDesc: ({value, cliChoices}) => L`comma-separated, ordered list of keys by
      which results are grouped and (possibly nested) report sections created;
      one or more of ${cliChoices.map((choice) => `"${choice}"`).join(', ')};
      default is "${value.join(',')}"`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'reportSortBy',
    value: ['filePath', 'startLineNo'],
    choices: ['filePath', 'tag', 'startLineNo', 'lines', 'labels'],
    cliChoices: ['filePath', 'tag', 'startLineNo', 'lines', 'labels'],
    desc: ({choices}) => L`ordered array of keys by which results are sorted
      within report sections;
      one or more of ${choices.map((choice) => `"${choice}"`).join(', ')}`,
    cliFlags: '-s, --report-sort-by <KEY1,KEY2...>',
    cliDesc: ({value, cliChoices}) => L`comma-separated, ordered list of keys by
      which results are sorted within report sections;
      one or more of ${cliChoices.map((choice) => `"${choice}"`).join(', ')};
      default is "${value.join(',')}"`,
    cliProcess: (value, previous) => value.split(','),
  },
  {
    key: 'reportLinksPrefix',
    value: null,
    desc: () => L`reports that create links to the files will prefix
      their URLs with this string; nothing is prefixed by default`,
    cliFlags: '--report-links-prefix <PREFIX>',
    cliDesc: () => L`reports that create links to the files will prefix
    their URLs with this string; nothing is prefixed by default`,
  },
]
