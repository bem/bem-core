var BEM = require('bem');

exports.baseTechName = 'node.js';

exports.techMixin = BEM.util.extend({}, require('./i18n.browser.js').techMixin, {
    getBuildSuffixes: function() {
        return [this.getBaseTechSuffix()];
    },
    getBaseTechSuffix: function() {
        return 'node.js';
    },
    getBuildResult: function(files, suffix, output, opts) {
        var _this = this;

        return this.__base(files, suffix, output, opts)
            .then(function(res) {

                var i18n = ['all'].concat(_this.getLangs())
                    .map(function(lang) {
                        return opts.ctx.data[lang]? _this.serializeI18nData(opts.ctx.data[lang], lang).join('\n') : '';
                    });

                return res.concat(i18n, [_this.serializeI18nInit(_this.getDefaultLang())]);

            });

    },
    storeBuildResult: function(path, suffix, res) {
        return BEM.util.writeFile(path, res);
    }
});
