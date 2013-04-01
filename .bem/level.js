var environ = require('./environ');

exports.baseLevelPath = require.resolve('bem/lib/levels/project');

exports.getTechs = function() {

    return require('bem').util.extend(this.__base() || {}, {
        'sets' : environ.getLibPath('bem-pr', 'bem/techs/sets.js')
    });

};
