var environ = require('bem-environ'),
    BEMPR_TECHS = environ.getLibPath('bem-pr', 'bem/techs');

exports.baseLevelPath = require.resolve('./blocks');

exports.getTechs = function() {
    var techs = this.__base();

    ['phantomjs', 'spec.bemjson.js'].forEach(
        this.resolveTechs(techs, BEMPR_TECHS));

    return techs;
};
