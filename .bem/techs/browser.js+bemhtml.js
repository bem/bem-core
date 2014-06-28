var BEM = require('bem'),
    Q = BEM.require('q');

exports.baseTechName = 'browser.js';

exports.techMixin = {

    getBuildResults: function(decl, levels, output, opts) {
        var _this = this;

        return this.__base(decl, levels, output, opts)
            .then(function(res) {

                return _this.concatBemhtml(res, output, opts)
                    .then(function() {
                        return res;
                    });

            });
    },

    getBemhtml: function(output, opts) {
        var _this = this,
            context = this.context,
            declaration = context.opts.declaration;

        return declaration
            .then(function(decl) {

                decl = decl.depsByTechs;

                if (!decl || !decl.js || !decl.js.bemhtml) return;

                decl = { deps: decl.js.bemhtml };

                var bemhtmlTech = context.createTech('bemhtml');

                if (bemhtmlTech.API_VER !== 2) return Q.reject(new Error(_this.getTechName() +
                    ' can’t use v1 bemhtml tech to concat bemhtml content. Configure level to use v2 bemhtml.'));

                // ugly hack for https://github.com/bem/bem-core/issues/392
                opts.force = true;

                bemhtmlTech.getCompiledResult = function(sources) {
                    sources = sources.join('\n');

                    var BEMHTML = require('bem-xjst/lib/bemhtml'),
                        exportName = this.getExportName(),
                        optimize = process.env[exportName + '_ENV'] !== 'development',
                        wrap = function(code) {
                            return [
                                'modules.define(\'BEMHTML\', [\'i-bem__i18n\'], function(provide, I18N) {',
                                '    var BEM = { I18N: I18N },',
                                '        __bem_xjst = (function(exports) {',
                                '            ' + code + ';',
                                '            return exports;',
                                '        })({});',
                                '    provide(__bem_xjst);',
                                '});'
                            ].join('\n');
                        };

                    return wrap(BEMHTML.generate(sources, {
                        wrap: false,
                        exportName: exportName,
                        optimize: optimize,
                        cache   : optimize && process.env[exportName + '_CACHE'] === 'on'
                    }));
                };

                return bemhtmlTech.getBuildResults(
                        decl,
                        context.getLevels(),
                        output,
                        opts
                    ).then(function(res) {
                        return res['bemhtml.js'];
                    });
            });
    },

    concatBemhtml: function(res, output, opts) {
        return this.getBemhtml(output, opts)
            .then(function(bemhtml) {
                // put bemhtml templates at the bottom of builded js file
                Object.keys(res).forEach(function(suffix) {
                    // test for array as in i18n.js+bemhtml tech
                    // there's hack to create symlink for default lang
                    // so 'js' key is a string there
                    Array.isArray(res[suffix]) && res[suffix].push(bemhtml);
                });
            });
    }

};
