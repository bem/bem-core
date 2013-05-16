var BEM = require('bem'),
    Q = BEM.require('q'),
    PATH = require('path'),
    compat = require('bemhtml-compat');

exports.techMixin = {

    getSuffixes : function() {
        return ['bemhtml'];
    },

    getBuildSuffixes : function() {
        return ['bemhtml.js'];
    },

    getBuildResultChunk : function(relPath, path, suffix) {
        return compat.transpile(this.readContent(path, suffix));
    },

    getBuildResult : function(prefixes, suffix, outputDir, outputName) {
        var _t = this;
        return this.filterPrefixes(prefixes, this.getCreateSuffixes())
            .then(function(paths) {
                return Q.all(paths.map(function(path) {
                    return _t.getBuildResultChunk(
                            PATH.relative(outputDir, path), path, suffix);
                }));
            })
            .then(_t.getCompiledResult.bind(_t));
    },

    getCompiledResult : function(sources) {
        sources = sources.join('\n');

        var BEMHTML = require('../lib/bemhtml');
        return BEMHTML.translate(sources, {
                devMode : process.env.BEMHTML_ENV == 'development',
                cache   : process.env.BEMHTML_CACHE == 'on',
                exportName : 'BEMHTML'
            });
    }

};
