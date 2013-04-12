exports.baseTechName = 'vanilla.js';

exports.techMixin = {

    getSuffixes : function() {
        return ['vanilla.js', 'node.js'];
    },

    getBuildSuffixes : function() {
        return ['node.js'];
    },

    getBuildSuffixesMap : function() {
        return {
            'node.js' : this.getSuffixes()
        };
    },

    getYmChunk : function(outputDir, outputName, suffix) {
        return [
            "if(typeof module !== 'undefined') {",
            "modules = require('ym');",
            "}\n"
        ].join('');
    },

    getBuildResult : function(prefixes, suffix, outputDir, outputName) {
        var ymChunk = this.getYmChunk();
        return this.__base.apply(this, arguments)
            .then(function(res) {
                return [ymChunk].concat(res);
            });
    }

};