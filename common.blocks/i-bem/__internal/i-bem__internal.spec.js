modules.define('spec', ['i-bem__internal'], function(provide, bemInternal) {

describe('i-bem__internal', function() {
    describe('buildClassName', function() {
        [
            {
                title : 'block class name should be valid',
                input : ['b-foo'],
                output : 'b-foo'
            },
            {
                title : 'elem class name should be valid',
                input : ['b-foo', 'elem'],
                output : 'b-foo__elem'
            },
            {
                title : 'block with mod class name should be valid',
                input : ['b-foo', 'mod1', 'val1'],
                output : 'b-foo_mod1_val1'
            },
            {
                title : 'block with number mod class name should be valid',
                input : ['b-foo', 'mod1', 5],
                output : 'b-foo_mod1_5'
            },
            {
                title : 'block with zero number mod class name should be valid',
                input : ['b-foo', 'mod1', 0],
                output : 'b-foo_mod1_0'
            },
            {
                title : 'block with undefined elem mod class name should be valid',
                input : ['b-foo', undefined, 'mod1', 'val1'],
                output : 'b-foo_mod1_val1'
            },
            {
                title : 'block with truly boolean mod class name should be valid',
                input : ['b-foo', 'mod1', true],
                output : 'b-foo_mod1'
            },
            {
                title : 'block with falsy boolean mod class name should be valid',
                input : ['b-foo', 'mod1', false],
                output : 'b-foo'
            },
            {
                title : 'elem with mod class name should be valid',
                input : ['b-foo', 'elem', 'mod1', 'val1'],
                output : 'b-foo__elem_mod1_val1'
            },
            {
                title : 'elem with number mod class name should be valid',
                input : ['b-foo', 'elem', 'mod1', 3],
                output : 'b-foo__elem_mod1_3'
            },
            {
                title : 'elem with zero number mod class name should be valid',
                input : ['b-foo', 'elem', 'mod1', 0],
                output : 'b-foo__elem_mod1_0'
            },
            {
                title : 'elem with truly boolean mod class name should be valid',
                input : ['b-foo', 'elem', 'mod1', true],
                output : 'b-foo__elem_mod1'
            },
            {
                title : 'elem with falsy boolean mod class name should be valid',
                input : ['b-foo', 'elem', 'mod1', false],
                output : 'b-foo__elem'
            }
        ].forEach(function(spec) {
            it(spec.title, function() {
                bemInternal.buildClassName.apply(bemInternal, spec.input).should.to.equal(spec.output);
            });
        });
    });

    describe('buildClassNames', function() {
        [
            {
                title : 'block class names should be valid',
                input : ['b-foo'],
                output : 'b-foo'
            },
            {
                title : 'elem class names should be valid',
                input : ['b-foo', 'elem'],
                output : 'b-foo__elem'
            },
            {
                title : 'block with mods class name should be valid',
                input : ['b-foo', { mod1 : 'val1', mod2 : 'val2', mod3 : true, mod4 : false }],
                output : 'b-foo b-foo_mod1_val1 b-foo_mod2_val2 b-foo_mod3'
            },
            {
                title : 'block with undefined elem and mods class name should be valid',
                input : ['b-foo', undefined, { mod1 : 'val1', mod2 : 'val2', mod3 : true, mod4 : false }],
                output : 'b-foo b-foo_mod1_val1 b-foo_mod2_val2 b-foo_mod3'
            },
            {
                title : 'elem with mods class name should be valid',
                input : ['b-foo', 'elem', { mod1 : 'val1', mod2 : 'val2', mod3 : true, mod4 : false }],
                output : 'b-foo__elem b-foo__elem_mod1_val1 b-foo__elem_mod2_val2 b-foo__elem_mod3'
            }
        ].forEach(function(spec) {
            it(spec.title, function() {
                bemInternal.buildClassNames.apply(bemInternal, spec.input).should.to.equal(spec.output);
            });
        });
    });
});

provide();

});
