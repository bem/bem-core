var PATH = require('path'),
    BEM = require('bem'),
    Template = BEM.require('./template'),
    Q = BEM.require('q');

exports.baseTechName = 'js';

exports.techMixin = {

    getSuffixes : function() {
        return ['vanilla.js'];
    },

    getBuildSuffixes : function() {
        return ['vanilla.js'];
    },

    getBuildSuffixesMap : function() {
        return this.getSuffixes()
            .reduce(function(map, suffix) {
                map[suffix] = [suffix];
                return map;
            }, {});
    },

    getCreateResult : function(path, suffix, vars) {
        var moduleName = vars.BlockName;
        vars.ElemName &&
            (moduleName += '__' + vars.ElemName);
        vars.ModName &&
            (moduleName += '_' + vars.ModName);
        vars.ModVal &&
            (moduleName += '_' + vars.ModVal);
        vars.ModuleName = moduleName;

        return Template.process([
            "/*global modules:false */",
            "",
            "modules.define('{{bemModuleName}}', function(provide) {",
            "",
            "});",
            ""
        ], vars);
    },

    getBuildResult : function(prefixes, suffix, outputDir, outputName) {
        var _t = this;
        return Q.when(
                this.filterPrefixes(prefixes, this.getBuildSuffixesMap()[suffix] || [suffix]),
                function(paths) {
                    return Q.all(paths.map(function(path) {
                        return _t.getBuildResultChunk(
                            PATH.relative(outputDir, path), path, suffix);
                    }));
                });
    }

};