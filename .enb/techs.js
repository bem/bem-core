module.exports = {
    files : {
        provide : require('enb/techs/file-provider'),
        copy : require('enb/techs/file-copy'),
        merge : require('enb/techs/file-merge')
    },
    bem : require('enb-bem-techs'),
    css : require('enb/techs/css'),
    js : require('enb/techs/js'),
    ym : require('enb-modules/techs/prepend-modules'),
    engines : {
        bemhtml : require('enb-bemxjst/techs/bemhtml'),
        bemtree : require('enb-bemxjst/techs/bemtree'),
        bhCommonJS : require('enb-bh/techs/bh-commonjs'),
        bhBundle : require('enb-bh/techs/bh-bundle')
    },
    html : {
        bemhtml : require('enb-bemxjst/techs/bemjson-to-html'),
        bemtree : require('./techs/html-from-bemtree'),
        bh : require('enb-bh/techs/bemjson-to-html')
    },
    borschik : require('enb-borschik/techs/borschik')
};
