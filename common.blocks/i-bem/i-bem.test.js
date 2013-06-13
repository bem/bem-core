modules.define('test', ['i-bem'], function(provide, BEM) {

describe('i-bem', function() {
    describe('decl', function() {
        it('should return block', function() {
            var block = BEM.decl('block', {});
            block.should.be.equal(BEM.blocks['block']);
            delete BEM.blocks['block'];
        });
    });

    describe('create', function() {
        it('should return instance of block', function() {
            var block = BEM.decl('block', {}),
                instance = BEM.create('block');

            instance.should.be.instanceOf(block);
            delete BEM.blocks['block'];
        });
    });

    describe('mods', function() {
        var block;
        beforeEach(function() {
            BEM.decl('block', {});
            block = BEM.create({ block : 'block', mods : { mod1 : 'val1' }});
        });
        afterEach(function() {
            delete BEM.blocks['block'];
        });

        describe('getMod', function() {
            it('should return current mod\'s value', function() {
                block.getMod('mod1').should.be.equal('val1');
            });

            it('should return \'\' for undefined mod', function() {
                block.getMod('mod2').should.be.equal('');
            });
        });

        describe('setMod', function() {
            it('should update mod value', function() {
                block
                    .setMod('mod1', 'val2')
                    .getMod('mod1')
                        .should.be.equal('val2');
            });
        });

        describe('delMod', function() {
            it('should set mod\'s value to \'\'', function() {
                block
                    .delMod('mod1')
                    .getMod('mod1')
                        .should.be.equal('');
            });
        });

        describe('hasMod', function() {
            it('should return true for matching mod\'s value', function() {
                block.hasMod('mod1', 'val1').should.be.true;
            });

            it('should return false for non-matching mod\'s value', function() {
                block.hasMod('mod1', 'val2').should.be.false;
            });

            it('should return false for undefined mod\'s value', function() {
                block.hasMod('mod2', 'val2').should.be.false;
            });

            it('in short form should return true for non-empty mod\'s value', function() {
                block.hasMod('mod1').should.be.true;
            });

            it('in short form should return true for empty mod\'s value', function() {
                block
                    .setMod('mod1', '')
                    .hasMod('mod1')
                        .should.be.false;
            });

            it('in short form should return true for undefined mod', function() {
                block.hasMod('mod2').should.be.false;
            });
        });

        describe('toggleMod', function() {
            it('should switch mod\'s values', function() {
                block
                    .toggleMod('mod1', 'val1', 'val2')
                    .hasMod('mod1', 'val2')
                        .should.be.true;

                block
                    .toggleMod('mod1', 'val1', 'val2')
                    .hasMod('mod1', 'val1')
                        .should.be.true;
            });

            it('should switch mod\'s values according to "condition" param', function() {
                block
                    .toggleMod('mod1', 'val1', 'val2', true)
                    .hasMod('mod1', 'val1')
                        .should.be.true;

                block
                    .toggleMod('mod1', 'val1', 'val2', false)
                    .hasMod('mod1', 'val2')
                        .should.be.true;
            });
        });
    });
});

provide();

});
