# report-todo

Generate reports of TODO, FIXME, BUG etc. comments across trees of text files.

## Features:

* Easy setup, as `report-todo` does not try to understand the grammar of the
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

Then just run the `report-todo` command.

### I want JSON, not Markdown

    $ report-todo -m json

------------

## Report examples

These are based on
[src/DEMO.js](https://github.com/kynikos/report-todo/blob/master/aux/DEMO.js).

### Markdown

    $ report-todo aux/DEMO.js -m markdown

```
# Table of contents

1. [#45](#1-0)
2. [[NO LABEL]](#1-1)
3. [defect](#1-2)
4. [setup](#1-3)

# #45<a id="1-0"></a>

| file path | line # | tag | labels | comment
|:----------|:-------|:----|:-------|:-------
| [./aux/DEMO.js](./aux/DEMO.js#L11) | 11 | BUG | defect,#45 | Solve this problem<br>This second line adds more details<br>So does this third line

# [NO LABEL]<a id="1-1"></a>

| file path | line # | tag | labels | comment
|:----------|:-------|:----|:-------|:-------
| [./aux/DEMO.js](./aux/DEMO.js#L1) | 1 | TODO |  | Simple comment without labels

# defect<a id="1-2"></a>

| file path | line # | tag | labels | comment
|:----------|:-------|:----|:-------|:-------
| [./aux/DEMO.js](./aux/DEMO.js#L11) | 11 | BUG | defect,#45 | Solve this problem<br>This second line adds more details<br>So does this third line

# setup<a id="1-3"></a>

| file path | line # | tag | labels | comment
|:----------|:-------|:----|:-------|:-------
| [./aux/DEMO.js](./aux/DEMO.js#L6) | 6 | TODO | setup | I can make this do a lot more<br>It's all written here

```

### JSON

$ report-todo aux/DEMO.js -m json

```
[
  {
    "type": "labels",
    "key": "#45",
    "matches": [
      {
        "filePath": "./aux/DEMO.js",
        "tag": "BUG",
        "startLineNo": 11,
        "lines": [
          "Solve this problem",
          "This second line adds more details",
          "So does this third line"
        ],
        "labels": [
          "defect",
          "#45"
        ]
      }
    ]
  },
  {
    "type": "labels",
    "key": "[NO LABEL]",
    "matches": [
      {
        "filePath": "./aux/DEMO.js",
        "tag": "TODO",
        "startLineNo": 1,
        "lines": [
          "Simple comment without labels"
        ],
        "labels": []
      }
    ]
  },
  {
    "type": "labels",
    "key": "defect",
    "matches": [
      {
        "filePath": "./aux/DEMO.js",
        "tag": "BUG",
        "startLineNo": 11,
        "lines": [
          "Solve this problem",
          "This second line adds more details",
          "So does this third line"
        ],
        "labels": [
          "defect",
          "#45"
        ]
      }
    ]
  },
  {
    "type": "labels",
    "key": "setup",
    "matches": [
      {
        "filePath": "./aux/DEMO.js",
        "tag": "TODO",
        "startLineNo": 6,
        "lines": [
          "I can make this do a lot more",
          "It's all written here"
        ],
        "labels": [
          "setup"
        ]
      }
    ]
  }
]
```

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
`--no-default-excludes` option. For Example:

    $ report-todo ./src ./docs !./test

Use the `--help` option to print a quick usage guide and a list of all the
available CLI options:

    $ report-todo --help

Or, if locally installed in a directory:

    $ npx report-todo --help

### Options

| Flag | Description |
|------|-------------|
| `-t, --tags <TAG1,TAG2...>` | comma-separated whitelist of tags to parse; default is "TODO,FIXME,BUG" |
| `-l, --labels <LABEL1,LABEL2...>` | comma-separated whitelist of labels to include in the results; using an empty string in the list will also include results without labels; it is enough for a match with multiple labels to have only of them in the whitelist to be included in the results; default is to include all results regardless of their labels |
| `--labels-delimiters <OPEN,CLOSE>` | two comma-separated strings that are used to enclose labels; default is "[" "]" |
| `--labels-separator <SEP>` | string to be used to separate labels; default is "," |
| `-b, --labels-is-blacklist` | treat --labels as a blacklist instead; using an empty string in --labels will exclude results without labels; it is enough for a match with multiple labels to have only of them in the --labels to be excluded from the results; --labels is a whitelist by default |
| `-i, --case-insensitive` | parse tags and labels case-insensitively; default is to also match letter case |
| `--ignore-line-comment <COMMENT>` | the string to be appended to lines to exclude them from the results; default is "report-todo-ignore-line" |
| `-m, --report-mode <MODE>` | the generated report mode; one of "json", "markdown"; more modes are available through the Node.js API; default is "markdown" |
| `-g, --report-group-by <KEY1,KEY2...>` | comma-separated, ordered list of keys by which results are grouped and (possibly nested) report sections created; one or more of "filePath", "tag", "startLineNo", "lines", "labels"; default is "labels" |
| `-s, --report-sort-by <KEY1,KEY2...>` | comma-separated, ordered list of keys by which results are sorted within report sections; one or more of "filePath", "tag", "startLineNo", "lines", "labels"; default is "filePath,startLineNo" |
| `--report-links-prefix <PREFIX>` | reports that create links to the files will prefix their URLs with this string; nothing is prefixed by default |

------------

## Node.js API

Require the `reportTodo()` function from the `report-todo` module.

```javascript
const {reportTodo} = require('report-todo')
```

The `reportTodo()` function accepts two arguments:

```javascript
reportTodo(globs, options)
```

`globs` is a pattern or array of patterns that indicate the root paths under
which files will be parsed. `globs` is processed by
[globby](https://github.com/sindresorhus/globby), which for example also
supports negative (exclude) matches by prefixing them with an
exclamation mark.

`options` is an object of *key:value* configuration pairs:

```javascript
reportTodo(globs, {
  tags,
  labels,
  labelsDelimiters,
  labelsSeparator,
  labelsIsBlacklist,
  caseInsensitive,
  ignoreLineComment,
  reportMode,
  reportGroupBy,
  reportSortBy,
  reportLinksPrefix,
}
```

### Options

| Key | Default | Description |
|-----|---------|-------------|
| `tags` | `["TODO","FIXME","BUG"]` | array of tags to parse |
| `labels` | `null` | whitelist array of labels to include in the results; adding `null` or an empty string in the array will also include results without labels; setting `labels=false` will only include results without labels; it is enough for a match with multiple labels to have only of them in the whitelist to be included in the results default is to include all results regardless of their labels |
| `labelsDelimiters` | `["[","]"]` | array of two strings that are used to enclose labels |
| `labelsSeparator` | `","` | string to be used to separate labels |
| `labelsIsBlacklist` | `false` | treat `labels` as a blacklist instead; using `null` or an empty string in `labels` will exclude results without labels; it is enough for a match with multiple labels to have only of them in the `labels` to be excluded from the results; `labels` is a whitelist by default |
| `caseInsensitive` | `false` | parse tags and labels case-insensitively; default is to also match letter case |
| `ignoreLineComment` | `"report-todo-ignore-line"` | the string to be appended to lines to exclude them from the results |
| `reportMode` | `"markdown"` | the generated report mode; one of "generator", "object", "json", "markdown"; "generator" returns an asynchronous generator that yields results as they are found (files are opened asynchronously, so the order of the results is not guaranteed to be the same at every run); "object" returns a grouped and sorted JavaScript object; "json" returns a JSON string; "markdown" returns a Markdown document |
| `reportGroupBy` | `["labels"]` | ordered array of keys by which results are grouped and (possibly nested) report sections created; one or more of "filePath", "tag", "startLineNo", "lines", "labels" |
| `reportSortBy` | `["filePath","startLineNo"]` | ordered array of keys by which results are sorted within report sections; one or more of "filePath", "tag", "startLineNo", "lines", "labels" |
| `reportLinksPrefix` | `null` | reports that create links to the files will prefix their URLs with this string; nothing is prefixed by default |

### Examples

Pre-grouped/sorted object:

```javascript
const {reportTodo} = require('report-todo')

reportTodo(`./src/`, {reportMode: 'object'}).then((report) => {
  console.log(report)
})
```

Asynchronous generator:

```javascript
const {reportTodo} = require('report-todo')

const generator = reportTodo(`./src/`, {reportMode: 'generator'})

for await (const todo of generator) {
  console.log(todo)
}
```

------------

## Todo match objects

Some report modes such as `generator`, `object` and `json` list results
as objects with the following keys:

| Key             | Description                          |
|-----------------|--------------------------------------|
| `filePath`    | the file path                        |
| `startLineNo` | the match's start line number        |
| `tag`         | the matched tag                      |
| `labels`      | array with the match's labels        |
| `lines`       | array with the match's comment lines |

------------

## Similar projects

* [Leasot](https://github.com/pgilad/leasot): the goal is similar, however
  Leasot attempts to detect the comments according to the specific syntax of the
  programming languages used in the parsed files.

------------

## License

MIT, see [LICENSE](https://github.com/kynikos/report-todo/blob/master/LICENSE).
