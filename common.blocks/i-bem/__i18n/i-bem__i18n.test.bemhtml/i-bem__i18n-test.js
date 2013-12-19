/* jshint node:true */
/* global suite, test */

var ASSERT = require('assert'),
    FS = require('fs'),
    PATH = require('path'),
    BEMHTML = require('bem-xjst/lib/bemhtml'),
    resolve = PATH.resolve.bind(null, __dirname),
    cores = [
            '../_dummy/i-bem__i18n_dummy_yes.bemhtml',
            '../../i-bem.bemhtml',
            '../i-bem__i18n.bemhtml'
        ].map(function(path) {
            return FS.readFileSync(resolve(path), 'utf8').toString();
        });

suite('Tests for BEM.I18N API for BEMHTML', function() {

    function readFile(src) {
        return FS.readFileSync(resolve('files', src), 'utf8').toString();
    }

    function unit(name, file, options) {
        test(name, function() {
            options || (options = {});

            var raw = options.raw,
                contents = {
                    src : readFile(file + '.bemhtml'),
                    data : JSON.parse(readFile(file + '.json')),
                    dst : readFile(file + '.html')
                },
                iBemI18nData = options.dummy? '' :
                    FS.readFileSync(resolve('../i-bem__i18n.i18n/core.js'), 'utf8').toString();

            ASSERT.equal(BEMHTML.compile(cores.join('') + iBemI18nData + contents.src, {
                    devMode : true,
                    raw : raw
                }).apply.call(contents.data) + '\n', contents.dst);

            ASSERT.equal(BEMHTML.compile(cores.join('') + iBemI18nData + contents.src, {
                    devMode : false,
                    raw : raw
                }).apply.call(contents.data) + '\n', contents.dst);
        });
    }

    suite('Tests for BEM.I18N stub', function() {
        unit('BEM.I18N', 'bem-i18n', { dummy : true });
        unit('BEM.I18N.lang', 'lang', { dummy : true });
        unit('BEM.I18N api', 'api', { dummy : true });
        unit('BEM.I18N from BEMJSON data', 'bemjson', { dummy : true });
        unit('BEM.I18N from BEMJSON \\w nested calls', 'bemjson-nested-dummy', { dummy : true });
    });

    suite('Test for BEM.I18N core', function() {
        unit('BEM.I18N from BEMJSON \\w nested calls', 'bemjson-nested');
    });

});
