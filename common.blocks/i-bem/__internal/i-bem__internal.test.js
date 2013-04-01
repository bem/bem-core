BEM.TEST.decl({ block : 'i-bem', elem : 'internal' }, function() {

    describe('buildClass method tests', function() {
        $.each({
            'block class should be valid' : {
                    input : ['b-foo'],
                    output : 'b-foo'
                },
            'elem class should be valid' : { input : ['b-foo', 'elem'], output : 'b-foo__elem' },
            'block with mod class should be valid' : {
                    input : ['b-foo', 'mod1', 'val1'],
                    output : 'b-foo_mod1_val1'
                },
            'block  with undefined elem mod class should be valid' : {
                    input : ['b-foo', undefined, 'mod1', 'val1'],
                    output : 'b-foo_mod1_val1'
                },
            'elem with mod class should be valid' : {
                    input : ['b-foo', 'elem', 'mod1', 'val1'],
                    output : 'b-foo__elem_mod1_val1'
                }
            }, function(name, params) {
                it(name, function() {
                    expect(BEM.INTERNAL.buildClass.apply(BEM.INTERNAL, params.input)).toEqual(params.output);
                });
            });
    });

    describe('buildClasses method tests', function() {
        $.each({
            'block classes should be valid' : {
                    input : ['b-foo'],
                    output : 'b-foo'
                },
            'elem classes should be valid' : {
                    input : ['b-foo', 'elem'],
                    output : 'b-foo__elem'
                },
            'block with mods class should be valid' : {
                    input : ['b-foo', { mod1 : 'val1', mod2 : 'val2' }],
                    output : 'b-foo b-foo_mod1_val1 b-foo_mod2_val2'
                },
            'block with undefined elem and mods class should be valid' : {
                    input : ['b-foo', undefined, { mod1 : 'val1', mod2 : 'val2' }],
                    output : 'b-foo b-foo_mod1_val1 b-foo_mod2_val2'
                },
            'elem with mods class should be valid' : {
                    input : ['b-foo', 'elem', { mod1 : 'val1', mod2 : 'val2' }],
                    output : 'b-foo__elem b-foo__elem_mod1_val1 b-foo__elem_mod2_val2'
                }
            }, function(name, params) {
                it(name, function() {
                    expect(BEM.INTERNAL.buildClasses.apply(BEM.INTERNAL, params.input)).toEqual(params.output);
                });
            });
    });

});