var BEM = require('bem'),
    Q = BEM.require('q');

exports.baseTechName = 'browser.js';

exports.techMixin = {

    getBuildResults : function(decl, levels, output, opts) {
        var _this = this;

        // ugly hack for https://github.com/bem/bem-core/issues/392
        opts.force = true;

        return this.__base(decl, levels, output, opts)
            .then(function(res) {

                return _this.concatBemhtml(res, output, opts)
                    .then(function() {
                        return res;
                    });

            });
    },

    concatBemhtml : function(res, output, opts) {
        return this.concatBemxjst('bemhtml', res, output, opts);
    },

    concatBemxjst : function(tech, res, output, opts) {
        var _this = this,
            context = this.context,
            declaration = context.opts.declaration;

        return declaration
            .then(function(decl) {

                decl = decl.depsByTechs;

                if(!decl || !decl.js || !decl.js[tech]) return;

                decl = { deps : decl.js[tech] };

                var bemxjstTech = context.createTech(tech);

                if(bemxjstTech.API_VER !== 2) return Q.reject(new Error(_this.getTechName() +
                    ' can’t use v1 ' + tech + ' tech to concat ' + tech + ' content. Configure level to use v2 ' + tech + '.'));

                var bemxjstResults = bemxjstTech.getBuildResults(
                        decl,
                        context.getLevels(),
                        output,
                        opts
                    );

                return bemxjstResults
                    .then(function(r) {

                        // put templates at the bottom of builded js file
                        Object.keys(res).forEach(function(suffix) {
                            // test for array as in i18n.js+bemhtml tech
                            // there's hack to create symlink for default lang
                            // so 'js' key is a string there
                            Array.isArray(res[suffix]) && res[suffix].push(r[tech + '.js']);
                        });

                    });

            });
    }

};
