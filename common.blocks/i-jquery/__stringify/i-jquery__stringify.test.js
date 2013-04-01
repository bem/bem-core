BEM.TEST.decl({ block : 'i-jquery', elem : 'stringify' }, function() {

    it('undefined should be stringified to undefined', function() {
        expect($.stringify(undefined)).toBeUndefined();
    });

    $.each({
        'null should be stringified to "null"' : { input : null, output : 'null' },
        'string should be stringified correctly' : { input : 'test', output : '"test"' },
        'number should be stringified correctly' : { input : 4, output : '4' },
        'boolean should be stringified correctly' : { input : true, output : 'true' },
        'array should be stringified correctly' : {
                input : [1, null, undefined, "2", true],
                output : '[1,null,null,"2",true]'
            },
        'object should be stringified correctly' : {
                input : { a : 1,  "a-b" : "true", 4 : true, un : undefined },
                output : '{"a":1,"a-b":"true","4":true}'
            },
        'complex object should be stringified correctly' : {
                input : { a : 1, b : [{ a : 3 }, { d : true, e : [] }]},
                output : '{"a":1,"b":[{"a":3},{"d":true,"e":[]}]}'
            }
        }, function(name, params) {
            it(name, function() {
                expect($.stringify(params.input)).toEqual(params.output);
            });
        });

});