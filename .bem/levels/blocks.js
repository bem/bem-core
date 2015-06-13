var PATH = require('path'),
    environ = require('bem-environ'),
    BEMPR_TECHS = environ.getLibPath('bem-pr', 'bem/techs'),
    PRJ_TECHS = PATH.resolve(__dirname, '../techs'),
    resolveTechs = exports.resolveTechs = function(registry, prefix) {
        return function(name) {
            registry[name] = PATH.join(prefix, name + '.js');
        };
    };

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
        'js'         : 'v2/js-i',
        'blocks'     : 'level-proto',
        'bundles'    : 'level-proto',
        'examples'   : 'level-proto',
        'specs'      : 'level-proto',
        'tests'      : 'level-proto'
    };

    [
        'spec.js',
        'spec.js+browser.js+bemhtml',
        'spec.bemjson.js'
    ].forEach(resolveTechs(techs, BEMPR_TECHS));

    [
        'bemhtml',
        'bemtree',
        'html',
        'vanilla.js',
        'browser.js',
        'node.js',
        'browser.js+bemhtml'
    ].forEach(resolveTechs(techs, PRJ_TECHS));

    return techs;
};
