modules.define('test', ['i-bem', 'sinon'], function(provide, BEM, sinon) {

describe('i-bem_elems_yes', function() {
    describe('decl', function() {
        it('should return element\'s instance', function() {
            var block = BEM.decl({ block: 'block', elem: 'elem' }, {});
            block.should.be.equal(BEM.blocks['block__elem']);
            delete BEM.blocks['block__elem'];
        });

        it('with mod should apply method only if element\'s instance has mod', function() {
            var baseMethodSpy = sinon.spy(),
                modsMethodSpy = sinon.spy();

            BEM.decl({ block: 'block', elem: 'elem' }, {
                method : baseMethodSpy
            });
            BEM.decl({ block: 'block', elem: 'elem', modName: 'mod1', modVal: 'val1' }, {
                method : modsMethodSpy
            });

            var instance = BEM.create({ block : 'block', elem: 'elem', mods : { 'mod1' : 'val1' }});

            instance.method();
            baseMethodSpy.called.should.be.false;
            modsMethodSpy.called.should.be.true;

            instance.setMod('mod1', 'val2');
            instance.method();
            baseMethodSpy.called.should.be.true;
            modsMethodSpy.callCount.should.be.equal(1);

            delete BEM.blocks['block__elem'];
        });
    });
});

provide();

});