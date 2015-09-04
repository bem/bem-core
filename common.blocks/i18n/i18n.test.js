require('chai').should();

var init = require('./i18n.i18n.js').i18n.i18n;

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
        var i18n = init();

        i18n.bind(i18n, 'keyset1', 'key1').should.throw(Error);
    });

    it('should return "keyset:key" if they do not exist in data', function() {
        i18n('undefkeyset', 'undefkey').should.be.equal('undefkeyset:undefkey');
        i18n('keyset1', 'undefkey').should.be.equal('keyset1:undefkey');
    });

    it('should return string value', function() {
        i18n('keyset1', 'key1').should.be.equal('keyset1 key1 string');
    });

    it('should return value as function result', function() {
        i18n('keyset1', 'key2', { a : '1' }).should.be.equal('keyset1 key2 function {"a":"1"}');
    });

    it('should properly call another i18n items', function() {
        i18n('keyset1', 'key3', { b : '2' }).should.be.equal('keyset1 key3 keyset1 key2 function {"b":"2"}');
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

        i18n('keyset1', 'key0').should.be.equal('keyset1 key0 string');
        i18n('keyset1', 'key1').should.be.equal('keyset1 key1 new string');
        i18n('keyset1', 'key2', { a : '1' }).should.be.equal('keyset1 key2 function {"a":"1"}');
        i18n('keyset2', 'key1').should.be.equal('keyset2 key1 string');
    });
});
