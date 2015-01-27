module.exports = require('enb/lib/build-flow').create()
    .name('i18n-bemdecl')
    .target('target', '?.i18n.bemdecl.js')
    .builder(function() {
        var deps = [{ block : 'i-bem', elem : 'i18n' }];

        return 'exports.deps = ' + JSON.stringify(deps) + ';';
    })
    .createTech();
