const {oneLine: L} = require('common-tags')
const defaultOptions = require('../src/defaultOptions')
const {reportTodo} = require('../src/index')


module.exports.makeReadme = async function makeReadme() {
  return `\
# report-todo

Generate reports of TODO, FIXME, BUG etc. comments across trees of text files.

## Features:

* Easy setup, as \`report-todo\` does not try to understand the grammar of the
  used programming languages and detect comments, but it simply searches for
  the configured tags naively, i.e. without regard for the used programming
  language, and tries to detect the respective comments by looking at how lines
  start
* Support for multiline comments
* Support for comment labels/tags
* The Markdown report provides links to the files and lines where the comments
  are found, giving a quick way to open them when using code editors that can
  preview Markdown documents, for example Vim or Visual Studio Code
* Both CLI command and Node.js API
* Highly configurable

------------

## Quick installation and usage

    $ npm install -g report-todo
    $ report-todo my/project/directory/

### ...but I don't want to install it system-wide!

    $ cd my/project/directory/
    $ npm install report-todo
    $ npx report-todo

### I use Arch Linux, can I use pacman?

Install the [report-todo](https://aur.archlinux.org/packages/report-todo)
package with your favorite
[AUR helper](https://wiki.archlinux.org/index.php/AUR_helpers).

Otherwise follow the
[manual instructions](https://wiki.archlinux.org/index.php/Arch_User_Repository#Installing_packages).

Then just run the \`report-todo\` command.

### I want JSON, not Markdown

    $ report-todo -m json

------------

## Report examples

These are based on
[src/DEMO.js](https://github.com/kynikos/report-todo/blob/master/aux/DEMO.js).

### Markdown

    $ report-todo aux/DEMO.js -m markdown

\`\`\`
${
  await reportTodo(
    [
      './aux/DEMO.js',
    ],
    {
      reportMode: 'markdown',
    },
  )
}
\`\`\`

### JSON

$ report-todo aux/DEMO.js -m json

\`\`\`
${
  await reportTodo(
    [
      './aux/DEMO.js',
    ],
    {
      reportMode: 'json',
    },
  )
}
\`\`\`

------------

## Command-line usage

Running the command without arguments will parse the files in and under the
current working directory:

    $ report-todo

The above command is equivalent to:

    $ report-todo ./

Pass multiple arguments to parse files under various patterns. Patterns are
processed with [globby](https://github.com/sindresorhus/globby), which for
example also supports negative (exclude) matches by prefixing them with an
exclamation mark. Some patterns are also excluded by default, see also the
\`--no-default-excludes\` option. For Example:

    $ report-todo ./src ./docs !./test

Use the \`--help\` option to print a quick usage guide and a list of all the
available CLI options:

    $ report-todo --help

Or, if locally installed in a directory:

    $ npx report-todo --help

### Options

| Flag | Description |
|------|-------------|
${
  defaultOptions.reduce((acc, option) => {
    if (option.cliFlags && option.cliDesc) {
      return acc.concat(L`| \`${option.cliFlags}\` |
        ${option.cliDesc(option)} |`)
    }
    return acc
  }, []).join('\n')
}

------------

## Node.js API

Require the \`reportTodo()\` function from the \`report-todo\` module.

\`\`\`javascript
const {reportTodo} = require('report-todo')
\`\`\`

The \`reportTodo()\` function accepts two arguments:

\`\`\`javascript
reportTodo(globs, options)
\`\`\`

\`globs\` is a pattern or array of patterns that indicate the root paths under
which files will be parsed. \`globs\` is processed by
[globby](https://github.com/sindresorhus/globby), which for example also
supports negative (exclude) matches by prefixing them with an
exclamation mark.

\`options\` is an object of *key:value* configuration pairs:

\`\`\`javascript
reportTodo(globs, {
${
  defaultOptions.reduce((acc, option) => {
    if (option.cliFlags && option.cliDesc) {
      return acc.concat(`  ${option.key},`)
    }
    return acc
  }, []).join('\n')
}
}
\`\`\`

### Options

| Key | Default | Description |
|-----|---------|-------------|
${
  defaultOptions.reduce((acc, option) => {
    if (option.cliFlags && option.cliDesc) {
      return acc.concat(L`| \`${option.key}\` |
        \`${JSON.stringify(option.value)}\` |
        ${option.desc(option)} |`)
    }
    return acc
  }, []).join('\n')
}

### Examples

Pre-grouped/sorted object:

\`\`\`javascript
const {reportTodo} = require('report-todo')

reportTodo(\`./src/\`, {reportMode: 'object'}).then((report) => {
  console.log(report)
})
\`\`\`

Asynchronous generator:

\`\`\`javascript
const {reportTodo} = require('report-todo')

const generator = reportTodo(\`./src/\`, {reportMode: 'generator'})

for await (const todo of generator) {
  console.log(todo)
}
\`\`\`

------------

## Todo match objects

Some report modes such as \`generator\`, \`object\` and \`json\` list results
as objects with the following keys:

| Key             | Description                          |
|-----------------|--------------------------------------|
| \`filePath\`    | the file path                        |
| \`startLineNo\` | the match's start line number        |
| \`tag\`         | the matched tag                      |
| \`labels\`      | array with the match's labels        |
| \`lines\`       | array with the match's comment lines |

------------

## Similar projects

* [Leasot](https://github.com/pgilad/leasot): the goal is similar, however
  Leasot attempts to detect the comments according to the specific syntax of the
  programming languages used in the parsed files.

------------

## License

MIT, see [LICENSE](https://github.com/kynikos/report-todo/blob/master/LICENSE).
`
}
