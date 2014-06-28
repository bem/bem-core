/* jshint node:true */
var TANKER = require('./tanker');

exports.serializeAllData = function(data, langs, defaultLang) {

    var res = ['all'].concat(langs || [])
        .reduce(function(res, lang) {
            return res.concat(exports.serializeData(data[lang] || {}, lang));
        }, []);

    return res.concat([exports.serializeInit(defaultLang)]);

};

var wrapLangDecl = function(declArr) {
    if(!declArr.length) return '';

    return [
        '(function() {',
        '    var hasModules = typeof modules === \'object\',',
        '        decls = function(i18nObj) {',
        declArr.join('\n'),
        '\n        }',
        'hasModules ? modules.define(\'i-bem__i18n\', function(provide, I18N) {',
        '    decls(I18N);',
        '    provide(I18N);',
        '}) : decls(BEM.I18N);',
        '})();'
    ].join('\n');
};

exports.serializeData = function(data, lang) {
    var buffer = [],
        commonI18nCode;

    Object.keys(data).sort().forEach(function(keyset, idx) {

        // output value of empty keyset as a simple js code
        if(keyset === '') {
            commonI18nCode = data[keyset];
            return;
        }

        // generate i18n declaration for normal keysets
        buffer.push('\n            i18nObj.decl(\'' + keyset + '\', {');

        Object.keys(data[keyset]).forEach(function(key, i, arr) {

            TANKER.xmlToJs(data[keyset][key], function(js) {
                buffer.push([
                    '                ',
                    JSON.stringify(key),
                    ': ',
                    js,
                    (i === arr.length - 1? '' : ',')
                ].join(''));
            });

        });

        buffer.push([
            '            }, {',
            '                "lang": "' + lang + '"',
            '            });'
        ].join('\n'));

    });

    return [
        commonI18nCode,
        wrapLangDecl(buffer)
    ];
};

exports.serializeInit = function(lang) {
    return [
        '\ntypeof modules === \'object\' ? modules.define(\'i-bem__i18n\', function(provide, I18N) {',
        '    I18N.lang(\'' + lang + '\');',
        '    provide(I18N);',
        '}) : BEM.I18N.lang(\'' + lang + '\');'
    ].join('\n');
};
