var PATH = require('path');

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
            'if(typeof module !== \'undefined\') {\n',
            'modules = ' + this.getBuildResultChunk(ymRelPath),
            '}\n'
        ].join('');
    },

    getBuildResultChunk : function(relPath) {
        // NOTE: module's path is always an UNIX path,
        // so `relPath` should be converted on Windows systems
        if(PATH.sep !== '/') {
            relPath = relPath.replace(/\\/g, '/');
        }
        // NOTE: Without a leading '/' or './' to indicate a file, the module is either
        // a "core module" or is loaded from a node_modules folder
        if(/^\w/.test(relPath)) {
            relPath = './' + relPath;
        }
        return 'require(\'' + relPath + '\');\n';
    }

};
