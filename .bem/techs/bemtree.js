exports.baseTechPath = require.resolve('./bemhtml.js');

exports.techMixin = {

    getBuildSuffixesMap : function() {
        return {
            'bemtree.js' : ['bemtree']
        };
    },

    getCreateSuffixes : function() {
        return ['bemtree'];
    },

    getExportName : function() {
        return 'BEMTREE';
    },

    getModulesDeps : function() {
        return { vow : 'Vow' };
    }

};
