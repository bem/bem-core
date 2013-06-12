var BEM = require('bem'),
    Q = BEM.require('q'),
    INHERIT = BEM.require('inherit'),
    PATH = require('path'),

    DEFAULT_LANGS = ['ru', 'en'],

    pjoin = PATH.join;

var LangsMixin = exports.LangsMixin = {

    getLangs: function() {
        var env = process.env.BEM_I18N_LANGS;
        return env? env.split(' ') : [].concat(DEFAULT_LANGS);
    },

    getDefaultLang: function() {
        return process.env.BEM_I18N_DEFAULT_LANG || this.getLangs().shift();
    },

    getSuffixForLang: function(lang) {
        return lang + '.' + this.getTechName();
    },

    getSourceSuffix: function() {
        return pjoin('i18n', 'all.js');
    },

    extendDecl: function(decl, ext) {

        Object.keys(ext).forEach(function(lang) {
            decl[lang] = this.extendLangDecl(decl[lang] || {}, ext[lang]);
        }, this);

        return decl;

    },

    extendLangDecl: function(decl, ext) {

        Object.keys(ext).forEach(function(keyset) {

            // fallback to BEM.util.extend() on normal keysets
            if (keyset !== '') {
                // TODO: here will also go merge of i18n:js and i18n:xsl content of key values in the future
                decl[keyset] = BEM.util.extend(true, decl[keyset] || {}, ext[keyset]);
                return;
            }

            // concatenate values of empty keysets
            decl[keyset] || (decl[keyset] = '');
            decl[keyset] += '\n' + ext[keyset];

        });

        return decl;

    }

};

exports.Tech = INHERIT(BEM.Tech, BEM.util.extend({}, LangsMixin, {

    getSuffixForLang: function(lang) {
        return pjoin(this.getTechName(), lang + '.js');
    },

    getSuffixes: function() {
        return this.getBuildSuffixes().concat(this.getCreateSuffixes());
    },

    getCreateSuffixes: function() {
        return this.getLangs().map(this.getSuffixForLang, this);
    },

    getBuildSuffixes: function() {
        return [this.getSuffixForLang('all')];
    },

    getBuildResult: function(prefixes, suffix, outputDir, outputName) {

        var _this = this;
        return Q.all(this.filterPrefixes(prefixes, this.getBuildSuffixes()))
            .then(function(allPaths) {

                // read and process *.i18n/all.js files of BEM entities
                var decl = allPaths.reduce(function(decl, path) {

                    return Q.all([decl, _this.readContent(path, suffix)])
                        .spread(_this.extendDecl.bind(_this));

                }, {});

                // read and process *.i18n/[lang].js files of BEM entities
                return _this.getLangs().reduce(function(decl, lang) {

                    // filter prefixes for each lang
                    return _this.filterPrefixes(prefixes, [_this.getSuffixForLang(lang)])
                        .then(function(langPaths) {

                            // read and process files for concrete lang
                            return langPaths.reduce(function(decl, path) {

                                return Q.all([decl, _this.readLangContent(path, lang)])
                                    .spread(_this.extendLangDecl.bind(_this));

                            }, decl);

                        });

                }, decl);

            });

    },

    storeBuildResult: function(path, suffix, res) {

        BEM.util.mkdirs(PATH.dirname(path));

        res = '(' + JSON.stringify(res, null, 4) + ')\n';
        return this.__base(path, suffix, res);

    },

    getCreateResult: function(path, suffix, vars) {
        return {};
    },

    storeCreateResult: function(path, suffix, res, force) {
        res = 'module.exports = ' + JSON.stringify(res, null, 4) + ';\n';
        return this.__base(path, suffix, res, force);
    },

    readContent: function(path, suffix) {
        return BEM.util.readDecl(path);
    },

    readLangContent: function(path, lang) {

        return this.readContent(path)
            .then(function(c) {
                var d = {};
                d[lang] = c;
                return d;
            });

    }

}));
