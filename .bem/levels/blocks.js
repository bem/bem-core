var PATH = require('path'),
    BEM = require('bem'),
    environ = require('bem-environ'),

    PRJ_TECHS = PATH.resolve(__dirname, '../techs'),
    join = PATH.join;

exports.getTechs = function() {
    var techs = {
        'bemjson.js' : '',
        'bemdecl.js' : 'bemdecl.js',
        'deps.js'    : 'deps.js',
        'css'        : 'css',
        'ie.css'     : 'ie.css',
        'js'         : 'js-i'
    };

    [
        'test.js',
        'test.js+browser.js+bemhtml'
    ].forEach(function(name) {
        techs[name] = environ.getLibPath('bem-pr', 'bem', 'techs', name + '.js');
    });

    [
        'bemhtml',
        'bemtree',
        'html',
        'examples',
        'tests',
        'vanilla.js',
        'browser.js',
        'node.js',
        'browser.js+bemhtml'
    ].forEach(function(name) {
        techs[name] = join(PRJ_TECHS, name + '.js');
    });

    return techs;
};
