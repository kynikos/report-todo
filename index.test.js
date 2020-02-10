const {readdirSync} = require('fs')
const {reportTodo} = require('./index')


const fixtureNames = readdirSync('./test/fixtures/', {withFileTypes: true})
  .filter((ent) => ent.isDirectory())
  .map((ent) => ent.name)


describe.each(fixtureNames)('fixture #%# (%s)', (fixtureName) => {
  test('reports correctly', async () => {
    expect.assertions(1)

    const todoMatchesChannel = reportTodo(
      `./test/fixtures/${fixtureName}/`,
      {reportMode: 'channel'},
    )

    const todoMatches = []
    for await (const todoMatch of todoMatchesChannel) {
      todoMatches.push(todoMatch)
    }

    // Uncomment this to see the verbatim returned object, for example to
    // update the test report
    // console.debug(JSON.stringify(todoMatches, null, 2))

    // eslint-disable-next-line global-require
    const correctReport = require(`./test/fixtures/${fixtureName}.report.json`)
    expect(todoMatches).toMatchObject(correctReport)
  })
})
