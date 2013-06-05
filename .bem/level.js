var environ = require('./environ');

exports.baseLevelPath = require.resolve('bem/lib/levels/simple');

exports.getTechs = function() {

    return require('bem').util.extend(this.__base() || {}, {
        'sets' : environ.getLibPath('bem-pr', 'bem/techs/sets.js')
    });

};
