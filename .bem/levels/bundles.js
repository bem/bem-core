var BEM = require('bem'),
    environ = require('bem-environ');

exports.baseLevelPath = require.resolve('./blocks');

exports.getTechs = function() {

    return BEM.util.extend(this.__base(), {
        'phantomjs' : environ.getLibPath('bem-pr', 'bem/techs/phantomjs.js'),
        'test-tmpl' : environ.getLibPath('bem-pr', 'bem/techs/test-tmpl.js')
    });

};
