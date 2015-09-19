var PATH = require('path'),
    BEM = require('bem'),
    Q = BEM.require('q');

exports.baseTechName = 'vanilla.js';

exports.techMixin = {

    getSuffixes : function() {
        return ['vanilla.js', 'browser.js', 'js'];
    },

    getCreateSuffixes : function() {
        return ['js'];
    },

    getBuildSuffixes : function() {
        return ['js'];
    },

    getBuildSuffixesMap : function() {
        return {
            'js' : this.getSuffixes()
        };
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

        return BEM.template.process([
            'modules.define(\'{{bemModuleName}}\', [\'i-bem__dom\'], function(provide, BEMDOM) {',
            '',
            'provide(BEMDOM.decl(this.name, {',
            '    onSetMod: {',
            '        js: {',
            '            inited: function() {',
            '',
            '            }',
            '        }',
            '    }',
            '}));',
            '',
            '})'
        ], vars);
    },

    getYmChunk : function() {
        var ymRelPath = this.__base.apply(this, arguments);
        return this.getBuildResultChunk(ymRelPath);
    }

};
