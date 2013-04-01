BEM.TEST.decl('i-bem', function() {

    BEM.decl('b-block', {});

    describe('mods tests', function() {

        var block;

        beforeEach(function() {
            block = BEM.create({ block : 'b-block', mods : { mod1 : 'val1' }});
        });

        it('getMod should be valid', function() {
            expect(block.getMod('mod1')).toEqual('val1');
        });

        it('getMod after setMod should be equal setted val', function() {
            expect(block.setMod('mod2', 'val2').getMod('mod2')).toEqual('val2');
        });

        it('getMod of undefined mod should be \'\'', function() {
            expect(block.getMod('mod2')).toBe('');
        });

        it('hasMod after setMod should be valid', function() {
            expect(block.hasMod('mod1', 'val1')).toBeTruthy();
            expect(block.hasMod('mod1', 'val2')).toBeFalsy();
        });

        it('short form hasMod after setMod should be valid', function() {
            expect(block.hasMod('mod1')).toBeTruthy();
            expect(block.hasMod('mod2')).toBeFalsy();
        });

    });

});