const fs = require('fs')
const path = require('path')
const {reportTodo} = require('../src/index')


const fixtures = [
  ['empty_file', {}],
  ['many_files', {}],
  ['no_files', {}],
  ['no_todos', {}],
  ['one_file', {}],
  ['one_todo_multi_line', {}],
  ['one_todo_single_line', {}],
  ['tags', {
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
    caseSensitive: false,
  }],
  ['labelsDelimiters', {
    labelsDelimiters: ['<({', '})>'],
  }],
  ['labelsSeparator', {
    labelsSeparator: ';->',
  }],
  ['labels', {
    labels: ['label1', 'label2'],
    // labelsIsWhitelist:true should be default
  }],
  ['labels_false', {
    labels: false,
    // labelsIsWhitelist:true should be default
  }],
  ['labels_null', {
    labels: ['label1', 'label2', null],
    // labelsIsWhitelist:true should be default
  }],
  ['labelsIsWhitelist_false', {
    labels: ['label1'],
    labelsIsWhitelist: false,
  }],
  ['ignoreLineComment', {
    ignoreLineComment: '/* custom-ignore-comment */',
  }],
  ['start_regexp', {}],
  ['indentation', {}],
  ['trailing_white_space', {}],
]

const groupsAndSorts = [
  ['default', {
    // reportGroupBy: ['labels'],
    // reportSortBy: ['filePath', 'startLineNo'],
  }],
  ['group_tag,filePath_sort_labels,startLineNo', {
    reportGroupBy: ['tag', 'filePath'],
    reportSortBy: ['labels', 'startLineNo'],
  }],
  ['group_filePath,labels,tag_sort_startLineNo', {
    reportGroupBy: ['filePath', 'labels', 'tag'],
    reportSortBy: ['startLineNo'],
  }],
]


// eslint-disable-next-line jest/no-hooks
beforeAll(() => {
  for (const [fixtureName] of fixtures) {
    const dir = path.join('./test/expected/', fixtureName)

    // eslint-disable-next-line no-sync
    if (!fs.existsSync(dir)) {
      // eslint-disable-next-line no-sync
      fs.mkdirSync(dir)
    }
  }
})


describe.each(fixtures)('%s (fixture #%#)', (fixtureName, options) => {
  test('generator', async () => {
    expect.assertions(1)

    const todoMatchesChannel = reportTodo(
      `./test/fixtures/${fixtureName}/`,
      {
        reportMode: 'generator',
        ...options,
      },
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

    const expectedPath = `./expected/${fixtureName}/generator.json`

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

  test.each(groupsAndSorts)('object (%s)', async (label, options2) => {
    expect.assertions(1)

    const object = await reportTodo(
      `./test/fixtures/${fixtureName}/`,
      {
        reportMode: 'object',
        ...options,
        ...options2,
      },
    )

    const expectedPath = `./expected/${fixtureName}/object.${label}.json`

    // eslint-disable-next-line jest/no-if,no-process-env
    if (process.env.JEST_PRINT_RECEIVED_VALUES) {
      // eslint-disable-next-line no-console
      console.debug(object)
    }

    // eslint-disable-next-line jest/no-if,no-process-env
    if (process.env.JEST_UPDATE_EXPECTED_VALUES) {
      // eslint-disable-next-line no-sync
      fs.writeFileSync(
        path.join('./test/', expectedPath),
        // eslint-disable-next-line prefer-template
        JSON.stringify(object, null, 2) + '\n',
      )
    }

    // eslint-disable-next-line global-require
    const expected = require(expectedPath)
    expect(object).toMatchObject(expected)
  })

  test.each(groupsAndSorts)('markdown (%s)', async (label, options2) => {
    expect.assertions(1)

    const markdown = await reportTodo(
      `./test/fixtures/${fixtureName}/`,
      {
        reportMode: 'markdown',
        ...options,
        ...options2,
      },
    )

    const expectedPath = `./test/expected/${fixtureName}/markdown.${label}.md`

    // eslint-disable-next-line jest/no-if,no-process-env
    if (process.env.JEST_PRINT_RECEIVED_VALUES) {
      // eslint-disable-next-line no-console
      console.debug(markdown)
    }

    // eslint-disable-next-line jest/no-if,no-process-env
    if (process.env.JEST_UPDATE_EXPECTED_VALUES) {
      // eslint-disable-next-line no-sync
      fs.writeFileSync(
        expectedPath,
        markdown,
      )
    }

    // eslint-disable-next-line no-sync
    const expected = fs.readFileSync(expectedPath)
    expect(markdown).toBe(expected.toString())
  })
})
