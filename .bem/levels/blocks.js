var PATH = require('path'),
    BEM = require('bem'),
    environ = require('../environ'),

    PRJ_TECHS = PATH.resolve(__dirname, '../techs'),
    join = PATH.join;

exports.getTechs = function() {
    var techs = {
        'bemjson.js' : '',
        'bemdecl.js' : 'bemdecl.js',
        'deps.js'    : 'deps.js',
        'css'        : 'css',
        'ie.css'     : 'ie.css',
        'js'         : 'js-i',
        'test.js'    : environ.getLibPath('bem-pr', 'bem/techs/test.js.js')
    };

    [
        'bemhtml',
        'bemtree.xjst',
        'html',
        'examples',
        'tests',
        'vanilla.js',
        'browser.js',
        'node.js'
    ].forEach(function(name) {
        techs[name] = join(PRJ_TECHS, name + '.js');
    });

    return techs;
};
