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
    }

};