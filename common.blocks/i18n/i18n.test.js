import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import i18nModule from './i18n.i18n.js';

var init = i18nModule.i18n.i18n;

describe('i18n', function() {
    var i18n;

    beforeEach(function () {
        i18n = init();

        i18n.decl({
            'keyset1' : {
                'key1' : 'keyset1 key1 string',
                'key2' : function(params) {
                    return 'keyset1 key2 function ' + JSON.stringify(params);
                },
                'key3' : function(params) {
                    return 'keyset1 key3 ' + this('keyset1', 'key2', params);
                }
            }
        });
    });

    it('should throw exception without data', function() {
        var empty = init();
        assert.throws(function() { empty('keyset1', 'key1'); }, Error);
    });

    it('should return "keyset:key" if they do not exist in data', function() {
        assert.equal(i18n('undefkeyset', 'undefkey'), 'undefkeyset:undefkey');
        assert.equal(i18n('keyset1', 'undefkey'), 'keyset1:undefkey');
    });

    it('should return string value', function() {
        assert.equal(i18n('keyset1', 'key1'), 'keyset1 key1 string');
    });

    it('should return value as function result', function() {
        assert.equal(i18n('keyset1', 'key2', { a : '1' }), 'keyset1 key2 function {"a":"1"}');
    });

    it('should properly call another i18n items', function() {
        assert.equal(i18n('keyset1', 'key3', { b : '2' }), 'keyset1 key3 keyset1 key2 function {"b":"2"}');
    });

    it('should properly extend existed data', function() {
        i18n.decl({
            'keyset1' : {
                'key0' : 'keyset1 key0 string',
                'key1' : 'keyset1 key1 new string'
            },
            'keyset2' : {
                'key1' : 'keyset2 key1 string'
            }
        });

        assert.equal(i18n('keyset1', 'key0'), 'keyset1 key0 string');
        assert.equal(i18n('keyset1', 'key1'), 'keyset1 key1 new string');
        assert.equal(i18n('keyset1', 'key2', { a : '1' }), 'keyset1 key2 function {"a":"1"}');
        assert.equal(i18n('keyset2', 'key1'), 'keyset2 key1 string');
    });
});
