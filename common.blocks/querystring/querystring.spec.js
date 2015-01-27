modules.define('spec', ['querystring'], function(provide, qs) {

describe('querystring', function() {
    describe('parse()', function() {
        it('should support the basics', function() {
            qs.parse('0=foo').should.eql({ '0' : 'foo' });
            qs.parse('foo').should.eql({ foo : '' });
            qs.parse('foo=bar').should.eql({ foo : 'bar' });
            qs.parse(' foo = bar = baz ').should.eql({ ' foo ' : ' bar = baz ' });
            qs.parse('foo=bar=baz').should.eql({ foo : 'bar=baz' });
            qs.parse('foo=bar&bar=baz').should.eql({ foo : 'bar', bar : 'baz' });
            qs.parse('foo=bar&baz').should.eql({ foo : 'bar', baz : '' });
            qs.parse('cht=p3&chd=t :60,40&chs=250x100&chl=Hello|World').should.eql({
                cht : 'p3',
                chd : 't :60,40',
                chs : '250x100',
                chl : 'Hello|World'
            });
            qs.parse('=').should.eql({ '' : '' });
            qs.parse('==').should.eql({ '' : '=' });
            qs.parse('_r=1&').should.eql({ _r : '1' });
        });

        it('should support encoded = signs', function() {
            qs.parse('he%3Dllo=th%3Dere').should.eql({ 'he=llo' : 'th=ere' });
        });

        it('should expand to an array when dupliate keys are present', function() {
            qs.parse('items=bar&items=baz&items=raz').should.eql({ items : ['bar', 'baz', 'raz'] });
            qs.parse('=&=').should.eql({ '' : ['', ''] });
        });

        it('should support empty values', function(){
            qs.parse('').should.eql({});
            qs.parse(undefined).should.eql({});
            qs.parse(null).should.eql({});
        });

        it('should support names of built-in Object properties', function() {
            /* jshint -W001 */
            qs.parse('hasOwnProperty=x&toString=foo&valueOf=bar&__defineGetter__=baz&constructor=1')
                .should.eql({
                    hasOwnProperty : 'x',
                    toString : 'foo',
                    valueOf : 'bar',
                    __defineGetter__ : 'baz',
                    constructor : '1'
                });
        });
    });

    describe('stringify()', function() {
        function test(cases) {
            cases.forEach(function(testCase) {
                qs.stringify(testCase.obj).should.eq(testCase.str);
            });
        }

        it('should support the basics', function() {
            /* jshint quotmark: false */
            test([
                { str : 'foo=bar', obj : { 'foo' : 'bar' } },
                { str : 'foo=%22bar%22', obj : { 'foo' : '\"bar\"' } },
                { str : 'foo=', obj : { 'foo' : '' } },
                { str : 'foo=1&bar=2', obj : { 'foo' : '1', 'bar' : '2' } },
                {
                    str : 'my%20weird%20field=q1!2%22\'w%245%267%2Fz8)%3F',
                    obj : { 'my weird field' : 'q1!2"\'w$5&7/z8)?' }
                },
                { str : 'foo%3Dbaz=bar', obj : { 'foo=baz' : 'bar' } },
                { str : 'foo=bar&bar=baz', obj : { foo : 'bar', bar : 'baz' } },
                { str : 'foo=bar&baz=&raz=', obj : { foo : 'bar', baz : null, raz : undefined } },
                { str : 'foo=bar&=', obj : { foo : 'bar', '' : '' } }
            ]);
        });

        it('should support escapes', function() {
            test([
                { str : 'foo=foo%20bar', obj : { foo : 'foo bar' } },
                {
                    str : 'cht=p3&chd=t%3A60%2C40&chs=250x100&chl=Hello%7CWorld',
                    obj : {
                        cht : 'p3',
                        chd : 't:60,40',
                        chs : '250x100',
                        chl : 'Hello|World'
                    }
                }
            ]);
        });

        it('should support arrays', function() {
            test([
                { str : 'limit=1&limit=2&limit=a', obj : { limit : [1, 2, 'a'] } }
            ]);
        });

        it('should support others types', function() {
            var date = new Date(0);

            test([
                { str : 'at=' + encodeURIComponent(date), obj : { at : date } }
            ]);
        });

        it('should support names of built-in Object properties', function() {
            /* jshint -W001 */
            test([
                {
                    str : 'hasOwnProperty=x&toString=foo&valueOf=bar&__defineGetter__=baz&constructor=1',
                    obj : {
                        hasOwnProperty : 'x',
                        toString : 'foo',
                        valueOf : 'bar',
                        __defineGetter__ : 'baz',
                        constructor : '1'
                    }
                }
            ]);
        });
    });
});

provide();

});
