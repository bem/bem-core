/* jshint node:true */
/* global suite, setup, teardown, test */

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    vm = require('vm');

suite('Regression tests', function() {
    test('"console" is undefined', function() {
        assert.doesNotThrow(function() {
            vm.runInNewContext(
                fs.readFileSync(path.resolve(__dirname, '../i-bem__i18n.i18n/core.js')));
        });
    });

    test('"console.log" is undefined', function() {
        assert.doesNotThrow(function() {
            vm.runInNewContext(
                fs.readFileSync(path.resolve(__dirname, '../i-bem__i18n.i18n/core.js')), {
                    console : {}
                });
        });
    });

    test('"console.log" is not inherited from Function.prototype (IE9 regression)', function() {
        assert.doesNotThrow(function() {
            vm.runInNewContext(
                fs.readFileSync(path.resolve(__dirname, '../i-bem__i18n.i18n/core.js')), {
                    console : { log : {} }
                });
        });
    });
});
