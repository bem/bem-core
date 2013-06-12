modules.define('test', ['i-bem'], function(provide, BEM) {

    BEM.decl('b-block', {});

    describe('i-bem', function() {

        describe('mods tests', function() {

            var block;

            beforeEach(function() {
                block = BEM.create({ block : 'b-block', mods : { mod1 : 'val1' }});
            });

            it('getMod should be valid', function() {
                block.getMod('mod1').should.to.equal('val1');
            });

            it('getMod after setMod should be equal setted val', function() {
                block.setMod('mod2', 'val2').getMod('mod2').should.to.equal('val2');
            });

            it('getMod of undefined mod should be \'\'', function() {
                block.getMod('mod2').should.to.equal('');
            });

            it('hasMod after setMod should be valid', function() {
                block.hasMod('mod1', 'val1').should.to.be.true;
                block.hasMod('mod1', 'val2').should.to.not.be.true;
            });

            it('short form hasMod after setMod should be valid', function() {
                block.hasMod('mod1').should.to.be.true;
                block.hasMod('mod2').should.to.not.be.true;
            });
        });
    });

    provide();
});
