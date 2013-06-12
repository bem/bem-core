var BEM = require('bem'),
    Q = BEM.require('q'),
    PATH = require('path'),
    I18NJS = require('../../common.blocks/i-bem/__i18n/lib/i18n-js'),

    U = BEM.util,
    pjoin = PATH.join;


exports.techMixin = U.extend({}, require('./i18n').LangsMixin, {

    getSuffixForLang: function(lang) {
        return pjoin('i18n', lang + '.keys.js');
    },

    getSuffixForAll: function() {
        return this.getSuffixForLang('all');
    },

    getCreateSuffixes: function() {
        return this.getLangs()
            .map(this.getSuffixForLang, this)
            .concat(this.getSuffixForAll());
    },

    getCreateResults: function(prefix, vars) {

        var _this = this,
            source = this.getPath(prefix, this.getSourceSuffix());

        return BEM.util.readJsonJs(source)
            .then(function(data) {

                return Q.when(_this.getCreateResultsForLangs(prefix, data))
                    .then(function(res) {
                        return U.extend(res, _this.getCreateResultsForAll(prefix, data));
                    });

            });

    },

    getCreateResultsForLangs: function(prefix, data) {

        var _this = this,
            res = {};

        return Q.all(_this.getLangs()
            .map(function(lang) {

                var suffix = _this.getSuffixForLang(lang),
                    dataLang = _this.extendLangDecl({}, data['all'] || {});

                dataLang = _this.extendLangDecl(dataLang, data[lang] || {});
                return Q.when(_this.getCreateResult(prefix, suffix, dataLang, lang))
                    .then(function(r) {
                        res[suffix] = r;
                    });

            }))
            .then(function() {
                return res;
            });

    },

    getCreateResultsForAll: function(prefix, data) {

        var _this = this,
            suffix = _this.getSuffixForAll(),
            res = {};

        res[suffix] = _this.serializeI18nData(data['all']) || [];

        _this.getLangs().reduce(function(res, lang) {

            [].push.apply(res[suffix], _this.serializeI18nData(data[lang] || {}, lang) || []);
            return res;

        }, res);

        res[suffix].length &&
            res[suffix].push(_this.serializeI18nInit(_this.getDefaultLang()));

        return res;

    },

    getCreateResult: function(prefix, suffix, data, lang) {
        if(!data || BEM.util.isEmptyObject(data))
            return [];

        return this.serializeI18nData(data, lang).concat(this.serializeI18nInit(lang));
    },

    storeCreateResult: function(path, suffix, res, force) {
        return this.__base(path, suffix, res, true);
    },

    serializeI18nInit: function(lang) {
        return I18NJS.serializeInit(lang)
    },

    serializeI18nData: function(data, lang) {
        if(!data || BEM.util.isEmptyObject(data))
            return [];

        return I18NJS.serializeData(data, lang);
    },

    getDependencies: function() {
        return ['i18n'];
    }

});
