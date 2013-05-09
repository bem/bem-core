var ometajs = require('ometajs'),
    xjst = require('xjst'),
    vm = require('vm'),
    bemhtml = require('../ometa/bemhtml'),
    BEMHTMLParser = bemhtml.BEMHTMLParser,
    BEMHTMLToXJST = bemhtml.BEMHTMLToXJST,
    BEMHTMLLogLocal = bemhtml.BEMHTMLLogLocal;

var api = exports;

//
// ### function translate (source)
// #### @source {String} BEMHTML Source code
// #### @options {Object} Compilation options **optional**
// Returns source translated to javascript
//
api.translate = function translate(source, options) {
  var tree = BEMHTMLParser.matchAll(source, 'topLevel'),
      xjstPre = BEMHTMLToXJST.match(tree, 'topLevel'),
      vars = [];

  options || (options = {});

  if (options.cache === true) {
    var xjstCached = BEMHTMLLogLocal.match(xjstPre, 'topLevel');
    vars = xjstCached[0];
    xjstPre = xjstCached[1];
  }

  var xjstTree = xjst.translate(xjstPre),
      exportName = options.exportName || 'BEMHTML';

  try {
    var xjstJS = options.devMode ?
                   xjst.compile(xjstTree, '', { 'no-opt': true })
                   :
                   xjst.compile(xjstTree, { engine: 'sort-group' });
  } catch (e) {
    throw new Error("xjst to js compilation failed:\n" + e.stack);
  }

  return [
         '(function(g) {',
         'var cache,',
         '  xjst = function(options) {',
         '    if (!options) options = {};',
         '    cache = options.cache;',
         (vars.length > 0 ? '    var ' + vars.join(', ') + ';\n' : ''),
         '    return __xjst.apply.call(',
         (options.raw ? 'this' : '[this]'),
         '    );',
         '  },',
         '  __xjst = '  + xjstJS + ';',
         'if(typeof exports === "object") {',
         'exports["' + exportName + '"] = xjst;',
         '} else {',
         'g["' + exportName + '"] = xjst;',
         '}',
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

  return context.BEMHTML;
};
