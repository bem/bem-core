var PATH = require('path'),
    BEM = require('bem'),
    Q = BEM.require('q'),
    ymPath = require.resolve('ym');

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

        return BEM.template.process([
            '/* global modules:false */',
            '',
            'modules.define(\'{{bemModuleName}}\', function(provide) {',
            '',
            'provide();',
            '',
            '});',
            ''
        ], vars);
    },

    getYmChunk : function(output) {
        var outputDir = PATH.resolve(output, '..');
        return PATH.relative(outputDir, ymPath);
    },

    getBuildResult : function(files, suffix, output, opts) {
        return Q.all([
                this.getYmChunk(output),
                this.__base.apply(this, arguments)
            ])
            .spread(function(ym, res) {
                return [ym].concat(res);
            });
    }

};
