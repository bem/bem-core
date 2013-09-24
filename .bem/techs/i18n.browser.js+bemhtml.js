var BEM = require('bem'),
    Q = BEM.require('q'),
    LangsMixin = require('./i18n').LangsMixin,
    PATH = require('path'),
    I18NJS = require('../../common.blocks/i-bem/__i18n/lib/i18n-js');

exports.baseTechName = 'browser.js+bemhtml';

exports.techMixin = BEM.util.extend({}, LangsMixin, {

    getBaseTechSuffix: function() {
        return 'js';
    },

    getBuildSuffixesMap: function() {

        var suffixes = {},
            baseSuffixes = this.__base()[this.getBaseTechSuffix()] || 
                           [this.getBaseTechSuffix()];


        this.getLangs()
            .map(this.getBuildSuffixForLang, this).concat([this.getBaseTechSuffix()])
            .forEach(function(s) {
                suffixes[s] = baseSuffixes;
            }, this);

        return suffixes;
    },

    getBuildSuffixForLang: function(lang) {
        return lang + '.' + this.getBaseTechSuffix();
    },

    getBuildResults: function(decl, levels, output, opts) {

        var _this = this,
            source = this.getPath(output, this.getSourceSuffix()),
            base = this.__base;

        return BEM.util.readJsonJs(source)
            .then(function(data) {
                if (!opts) opts = {};
                opts.ctx = {
                    data: data
                };

                return base.call(_this, decl, levels, output, opts);
            });
    },

    getBuildResult: function(files, suffix, output, opts) {

        // NOTE: for symlink use file path as content
        if (suffix === this.getBaseTechSuffix())
            return Q.resolve(this.getPath(
                output,
                this.getBuildSuffixForLang(this.getDefaultLang())));

        var _this = this;
        return this.__base.apply(this, arguments)
            .then(function(res) {
                var lang = suffix.substr(0, 2),
                    dataLang = _this.extendLangDecl({}, opts.ctx.data['all'] || {});

                dataLang = _this.extendLangDecl(dataLang, opts.ctx.data[suffix.substr(0, 2)] || {});

                return res.concat(dataLang? _this.serializeI18nData(dataLang, lang) : [])
                    .concat([_this.serializeI18nInit(lang)]);
            });

    },

    serializeI18nInit: I18NJS.serializeInit,

    serializeI18nData: I18NJS.serializeData,

    storeBuildResult: function(path, suffix, res) {

        if (suffix === this.getBaseTechSuffix())
            return BEM.util.symbolicLink(path, res, true);

        return this.__base(path, suffix, res);

    },

    getDependencies: function() {
        return ['i18n'];
    }

});
