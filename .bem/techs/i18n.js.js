var BEM = require('bem'),
    Q = BEM.require('q'),
    LangsMixin = require('./i18n').LangsMixin,
    PATH = require('path'),
    I18NJS = require('../../common.blocks/i-bem/__i18n/lib/i18n-js');

exports.baseTechName = 'js';

exports.techMixin = BEM.util.extend({}, LangsMixin, {

    getBaseTechSuffix: function() {
        return 'js';
    },

    getBuildSuffixes: function() {

        return this.getLangs()
            .map(this.getBuildSuffixForLang, this)
            .concat([this.getBaseTechSuffix()]);

    },

    getBuildSuffixForLang: function(lang) {
        return lang + '.' + this.getBaseTechSuffix();
    },

    getBuildResults: function(prefixes, outputDir, outputName) {

        var _this = this,
            prefix = PATH.resolve(outputDir, outputName),
            source = this.getPath(prefix, this.getSourceSuffix());

        return BEM.util.readJsonJs(source)
            .then(function(data) {

                var res = {};

                return Q.all(_this.getLangs()
                    .map(function(lang) {

                        var suffix = _this.getBuildSuffixForLang(lang),
                            dataLang = _this.extendLangDecl({}, data['all'] || {});

                        dataLang = _this.extendLangDecl(dataLang, data[lang] || {});

                        return Q.when(_this.getBuildResult(prefixes, suffix, outputDir, outputName, dataLang, lang))
                            .then(function(r) {
                                res[suffix] = r;
                            });

                    }))
                    .then(function() {
                        // NOTE: hack to pass outputName to storeBuildResult()
                        res[_this.getBaseTechSuffix()] = outputName;
                        return res;
                    });

            });

    },

    getBuildResult: function(prefixes, suffix, outputDir, outputName, data, lang) {

        var _this = this;
        return this.__base(prefixes, this.getBaseTechSuffix(), outputDir, outputName)
            .then(function(res) {
                return data && !BEM.util.isEmptyObject(data)? res
                        .concat(_this.serializeI18nData(data, lang))
                        .concat([_this.serializeI18nInit(lang)]) : res;
            });

    },

    serializeI18nInit: I18NJS.serializeInit,

    serializeI18nData: I18NJS.serializeData,

    storeBuildResult: function(path, suffix, res) {

        if (suffix === this.getBaseTechSuffix()) {
            return BEM.util.symbolicLink(
                path,
                this.getPath(
                    res,
                    this.getBuildSuffixForLang(this.getDefaultLang())),
                true);
        }

        return this.__base(path, suffix, res);

    },

    getDependencies: function() {
        return ['i18n'];
    }

});
