var BEM = require('bem'),
    FS = require('fs'),
    PATH = require('path'),
    Template = BEM.require('./template');

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
        return this.__base.apply(this, arguments)
            .then(function(res) {
                return [
                    FS.readFileSync(
                        PATH.join(
                            __dirname, '..', '..',
                            'node_modules', 'ym', 'modules.js'))
                ].concat(res);
            });
    }
};
