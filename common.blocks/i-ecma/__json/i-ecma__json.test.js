BEM.TEST.decl({ block : 'i-ecma', elem : 'json' }, function() {

    describe('stringify specs', function() {
        it('undefined should be stringified to undefined', function() {
            expect(JSON.stringify(undefined)).toBeUndefined();
        });

        [
            { spec : 'null should be stringified to "null"', input : null, output : 'null' },
            { spec : 'string should be stringified correctly', input : 'test', output : '"test"' },
            { spec : 'number should be stringified correctly', input : 4, output : '4' },
            { spec : 'boolean should be stringified correctly', input : true, output : 'true' },
            { spec : 'array should be stringified correctly', input : [1, null, undefined, "2", true], output : '[1,null,null,"2",true]' },
            { spec : 'object should be stringified correctly', input : { 4 : true, a : 1, "a-b" : "true", un : undefined }, output : '{"4":true,"a":1,"a-b":"true"}' },
            { spec : 'complex object should be stringified correctly', input : { a : 1, b : [{ a : 3 }, { d : true, e : [] }]}, output : '{"a":1,"b":[{"a":3},{"d":true,"e":[]}]}' },
            { spec : 'backslashes should be escaped', input : { '0': { url: 'file:C:\\image.png', title: 'file:C:\\image.png' } }, output : '{"0":{"url":"file:C:\\\\image.png","title":"file:C:\\\\image.png"}}' },
            { spec : 'toJSON should be applied', input : { a : 'a', b : { toJSON : function() { return { c : "c" }}, d : 'd' }}, output : '{"a":"a","b":{"c":"c"}}' }
        ].forEach(function(params) {
            it(params.spec, function() {
                expect(JSON.stringify(params.input)).toEqual(params.output);
            });
        });
    });

});
