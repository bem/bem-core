var PATH = require('path'),
    BEM = require('bem'),
    environ = require('bem-environ');

exports.baseLevelPath = require.resolve('../../.bem/levels/bundles.js');

exports.getTechs = function() {

    return BEM.util.extend(this.__base() || {}, {
        'bemtree-html' : require.resolve('./bemtree-html.js')
    });

};

exports.getConfig = function() {

    return BEM.util.extend(this.__base() || {}, {

        bundleBuildLevels : [
                'common.blocks'
            ]
            .map(function(path) { return PATH.resolve(environ.PRJ_ROOT, path); })
    });

};
