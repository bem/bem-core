exports.baseTechPath = require.resolve('./bemhtml.js');

exports.techMixin = {

    getBuildSuffixesMap: function() {
        return {
            'bemtree.js': ['bemtree']
        };
    },

    getCreateSuffixes : function() {
        return ['bemtree'];
    },

    getCompiledResult : function(sources) {
        sources = sources.join('\n');

        var BEMHTML = require('../lib/bemhtml');
        return BEMHTML.translate(sources, {
                devMode : process.env.BEMTREE_ENV == 'development',
                exportName : 'BEMTREE'
            });
    }

};
