var TANKER = require('./tanker');

exports.serializeAllData = function(data, langs, defaultLang) {

    var res = ['all'].concat(langs || [])
        .reduce(function(res, lang) {
            return res.concat(exports.serializeData(data[lang] || {}, lang));
        }, []);

    return res.concat([exports.serializeInit(defaultLang)]);

};

exports.serializeData = function(data, lang) {

    var res = [];

    Object.keys(data).sort().forEach(function(keyset) {

        // output value of empty keyset as a simple js code
        if (keyset === '') {
            res.push(data[keyset]);
            return;
        }

        // generate i18n declaration for normal keysets
        res.push("\nBEM.I18N.decl('" + keyset + "', {");

        Object.keys(data[keyset]).forEach(function(key, i, arr) {

            TANKER.xmlToJs(data[keyset][key], function(js) {
                res.push(JSON.stringify(key) + ': ' + js + (i === arr.length - 1 ? '' : ','));
            });

        });

        res.push('}, {\n"lang": "' + lang + '"\n});\n');

    });

    return res;

};

exports.serializeInit = function(lang) {
    return "\nBEM.I18N.lang('" + lang + "');\n";
};
