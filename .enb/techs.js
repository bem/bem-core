module.exports = {
    files : {
        provide : require('enb/techs/file-provider'),
        copy : require('enb/techs/file-copy'),
        merge : require('enb/techs/file-merge'),
        write : require('enb/techs/write-file')
    },
    bem : require('enb-bem-techs'),
    css : require('enb-css/techs/css'),
    browserJS : require('enb-js/techs/browser-js'),
    i18n : {
        keysets : require('enb-bem-i18n/techs/keysets'),
        js : require('enb-bem-i18n/techs/i18n')
    },
    engines : {
        bemhtml : require('enb-bemxjst/techs/bemhtml'),
        bhCommonJS : require('enb-bh/techs/bh-commonjs'),
        bhBundle : require('enb-bh/techs/bh-bundle'),

        bemhtmlI18N : require('enb-bemxjst-i18n/techs/bemhtml-i18n'),
        bhCommonJSI18N : require('enb-bh-i18n/techs/bh-commonjs-i18n')
    },
    html : {
        bemhtml : require('enb-bemxjst/techs/bemjson-to-html'),
        bh : require('enb-bh/techs/bemjson-to-html')
    },
    borschik : require('enb-borschik/techs/borschik')
};
