exports.baseTechName = 'vanilla.js';

exports.techMixin = {

    getSuffixes : function() {
        return ['vanilla.js', 'node.js'];
    },

    getCreateSuffixes : function() {
        return ['node.js'];
    },

    getBuildSuffixes : function() {
        return ['node.js'];
    },

    getBuildSuffixesMap : function() {
        return {
            'node.js' : this.getSuffixes()
        };
    },

    getYmChunk : function() {
        var ymRelPath = this.__base.apply(this, arguments);
        return [
            "if(typeof module !== 'undefined') {\n",
            "modules = " + this.getBuildResultChunk(ymRelPath),
            "}\n"
        ].join('');
    },

    getBuildResultChunk : function(relPath, path) {
        var fChar = relPath.charAt(0);
        if(fChar !== '/' && fChar !== '.') {
            relPath = './' + relPath;
        }
        return "require('" + relPath + "');\n";
    }

};