exports.baseTechPath = require.resolve('./bemhtml.js');

exports.techMixin = {

    getSuffixes : function() {
        return ['bemtree'];
    },

    getCreateSuffixes : function() {
        return ['bemtree'];
    },

    getBuildSuffixes : function() {
        return ['bemtree.js'];
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
