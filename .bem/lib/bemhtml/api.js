var bem_xjst = require('bem-xjst'),
    vm = require('vm');

var api = exports;

//
// ### function translate (source)
// #### @source {String} BEMHTML Source code
// #### @options {Object} Compilation options **optional**
// Returns source translated to javascript
//
api.translate = function translate(source, options) {
  options || (options = {});

  var xjstJS = bem_xjst.generate(source, {
        optimize: !options.devMode
      }),
      exportName = options.exportName || 'BEMHTML';

  return [
         '(function(g) {\n',
         '  var __xjst = (function(exports) {\n',
         '     ' + xjstJS + ';',
         '     return exports;',
         '  })({});',
         '  var defineAsGlobal = true;',
         '  if(typeof exports === "object") {',
         '    exports["' + exportName + '"] = __xjst;',
         '    defineAsGlobal = false;',
         '  }',
         '  if(typeof modules === "object") {',
         '    modules.define("' + exportName + '", function(provide) { provide(__xjst) });',
         '    defineAsGlobal = false;',
         '  }',
         '  defineAsGlobal && (g["' + exportName + '"] = __xjst);',
         '})(this);'
         ].join('\n');
};

//
// ### function compile (source)
// #### @source {String} BEMHTML Source code
// #### @options {Object} Compilation options **optional**
// Returns generator function
//
api.compile = function compile(source, options) {
  var body = exports.translate(source, options),
      context = { exports: {} };

  if (options && options.devMode) context.console = console;
  vm.runInNewContext(body, context);

  return context.exports.BEMHTML;
};
