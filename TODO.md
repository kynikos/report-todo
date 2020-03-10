# Table of contents

1. [enhancement](#1-0)
2. [integration](#1-1)
3. [setup](#1-2)

# enhancement<a id="1-0"></a>

| file path | line # | tag | labels | comment
|:----------|:-------|:----|:-------|:-------
| [src/index.js](src/index.js#L26) | 26 | TODO | enhancement | Use a configuration file to sort sections in an arbitrary<br>order
| [src/index.js](src/index.js#L28) | 28 | TODO | enhancement | Support comments with closing tag, e.g.<br>/* some comment */
| [src/makeReport.js](src/makeReport.js#L38) | 38 | TODO | enhancement | JSON, XML, table (plain text), CSV, MediaWiki, VSCode<br>See also leasot's modes
| [src/reportMarkdown.js](src/reportMarkdown.js#L82) | 82 | TODO | enhancement | Escape at least '\|' and '\' (optionally?)<br>Or escape all special Markdown characters?<br>Or just let the user do the escaping when necessary<br>Use '\' or HTML entities? Test

# integration<a id="1-1"></a>

| file path | line # | tag | labels | comment
|:----------|:-------|:----|:-------|:-------
| [src/index.js](src/index.js#L30) | 30 | TODO | integration | See also https://pgilad.github.io/leasot/<br>Adapt this as a plugin? Note that it also supports custom parsers
| [src/index.js](src/index.js#L32) | 32 | TODO | integration | How cool would it be if the whole thing could be<br>integrated with GitHub's issue tracker etc.

# setup<a id="1-2"></a>

| file path | line # | tag | labels | comment
|:----------|:-------|:----|:-------|:-------
| [aux/report-todo.js](aux/report-todo.js#L5) | 5 | TODO | setup | minimist is a simpler alternative to commander.js
| [src/index.js](src/index.js#L6) | 6 | TODO | setup | Start using ES6 module imports when they're no longer<br>experimental in Node.js
| [src/index.js](src/index.js#L19) | 19 | TODO | setup | Make a Babel plugin to pre-process all oneLine strings at<br>compile time (turn them all into normal strings, properly dedented)
| [src/index.js](src/index.js#L24) | 24 | TODO | setup | NPM recommends also specifying 'engines' in package.json<br>https://docs.npmjs.com/using-npm/developers.html
| [src/parseFile.js](src/parseFile.js#L57) | 57 | TODO | setup | Keep the documentation in sync with this object's keys
| [tasks.js](tasks.js#L31) | 31 | TODO | setup | The @kynikos dependencies should only provide peerDependencies
| [tasks.js](tasks.js#L66) | 66 | TODO | setup | Optionally require the compiled library from dist/ to test it<br>Especially do it when testing a release
| [tasks.js](tasks.js#L185) | 185 | TODO | setup | Require the compiled library from dist/ to test it when<br>testing a release
| [tasks.js](tasks.js#L196) | 196 | TODO | setup | Create a separate package with normal package.json<br>dependencies installed in node_modules<br>For example restore the normal separation between 'dependencies' and<br>'devDependencies' in package.json, but, when building the<br>compiled/bundled version, temporarily merge 'dependencies' into<br>'devDependencies'
| [tasks.js](tasks.js#L203) | 203 | TODO | setup | Allow changing pkgrel
| [test/index.test.js](test/index.test.js#L25) | 25 | TODO | setup | Optionally require the compiled library from dist to test it
| [webpack.config.js](webpack.config.js#L8) | 8 | TODO | setup | Create a separate package with normal package.json<br>dependencies installed in node_modules<br>For example restore the normal separation between 'dependencies' and<br>'devDependencies' in package.json, but, when building the<br>compiled/bundled version, temporarily merge 'dependencies' into<br>'devDependencies'
| [webpack.config.js](webpack.config.js#L14) | 14 | TODO | setup | Use an equivalent to licensify, especially with the bundled<br>version
| [webpack.config.js](webpack.config.js#L35) | 35 | TODO | setup | Use a proper devtool in production<br>https://webpack.js.org/configuration/devtool/#production
