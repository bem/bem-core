var BEM = require('bem'),
    Q = BEM.require('qq'),
    PATH = require('path'),
    LangsMixin = require('./i18n').LangsMixin,
    VM = require('vm'),
    I18NJS = require('../../common.blocks/i-bem/__i18n/lib/i18n-js');

exports.baseTechName = 'html';

exports.techMixin = BEM.util.extend({}, LangsMixin, {

    getBaseTechSuffix: function() {
        return 'html';
    },

    getSuffixes: function() {

        return this.getLangs()
            .map(this.getCreateSuffixForLang, this)
            .concat([this.getBaseTechSuffix()]);

    },

    getCreateSuffixForLang: function(lang) {
        return lang + '.' + this.getBaseTechSuffix();
    },

    getBemhtml: function(prefix, i18n) {

        var path = this.getPath(prefix, 'bemhtml.js');

        return Q.all([BEM.util.readFile(path), i18n])
            .spread(function(bemhtml, i18n) {
                return VM.runInThisContext([
                        '(function(){',
                        // make local var BEM to prevent global assignment in i18n code
                        'var BEM = {};',
                        i18n,
                        bemhtml,
                        'return BEMHTML;',
                        '})()'
                    ].join('\n'), path);
            });

    },

    getCreateResults: function(prefix, vars) {

        var _this = this,
            source = this.getPath(prefix, this.getSourceSuffix());

        return BEM.util.readJsonJs(source)
            .then(function(data) {

                var res = {};

                _this.getLangs().forEach(function(lang) {

                    var suffix = _this.getCreateSuffixForLang(lang),
                        dataLang = _this.extendLangDecl({}, data['all'] || {});

                    dataLang = _this.extendLangDecl(dataLang, data[lang] || {});

                    res[suffix] = _this.getCreateResult(
                        _this.getPath(prefix, suffix),
                        suffix,
                        BEM.util.extend({}, vars, { data: dataLang, lang: lang }));

                });

                // NOTE: hack to pass outputName to storeCreateResult()
                res[_this.getBaseTechSuffix()] = prefix;

                return Q.shallow(res);

            });

    },

    getCreateResult: function(path, suffix, vars) {

        var data = vars.data,
            i18n = data && !BEM.util.isEmptyObject(data)?
                this.serializeI18nData(data, vars.lang)
                    .concat([this.serializeI18nInit(vars.lang)])
                    .join('\n')
                : '';

        return this.getHtml(
            this.getBemhtml(vars.Prefix, i18n),
            this.getBemjson(vars.Prefix));

    },

    storeCreateResult: function(path, suffix, res, force) {

        if (suffix === this.getBaseTechSuffix()) {
            return BEM.util.symbolicLink(
                path,
                this.getPath(
                    PATH.basename(res),
                    this.getCreateSuffixForLang(this.getDefaultLang())),
                true);
        }

        return this.__base(path, suffix, res, force);

    },

    serializeI18nInit: I18NJS.serializeInit,

    serializeI18nData: I18NJS.serializeData,

    getDependencies: function() {
        return ['i18n'].concat(this.__base());
    }

});
