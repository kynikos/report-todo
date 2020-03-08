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

eval("// The shebang is added by webpack's BannerPlugin, otherwise webpack gets\n// confused by it\n// #! /usr/bin/env node\n\n// TODO[setup]: minimist is a simpler alternative to commander.js\n// This requires having run 'npm link' and 'npm link report-todo'\n// Some libraries such as commander can't be required directly as normal\n// libraries, since technically they get bundled in the report-todo library,\n// so they're not available as independent node_modules libraries\nconst {DEFAULT_OPTIONS, reportTodo, oneLine: L, commander} =\n  __webpack_require__(/*! report-todo */ \"report-todo\")\n\nconst DEFAULT_EXCLUDES = [\n  // Inspiration for exclude defaults:\n  // https://docs.npmjs.com/using-npm/developers.html#keeping-files-out-of-your-package\n  'CVS/',\n  '.git/',\n  '.hg/',\n  'node_modules/',\n  '.svn/',\n  '*.log',\n  '*.swp',\n]\n\ncommander\n  // eslint-disable-next-line function-paren-newline\n  .description(\n    // eslint-disable-next-line prefer-template\n    L`Generate a report of TODO etc. comments parsed under trees of files rooted\n      at each GLOB.` +\n    '\\n\\n' +\n    L`Multiple GLOB patterns are supported; patterns are\n      parsed with globby, which for\n      example also supports negative matches, see\n      https://github.com/sindresorhus/globby for more information; if GLOBs are\n      not specified, the current directory is used as the only root; some\n      patterns are also excluded by default, see also the --no-default-excludes\n      option.`,\n  // eslint-disable-next-line function-paren-newline\n  )\n  .arguments('[GLOBs...]')\n\nfor (const option of DEFAULT_OPTIONS) {\n  if (option.cliFlags && option.cliDesc) {\n    commander.option(option.cliFlags, option.cliDesc(option), option.cliProcess)\n  }\n}\n\ncommander\n  .option('--no-default-excludes', L`do not exclude some patterns by default,\n    i.e. only strictly use the GLOBs explicitly\n    passed on the command line; the patterns excluded by default are [\n    ${DEFAULT_EXCLUDES.join(' ')} ]`)\n\ncommander\n  .action((globs, options) => main(globs, options))\n  .parse(process.argv)\n\n\nasync function main(globs, options) {\n  if (!globs.length) globs.push('.')\n\n  if (options.defaultExcludes) {\n    globs.push(...DEFAULT_EXCLUDES.map((pattern) => `!${pattern}`))\n  }\n\n  // eslint-disable-next-line no-console\n  console.log(await reportTodo(\n    globs,\n    // Don't use 'options' directly, otherwise it will include all the undefined\n    // values and break the program\n    {...options},\n  ))\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZXBvcnQtdG9kby8uL2F1eC9yZXBvcnQtdG9kby5qcz9lYjFlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxtREFBbUQ7QUFDMUQsRUFBRSxtQkFBTyxDQUFDLGdDQUFhOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQSxrRUFBa0U7QUFDbEUsb0VBQW9FO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0IsTUFBTSwyQkFBMkI7O0FBRWpDO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBLHdEQUF3RCxRQUFRO0FBQ2hFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLLFdBQVc7QUFDaEI7QUFDQSIsImZpbGUiOiIuL2F1eC9yZXBvcnQtdG9kby5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBzaGViYW5nIGlzIGFkZGVkIGJ5IHdlYnBhY2sncyBCYW5uZXJQbHVnaW4sIG90aGVyd2lzZSB3ZWJwYWNrIGdldHNcbi8vIGNvbmZ1c2VkIGJ5IGl0XG4vLyAjISAvdXNyL2Jpbi9lbnYgbm9kZVxuXG4vLyBUT0RPW3NldHVwXTogbWluaW1pc3QgaXMgYSBzaW1wbGVyIGFsdGVybmF0aXZlIHRvIGNvbW1hbmRlci5qc1xuLy8gVGhpcyByZXF1aXJlcyBoYXZpbmcgcnVuICducG0gbGluaycgYW5kICducG0gbGluayByZXBvcnQtdG9kbydcbi8vIFNvbWUgbGlicmFyaWVzIHN1Y2ggYXMgY29tbWFuZGVyIGNhbid0IGJlIHJlcXVpcmVkIGRpcmVjdGx5IGFzIG5vcm1hbFxuLy8gbGlicmFyaWVzLCBzaW5jZSB0ZWNobmljYWxseSB0aGV5IGdldCBidW5kbGVkIGluIHRoZSByZXBvcnQtdG9kbyBsaWJyYXJ5LFxuLy8gc28gdGhleSdyZSBub3QgYXZhaWxhYmxlIGFzIGluZGVwZW5kZW50IG5vZGVfbW9kdWxlcyBsaWJyYXJpZXNcbmNvbnN0IHtERUZBVUxUX09QVElPTlMsIHJlcG9ydFRvZG8sIG9uZUxpbmU6IEwsIGNvbW1hbmRlcn0gPVxuICByZXF1aXJlKCdyZXBvcnQtdG9kbycpXG5cbmNvbnN0IERFRkFVTFRfRVhDTFVERVMgPSBbXG4gIC8vIEluc3BpcmF0aW9uIGZvciBleGNsdWRlIGRlZmF1bHRzOlxuICAvLyBodHRwczovL2RvY3MubnBtanMuY29tL3VzaW5nLW5wbS9kZXZlbG9wZXJzLmh0bWwja2VlcGluZy1maWxlcy1vdXQtb2YteW91ci1wYWNrYWdlXG4gICdDVlMvJyxcbiAgJy5naXQvJyxcbiAgJy5oZy8nLFxuICAnbm9kZV9tb2R1bGVzLycsXG4gICcuc3ZuLycsXG4gICcqLmxvZycsXG4gICcqLnN3cCcsXG5dXG5cbmNvbW1hbmRlclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuY3Rpb24tcGFyZW4tbmV3bGluZVxuICAuZGVzY3JpcHRpb24oXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHByZWZlci10ZW1wbGF0ZVxuICAgIExgR2VuZXJhdGUgYSByZXBvcnQgb2YgVE9ETyBldGMuIGNvbW1lbnRzIHBhcnNlZCB1bmRlciB0cmVlcyBvZiBmaWxlcyByb290ZWRcbiAgICAgIGF0IGVhY2ggR0xPQi5gICtcbiAgICAnXFxuXFxuJyArXG4gICAgTGBNdWx0aXBsZSBHTE9CIHBhdHRlcm5zIGFyZSBzdXBwb3J0ZWQ7IHBhdHRlcm5zIGFyZVxuICAgICAgcGFyc2VkIHdpdGggZ2xvYmJ5LCB3aGljaCBmb3JcbiAgICAgIGV4YW1wbGUgYWxzbyBzdXBwb3J0cyBuZWdhdGl2ZSBtYXRjaGVzLCBzZWVcbiAgICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvZ2xvYmJ5IGZvciBtb3JlIGluZm9ybWF0aW9uOyBpZiBHTE9CcyBhcmVcbiAgICAgIG5vdCBzcGVjaWZpZWQsIHRoZSBjdXJyZW50IGRpcmVjdG9yeSBpcyB1c2VkIGFzIHRoZSBvbmx5IHJvb3Q7IHNvbWVcbiAgICAgIHBhdHRlcm5zIGFyZSBhbHNvIGV4Y2x1ZGVkIGJ5IGRlZmF1bHQsIHNlZSBhbHNvIHRoZSAtLW5vLWRlZmF1bHQtZXhjbHVkZXNcbiAgICAgIG9wdGlvbi5gLFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZnVuY3Rpb24tcGFyZW4tbmV3bGluZVxuICApXG4gIC5hcmd1bWVudHMoJ1tHTE9Ccy4uLl0nKVxuXG5mb3IgKGNvbnN0IG9wdGlvbiBvZiBERUZBVUxUX09QVElPTlMpIHtcbiAgaWYgKG9wdGlvbi5jbGlGbGFncyAmJiBvcHRpb24uY2xpRGVzYykge1xuICAgIGNvbW1hbmRlci5vcHRpb24ob3B0aW9uLmNsaUZsYWdzLCBvcHRpb24uY2xpRGVzYyhvcHRpb24pLCBvcHRpb24uY2xpUHJvY2VzcylcbiAgfVxufVxuXG5jb21tYW5kZXJcbiAgLm9wdGlvbignLS1uby1kZWZhdWx0LWV4Y2x1ZGVzJywgTGBkbyBub3QgZXhjbHVkZSBzb21lIHBhdHRlcm5zIGJ5IGRlZmF1bHQsXG4gICAgaS5lLiBvbmx5IHN0cmljdGx5IHVzZSB0aGUgR0xPQnMgZXhwbGljaXRseVxuICAgIHBhc3NlZCBvbiB0aGUgY29tbWFuZCBsaW5lOyB0aGUgcGF0dGVybnMgZXhjbHVkZWQgYnkgZGVmYXVsdCBhcmUgW1xuICAgICR7REVGQVVMVF9FWENMVURFUy5qb2luKCcgJyl9IF1gKVxuXG5jb21tYW5kZXJcbiAgLmFjdGlvbigoZ2xvYnMsIG9wdGlvbnMpID0+IG1haW4oZ2xvYnMsIG9wdGlvbnMpKVxuICAucGFyc2UocHJvY2Vzcy5hcmd2KVxuXG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oZ2xvYnMsIG9wdGlvbnMpIHtcbiAgaWYgKCFnbG9icy5sZW5ndGgpIGdsb2JzLnB1c2goJy4nKVxuXG4gIGlmIChvcHRpb25zLmRlZmF1bHRFeGNsdWRlcykge1xuICAgIGdsb2JzLnB1c2goLi4uREVGQVVMVF9FWENMVURFUy5tYXAoKHBhdHRlcm4pID0+IGAhJHtwYXR0ZXJufWApKVxuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS5sb2coYXdhaXQgcmVwb3J0VG9kbyhcbiAgICBnbG9icyxcbiAgICAvLyBEb24ndCB1c2UgJ29wdGlvbnMnIGRpcmVjdGx5LCBvdGhlcndpc2UgaXQgd2lsbCBpbmNsdWRlIGFsbCB0aGUgdW5kZWZpbmVkXG4gICAgLy8gdmFsdWVzIGFuZCBicmVhayB0aGUgcHJvZ3JhbVxuICAgIHsuLi5vcHRpb25zfSxcbiAgKSlcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./aux/report-todo.js\n");

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