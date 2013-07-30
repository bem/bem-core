var PATH = require('path'),
    BEM = require('bem'),
    environ = require('../environ'),

    PRJ_TECHS = PATH.resolve(__dirname, '../techs'),
    join = PATH.join;

exports.getTechs = function() {
    var techs = {
        'bemjson.js'                 : '',
        'bemdecl.js'                 : 'v2/bemdecl.js',
        'deps.js'                    : 'v2/deps.js',
        'css'                        : 'v2/css',
        'ie.css'                     : 'v2/ie.css',
        'js'                         : 'v2/js-i',
        'test.js'                    : environ.getLibPath('bem-pr', 'bem/techs/test.js.js'),
        'test.js+browser.js+bemhtml' : environ.getLibPath('bem-pr', 'bem/techs/test.js+browser.js+bemhtml.js')
    };

    [
        'bemhtml',
        'bemtree',
        'html',
        'i18n',
        'i18n.browser.js',
        'i18n.node.js',
        'i18n.browser.js+bemhtml',
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
