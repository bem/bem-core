var PATH = require('path'),
    BEM = require('bem'),
    environ = require('bem-environ'),
    techsCore = require('bem-techs-core'),

    PRJ_TECHS = PATH.resolve(__dirname, '../techs'),
    join = PATH.join;

exports.getTechs = function() {
    var techs = {
        'bemjson.js' : 'bem/lib/tech/v2',
        'bemhtml.js' : 'bem/lib/tech/v2',
        'md'         : 'bem/lib/tech/v2',
        'wiki'       : 'bem/lib/tech/v2',
        'bemdecl.js' : 'v2/bemdecl.js',
        'deps.js'    : 'v2/deps.js',
        'css'        : 'v2/css',
        'ie.css'     : 'v2/ie.css',
        'js'         : 'v2/js-i'
    };

    [
        'test.js',
        'sets',
        'test.js+browser.js+bemhtml'
    ].forEach(function(name) {
        techs[name] = environ.getLibPath('bem-pr', 'bem', 'techs', name + '.js');
    });

    [
        'examples',
        'tests',
    ].forEach(function(name) {
        techs[name] = join(PRJ_TECHS, name + '.js');
    });

    [
        'bemhtml',
        'bemtree',
        'html',
        'vanilla.js',
        'browser.js',
        'node.js',
        'browser.js+bemhtml'
    ].forEach(function(name) {
        techs[name] = techsCore.resolveTech(name);
    });

    return techs;
};
