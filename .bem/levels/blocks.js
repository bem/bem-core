var PATH = require('path'),
    BEM = require('bem'),
    environ = require('../environ'),

    PRJ_TECHS = PATH.resolve(__dirname, '../techs'),
    join = PATH.join;

exports.getTechs = function() {
    return {
        'bemjson.js' : '',
        'bemdecl.js' : 'bemdecl.js',
        'deps.js'    : 'deps.js',
        'css'        : 'css',
        'ie.css'     : 'ie.css',

        'bemhtml'    : join(PRJ_TECHS, 'bemhtml.js'),
        'html'       : join(PRJ_TECHS, 'html.js'),
        'js'         : join(PRJ_TECHS, 'js.js'),

        'examples'   : ''
    };
};
