#!/usr/bin/env node

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["report-todo"] = factory();
	else
		root["report-todo"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./aux/report-todo.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./aux/report-todo.js":
/*!****************************!*\
  !*** ./aux/report-todo.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// The shebang is added by webpack's BannerPlugin, otherwise webpack gets\n// confused by it\n//#! /usr/bin/env node\n\n// TODO[setup]: minimist is a simpler alternative to commander.js\n// This requires having run 'npm link' and 'npm link report-todo'\n// Some libraries such as commander can't be required directly as normal\n// libraries, since technically they get bundled in the report-todo library,\n// so they're not available as independent node_modules libraries\nconst {DEFAULT_OPTIONS, reportTodo, oneLine: L, commander} =\n  __webpack_require__(/*! report-todo */ \"report-todo\")\n\nconst DEFAULT_EXCLUDES = [\n  // Inspiration for exclude defaults:\n  // https://docs.npmjs.com/using-npm/developers.html#keeping-files-out-of-your-package\n  'CVS/',\n  '.git/',\n  '.hg/',\n  'node_modules/',\n  '.svn/',\n  '*.log',\n  '*.swp',\n]\n\ncommander\n  // eslint-disable-next-line function-paren-newline\n  .description(\n    // eslint-disable-next-line prefer-template\n    L`Generate a report of TODO etc. comments parsed under trees of files rooted\n      at each GLOB.` +\n    '\\n\\n' +\n    L`Multiple GLOB patterns are supported; patterns are\n      parsed with globby, which for\n      example also supports negative matches, see\n      https://github.com/sindresorhus/globby for more information; if GLOBs are\n      not specified, the current directory is used as the only root; some\n      patterns are also excluded by default, see also the --no-default-excludes\n      option.`,\n  // eslint-disable-next-line function-paren-newline\n  )\n  .arguments('[GLOBs...]')\n\nfor (const option of DEFAULT_OPTIONS) {\n  if (option.cliFlags && option.cliDesc) {\n    commander.option(option.cliFlags, option.cliDesc(option), option.cliProcess)\n  }\n}\n\ncommander\n  .option('--no-default-excludes', L`do not exclude some patterns by default,\n    i.e. only strictly use the GLOBs explicitly\n    passed on the command line; the patterns excluded by default are [\n    ${DEFAULT_EXCLUDES.join(' ')} ]`)\n\ncommander\n  .action((globs, options) => main(globs, options))\n  .parse(process.argv)\n\n\nasync function main(globs, options) {\n  if (!globs.length) globs.push('.')\n\n  if (options.defaultExcludes) {\n    globs.push(...DEFAULT_EXCLUDES.map((pattern) => `!${pattern}`))\n  }\n\n  // eslint-disable-next-line no-console\n  console.log(await reportTodo(\n    globs,\n    // Don't use 'options' directly, otherwise it will include all the undefined\n    // values and break the program\n    {...options},\n  ))\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXBvcnQtdG9kby8uL2F1eC9yZXBvcnQtdG9kby5qcz9lYjFlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxtREFBbUQ7QUFDMUQsRUFBRSxtQkFBTyxDQUFDLGdDQUFhOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxrRUFBa0U7QUFDbEUsb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0IsTUFBTSwyQkFBMkI7O0FBRWpDO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBLHdEQUF3RCxRQUFRO0FBQ2hFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLFdBQVc7QUFDaEI7QUFDQSIsImZpbGUiOiIuL2F1eC9yZXBvcnQtdG9kby5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBzaGViYW5nIGlzIGFkZGVkIGJ5IHdlYnBhY2sncyBCYW5uZXJQbHVnaW4sIG90aGVyd2lzZSB3ZWJwYWNrIGdldHNcbi8vIGNvbmZ1c2VkIGJ5IGl0XG4vLyMhIC91c3IvYmluL2VudiBub2RlXG5cbi8vIFRPRE9bc2V0dXBdOiBtaW5pbWlzdCBpcyBhIHNpbXBsZXIgYWx0ZXJuYXRpdmUgdG8gY29tbWFuZGVyLmpzXG4vLyBUaGlzIHJlcXVpcmVzIGhhdmluZyBydW4gJ25wbSBsaW5rJyBhbmQgJ25wbSBsaW5rIHJlcG9ydC10b2RvJ1xuLy8gU29tZSBsaWJyYXJpZXMgc3VjaCBhcyBjb21tYW5kZXIgY2FuJ3QgYmUgcmVxdWlyZWQgZGlyZWN0bHkgYXMgbm9ybWFsXG4vLyBsaWJyYXJpZXMsIHNpbmNlIHRlY2huaWNhbGx5IHRoZXkgZ2V0IGJ1bmRsZWQgaW4gdGhlIHJlcG9ydC10b2RvIGxpYnJhcnksXG4vLyBzbyB0aGV5J3JlIG5vdCBhdmFpbGFibGUgYXMgaW5kZXBlbmRlbnQgbm9kZV9tb2R1bGVzIGxpYnJhcmllc1xuY29uc3Qge0RFRkFVTFRfT1BUSU9OUywgcmVwb3J0VG9kbywgb25lTGluZTogTCwgY29tbWFuZGVyfSA9XG4gIHJlcXVpcmUoJ3JlcG9ydC10b2RvJylcblxuY29uc3QgREVGQVVMVF9FWENMVURFUyA9IFtcbiAgLy8gSW5zcGlyYXRpb24gZm9yIGV4Y2x1ZGUgZGVmYXVsdHM6XG4gIC8vIGh0dHBzOi8vZG9jcy5ucG1qcy5jb20vdXNpbmctbnBtL2RldmVsb3BlcnMuaHRtbCNrZWVwaW5nLWZpbGVzLW91dC1vZi15b3VyLXBhY2thZ2VcbiAgJ0NWUy8nLFxuICAnLmdpdC8nLFxuICAnLmhnLycsXG4gICdub2RlX21vZHVsZXMvJyxcbiAgJy5zdm4vJyxcbiAgJyoubG9nJyxcbiAgJyouc3dwJyxcbl1cblxuY29tbWFuZGVyXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jdGlvbi1wYXJlbi1uZXdsaW5lXG4gIC5kZXNjcmlwdGlvbihcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLXRlbXBsYXRlXG4gICAgTGBHZW5lcmF0ZSBhIHJlcG9ydCBvZiBUT0RPIGV0Yy4gY29tbWVudHMgcGFyc2VkIHVuZGVyIHRyZWVzIG9mIGZpbGVzIHJvb3RlZFxuICAgICAgYXQgZWFjaCBHTE9CLmAgK1xuICAgICdcXG5cXG4nICtcbiAgICBMYE11bHRpcGxlIEdMT0IgcGF0dGVybnMgYXJlIHN1cHBvcnRlZDsgcGF0dGVybnMgYXJlXG4gICAgICBwYXJzZWQgd2l0aCBnbG9iYnksIHdoaWNoIGZvclxuICAgICAgZXhhbXBsZSBhbHNvIHN1cHBvcnRzIG5lZ2F0aXZlIG1hdGNoZXMsIHNlZVxuICAgICAgaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9nbG9iYnkgZm9yIG1vcmUgaW5mb3JtYXRpb247IGlmIEdMT0JzIGFyZVxuICAgICAgbm90IHNwZWNpZmllZCwgdGhlIGN1cnJlbnQgZGlyZWN0b3J5IGlzIHVzZWQgYXMgdGhlIG9ubHkgcm9vdDsgc29tZVxuICAgICAgcGF0dGVybnMgYXJlIGFsc28gZXhjbHVkZWQgYnkgZGVmYXVsdCwgc2VlIGFsc28gdGhlIC0tbm8tZGVmYXVsdC1leGNsdWRlc1xuICAgICAgb3B0aW9uLmAsXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jdGlvbi1wYXJlbi1uZXdsaW5lXG4gIClcbiAgLmFyZ3VtZW50cygnW0dMT0JzLi4uXScpXG5cbmZvciAoY29uc3Qgb3B0aW9uIG9mIERFRkFVTFRfT1BUSU9OUykge1xuICBpZiAob3B0aW9uLmNsaUZsYWdzICYmIG9wdGlvbi5jbGlEZXNjKSB7XG4gICAgY29tbWFuZGVyLm9wdGlvbihvcHRpb24uY2xpRmxhZ3MsIG9wdGlvbi5jbGlEZXNjKG9wdGlvbiksIG9wdGlvbi5jbGlQcm9jZXNzKVxuICB9XG59XG5cbmNvbW1hbmRlclxuICAub3B0aW9uKCctLW5vLWRlZmF1bHQtZXhjbHVkZXMnLCBMYGRvIG5vdCBleGNsdWRlIHNvbWUgcGF0dGVybnMgYnkgZGVmYXVsdCxcbiAgICBpLmUuIG9ubHkgc3RyaWN0bHkgdXNlIHRoZSBHTE9CcyBleHBsaWNpdGx5XG4gICAgcGFzc2VkIG9uIHRoZSBjb21tYW5kIGxpbmU7IHRoZSBwYXR0ZXJucyBleGNsdWRlZCBieSBkZWZhdWx0IGFyZSBbXG4gICAgJHtERUZBVUxUX0VYQ0xVREVTLmpvaW4oJyAnKX0gXWApXG5cbmNvbW1hbmRlclxuICAuYWN0aW9uKChnbG9icywgb3B0aW9ucykgPT4gbWFpbihnbG9icywgb3B0aW9ucykpXG4gIC5wYXJzZShwcm9jZXNzLmFyZ3YpXG5cblxuYXN5bmMgZnVuY3Rpb24gbWFpbihnbG9icywgb3B0aW9ucykge1xuICBpZiAoIWdsb2JzLmxlbmd0aCkgZ2xvYnMucHVzaCgnLicpXG5cbiAgaWYgKG9wdGlvbnMuZGVmYXVsdEV4Y2x1ZGVzKSB7XG4gICAgZ2xvYnMucHVzaCguLi5ERUZBVUxUX0VYQ0xVREVTLm1hcCgocGF0dGVybikgPT4gYCEke3BhdHRlcm59YCkpXG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmxvZyhhd2FpdCByZXBvcnRUb2RvKFxuICAgIGdsb2JzLFxuICAgIC8vIERvbid0IHVzZSAnb3B0aW9ucycgZGlyZWN0bHksIG90aGVyd2lzZSBpdCB3aWxsIGluY2x1ZGUgYWxsIHRoZSB1bmRlZmluZWRcbiAgICAvLyB2YWx1ZXMgYW5kIGJyZWFrIHRoZSBwcm9ncmFtXG4gICAgey4uLm9wdGlvbnN9LFxuICApKVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./aux/report-todo.js\n");

/***/ }),

/***/ "report-todo":
/*!******************************!*\
  !*** external "report-todo" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"report-todo\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXBvcnQtdG9kby9leHRlcm5hbCBcInJlcG9ydC10b2RvXCI/MmI1OSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJyZXBvcnQtdG9kby5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlcG9ydC10b2RvXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///report-todo\n");

/***/ })

/******/ });
});