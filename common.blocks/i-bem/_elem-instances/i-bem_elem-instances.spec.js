modules.define('spec', ['i-bem', 'sinon'], function(provide, BEM, sinon) {

describe('i-bem_elem-instances', function() {
    describe('decl', function() {
        it('should return element', function() {
            var block = BEM.decl({ block : 'block', elem : 'elem' }, {});
            block.should.be.equal(BEM.blocks['block__elem']);
            delete BEM.blocks['block__elem'];
        });

        it('with mod should apply method only if element has mod', function() {
            var baseMethodSpy = sinon.spy(),
                modsMethodSpy = sinon.spy();

            BEM.decl({ block : 'block', elem : 'elem' }, {
                method : baseMethodSpy
            });
            BEM.decl({ block : 'block', elem : 'elem', modName : 'mod1', modVal : 'val1' }, {
                method : modsMethodSpy
            });

            var instance = BEM.create({ block : 'block', elem : 'elem', mods : { 'mod1' : 'val1' } });

            instance.method();
            baseMethodSpy.called.should.be.false;
            modsMethodSpy.called.should.be.true;

            instance.setMod('mod1', 'val2');
            instance.method();
            baseMethodSpy.called.should.be.true;
            modsMethodSpy.callCount.should.be.equal(1);

            delete BEM.blocks['block__elem'];
        });

        it('should declare element by block properly', function() {
            var Block = BEM.decl('block'),
                Elem = Block.decl({ elem : 'elem' });

            Elem.getName().should.be.equal('block__elem');

            delete BEM.blocks['block'];
            BEM.blocks['block__elem']?
                delete BEM.blocks['block__elem'] :
                delete BEM.blocks['undefined__elem'];
        });
    });

    describe('create', function() {
        it('should return instance of element', function() {
            var elem = BEM.decl({ block : 'block', elem : 'elem' }, {}),
                instance = BEM.create({ block : 'block', elem : 'elem' });

            instance.should.be.instanceOf(elem);
            delete BEM.blocks['block__elem'];
        });
    });

    describe('getName', function() {
        it('should return correct full and short names of element', function() {
            var elem = BEM.decl({ block : 'block', elem : 'elem' }, {});

            elem.getName().should.be.equal('block__elem');
            elem.getName(true).should.be.equal('elem');

            delete BEM.blocks['block__elem'];
        });
    });
});

provide();

});
