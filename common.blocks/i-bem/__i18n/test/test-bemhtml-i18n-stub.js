var ASSERT = require('assert'),
    FS = require('fs'),
    PATH = require('path'),
    BEMHTML = require('../../../../.bem/lib/bemhtml'),

    resolve = PATH.resolve.bind(null, __dirname),

    icores = [
            '../_dummy/i-bem__i18n_dummy_yes.bemhtml',
            '../../__html/i-bem__html.bemhtml',
            '../i-bem__i18n.bemhtml'
        ].map(function(path) {
            return FS.readFileSync(resolve(path)).toString();
        });

suite('Tests for BEM.I18N API stub for BEMHTML', function() {

    function readFile(src) {
        return FS.readFileSync(resolve('files', src), 'utf-8').toString();
    }

    function unit(name, file, raw) {
        test(name, function() {
            var contents = {
                src: readFile(file + '.bemhtml'),
                data: JSON.parse(readFile(file + '.json')),
                dst: readFile(file + '.html')
            };

            ASSERT.equal(BEMHTML.compile(icores.join('') + contents.src, {
                    devMode: true,
                    raw: raw
                }).apply.call(contents.data) + '\n', contents.dst);

            ASSERT.equal(BEMHTML.compile(icores.join('') + contents.src, {
                    devMode: false,
                    raw: raw
                }).apply.call(contents.data) + '\n', contents.dst);
        });
    }

    unit('BEM.I18N', 'bem-i18n');
    unit('BEM.I18N.lang', 'bem-i18n-lang');
    unit('BEM.I18N api', 'bem-i18n-api');
    unit('BEM.I18N from BEMJSON data', 'bem-i18n-bemjson');

});
