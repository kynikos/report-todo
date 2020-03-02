module.exports.fixtures = [
  ['empty_file', {}, []],
  ['many_files', {}, []],
  ['no_files', {}, []],
  ['no_todos', {}, []],
  ['one_file', {}, []],
  ['one_todo_multi_line', {}, []],
  ['one_todo_single_line', {}, []],
  [
    'tags',
    {
      tags: [
        'FIXME',
        'BUG',
        'NOTE',
        'DoSomething',
        'NB',
        'Yes I\'m a tag too',
        'IMPORtant',
      ],
    },
    [
      '--tags',
      'FIXME,BUG,NOTE,DoSomething,NB,Yes I\'m a tag too,IMPORtant',
    ],
  ],
  [
    'caseInsensitive_true',
    {
      caseInsensitive: true,
    },
    [
      '--case-insensitive',
    ],
  ],
  [
    'labelsDelimiters',
    {
      labelsDelimiters: ['<({', '})>'],
    },
    [
      '--labels-delimiters',
      '<({,})>',
    ],
  ],
  [
    'labelsSeparator',
    {
      labelsSeparator: ';->',
    },
    [
      '--labels-separator',
      ';->',
    ],
  ],
  [
    'labels',
    {
      labels: ['label1', 'label2'],
      // labelsIsBlacklist:false should be default
    },
    [
      '--labels',
      'label1,label2',
    ],
  ],
  [
    'labels_false',
    {
      labels: false,
      // labelsIsBlacklist:false should be default
    },
    [
      '--labels',
      '',
    ],
  ],
  [
    'labels_null',
    {
      labels: ['label1', 'label2', null],
      // labelsIsBlacklist:false should be default
    },
    [
      '--labels',
      'label1,label2,',
    ],
  ],
  [
    'labelsIsBlacklist_true',
    {
      labels: ['label1'],
      labelsIsBlacklist: true,
    },
    [
      '--labels',
      'label1',
      '--labels-is-blacklist',
    ],
  ],
  [
    'ignoreLineComment',
    {
      ignoreLineComment: '/* custom-ignore-comment */',
    },
    [
      '--ignore-line-comment',
      '/* custom-ignore-comment */',
    ],
  ],
  ['start_regexp', {}, []],
  ['indentation', {}, []],
  ['trailing_white_space', {}, []],
]
