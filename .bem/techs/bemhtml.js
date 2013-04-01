var BEM = require('bem'),
    Q = BEM.require('q'),
    PATH = require('path');

exports.getBuildResultChunk = function(relPath, path, suffix) {

    return BEM.util.readFile(path)
        .then(function(c) {

            return [
                '/* ' + path + ': start */',
                c,
                '/* ' + path + ': end */',
                '\n'
            ].join('\n');

        });

};

exports.getBuildResult = function(prefixes, suffix, outputDir, outputName) {

    var _this = this;
    return this.filterPrefixes(prefixes, this.getCreateSuffixes())
        .then(function(paths) {
            return Q.all(paths.map(function(path) {
                return _this.getBuildResultChunk(
                    PATH.relative(outputDir, path), path, suffix);
            }));
        })
        .then(function(sources) {
            sources = sources.join('\n');

            var BEMHTML = require('../lib/bemhtml');

            return BEMHTML.translate(sources, {
              devMode: process.env.BEMHTML_ENV == 'development',
              cache: process.env.BEMHTML_CACHE == 'on'
            });
        });

};

exports.getSuffixes = function() {
    return ['bemhtml'];
};

exports.getBuildSuffixes = function() {
    return ['bemhtml.js'];
};
