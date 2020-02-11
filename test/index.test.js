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
  ['caseSensitive', {
    reportMode: 'generator',
    caseSensitive: false,
  }],
]


describe.each(fixtures)('fixture #%# (%s)', (fixtureName, options) => {
  test('reports correctly', async () => {
    expect.assertions(1)

    const todoMatchesChannel = reportTodo(
      `./test/fixtures/${fixtureName}/`,
      options,
    )

    const todoMatches = []
    for await (const todoMatch of todoMatchesChannel) {
      todoMatches.push(todoMatch)
    }

    // Uncomment this to see the verbatim returned object, for example to
    // update the test report
    // console.debug(JSON.stringify(todoMatches, null, 2))

    // eslint-disable-next-line global-require
    const correctReport = require(`./fixtures/${fixtureName}.report.json`)
    expect(todoMatches).toMatchObject(correctReport)
  })
})
