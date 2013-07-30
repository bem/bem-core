exports.baseTechName = 'vanilla.js';

exports.techMixin = {

    getWeakBuildSuffixesMap: function(){
        return { 'node.js' : ['vanilla.js', 'node.js'] };
    },

    getBuildSuffixesMap: function(){
        return { 'node.js' : ['node.js'] };
    },

    getCreateSuffixes : function() {
        return ['node.js'];
    },

    getYmChunk : function() {
        return [
            "if(typeof module !== 'undefined') {",
            "modules = require('ym');",
            "}\n"
        ].join('');
    },

    getBuildResult : function(files, suffix, output, opts) {
        var ymChunk = this.getYmChunk();
        return this.__base.apply(this, arguments)
            .then(function(res) {
                return [ymChunk].concat(res);
            });
    }

};
