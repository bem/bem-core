var BEM = require('bem'),
    FS = require('fs'),
    PATH = require('path'),
    Template = BEM.require('./template'),
    Q = BEM.require('Q');

exports.baseTechPath = BEM.require.resolve('./techs/js.js');

exports.techMixin = {
    getCreateResult : function(path, suffix, vars) {
        vars.BemObj = 'BEM' + (/^i-/.test(vars.BlockName) ? '' : '.DOM');
        vars.DeclObj = "'" + vars.BlockName + "'";

        if (vars.ModName || vars.ModVal) {
            vars.DeclObj = "{ block: " + vars.DeclObj +
                (vars.ModName? ", modName: '" + vars.ModName + "'" : '') +
                (vars.ModVal? ", modVal: '" + vars.ModVal + "'" : '') +
                '}';
        }

        return Template.process([
            '/** @requires BEM */',
            '/** @requires {{bemBemObj}} */',
            '',
            '(function(undefined) {',
            '',
            "{{bemBemObj}}.decl({{bemDeclObj}}, {",
            '',
            '    onSetMod : {',
            '',
            "        'js' : function() {",
            '            /* ... */',
            '        }',
            '',
            '    }',
            '',
            '}, {',
            '',
            '    live : function() {',
            '        /* ... */',
            '    }',
            '',
            '});',
            '',
            '})();'], vars);
    },

    getBuildResult : function(prefixes, suffix, outputDir, outputName) {
        var modulesRelPath = PATH.join('..', '..', 'node_modules', 'ym', 'modules.js');
        return Q.all(
            [
                this.getBuildResultChunk(
                    modulesRelPath,
                    PATH.join(__dirname, modulesRelPath)),
                this.__base.apply(this, arguments)
            ]).then(function(res) {
                return [res[0]].concat(res[1]);
            });
    }
};
