var PATH = require('path'),
    BEM = require('bem'),
    Q = BEM.require('q'),
    ymPath = require.resolve('ym');

exports.baseTechName = 'vanilla.js';

exports.techMixin = {

    getSuffixes : function() {
        return ['vanilla.js', 'browser.js', 'js'];
    },

    getCreateSuffixes : function() {
        return ['browser.js'];
    },

    getBuildSuffixes : function() {
        return ['js'];
    },

    getBuildSuffixesMap : function() {
        return {
            'js' : this.getSuffixes()
        };
    },

    getYmChunk : function(outputDir, outputName, suffix) {
        var ymRelPath = PATH.relative(outputDir, ymPath);
        return this.getBuildResultChunk(ymRelPath, ymPath);
    },

    getBuildResult : function(prefixes, suffix, outputDir, outputName) {
        return Q.all([
                this.getYmChunk(outputDir, outputName, suffix),
                this.__base.apply(this, arguments)
            ])
            .spread(function(ym, res) {
                return [ym].concat(res);
            });
    }

};