const fs = require('fs')
const path = require('path')
const {reportTodo} = require('../index')


const fixtures = [
  ['empty_file', {
    reportMode: 'generator',
  }],
  ['many_files', {
    reportMode: 'generator',
  }],
  ['no_files', {
    reportMode: 'generator',
  }],
  ['no_todos', {
    reportMode: 'generator',
  }],
  ['one_file', {
    reportMode: 'generator',
  }],
  ['one_todo_multi_line', {
    reportMode: 'generator',
  }],
  ['one_todo_single_line', {
    reportMode: 'generator',
  }],
  ['tags', {
    reportMode: 'generator',
    tags: [
      'FIXME',
      'BUG',
      'NOTE',
      'DoSomething',
      'NB',
      'Yes I\'m a tag too',
      'IMPORtant',
    ],
  }],
  ['caseSensitive_false', {
    reportMode: 'generator',
    caseSensitive: false,
  }],
  ['labelsDelimiters', {
    reportMode: 'generator',
    labelsDelimiters: ['<({', '})>'],
  }],
  ['labelsSeparator', {
    reportMode: 'generator',
    labelsSeparator: ';->',
  }],
  ['labels', {
    reportMode: 'generator',
    labels: ['label1', 'label2'],
    // labelsIsWhitelist:true should be default
  }],
  ['labels_false', {
    reportMode: 'generator',
    labels: false,
    // labelsIsWhitelist:true should be default
  }],
  ['labels_null', {
    reportMode: 'generator',
    labels: ['label1', 'label2', null],
    // labelsIsWhitelist:true should be default
  }],
  ['labelsIsWhitelist_false', {
    reportMode: 'generator',
    labels: ['label1'],
    labelsIsWhitelist: false,
  }],
  ['ignoreLineComment', {
    reportMode: 'generator',
    ignoreLineComment: '/* custom-ignore-comment */',
  }],
  ['start_regexp', {
    reportMode: 'generator',
  }],
  ['indentation', {
    reportMode: 'generator',
  }],
  ['trailing_white_space', {
    reportMode: 'generator',
  }],
]


describe.each(fixtures)('fixture #%# (%s)', (fixtureName, options) => {
  test('reports correctly', async () => {
    expect.assertions(1)

    const todoMatchesChannel = reportTodo(
      `./test/fixtures/${fixtureName}/`,
      options,
    )

    // Multiple files are parsed asynchronously, so the order of the generated
    // matches isn't always going to be the same; for this reason map the
    // results based on the file name, so that it's always possible to compare
    // them deterministically
    const filePathToTodos = {}
    for await (const todoMatch of todoMatchesChannel) {
      let matches = filePathToTodos[todoMatch.filePath]

      // eslint-disable-next-line jest/no-if
      if (matches == null) {
        matches = []
        filePathToTodos[todoMatch.filePath] = matches
      }

      matches.push(todoMatch)
    }

    const sortedMatches = Object.entries(filePathToTodos).sort((a, b) => {
      if (a[0] < b[0]) return -1
      if (a[0] > b[0]) return 1
      return 0
    }).reduce((acc, [, todoMatch]) => acc.concat(todoMatch), [])

    const expectedPath = `./fixtures/${fixtureName}.report.json`

    // eslint-disable-next-line jest/no-if,no-process-env
    if (process.env.JEST_PRINT_RECEIVED_VALUES) {
      // eslint-disable-next-line no-console
      console.debug(JSON.stringify(sortedMatches, null, 2))
    }

    // eslint-disable-next-line jest/no-if,no-process-env
    if (process.env.JEST_UPDATE_EXPECTED_VALUES) {
      // eslint-disable-next-line no-sync
      fs.writeFileSync(
        path.join('./test/', expectedPath),
        // eslint-disable-next-line prefer-template
        JSON.stringify(sortedMatches, null, 2) + '\n',
      )
    }

    // eslint-disable-next-line global-require
    const expected = require(expectedPath)
    expect(sortedMatches).toMatchObject(expected)
  })
})
