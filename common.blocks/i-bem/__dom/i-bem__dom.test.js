modules.define('test', ['i-bem__dom'], function(provide, DOM) {

describe('i-bem__dom', function() {
    describe('getMod', function() {
        it('should return properly extracted mod from html', function() {
            DOM.decl('block', {});

            [
                {
                    cls : '',
                    val : ''
                },
                {
                    cls : 'block_m1_v1',
                    val : 'v1'
                },
                {
                    cls : 'block_m1_v1 bla-block_m1_v2',
                    val : 'v1'
                },
                {
                    cls  : 'bla-block_m1_v2 block_m1_v1',
                    val : 'v1'
                }
            ].forEach(function(data) {
                $('<div class="' + data.cls + '"/>').bem('block').getMod('m1')
                    .should.be.equal(data.val);
            });

            delete DOM.blocks['block'];
        });
    });

    describe('getMods', function() {
        it('should return properly extracted mods from html', function() {
            DOM.decl('block', {});

            [
                {
                    cls  : '',
                    mods : { js : 'inited' }
                },
                {
                    cls  : 'block_m1_v1',
                    mods : { js : 'inited', m1 : 'v1' }
                },
                {
                    cls  : 'block_m1_v1 block_m2_v2 bla-block_m4_v3 block_m4_v4',
                    mods : { js : 'inited', m1 : 'v1', m2 : 'v2', m4 : 'v4' }
                },
                {
                    cls  : 'bla-block_m1_v1 block_m2_v2 block_m3_v3 bla-block_m3_v4',
                    mods : { js : 'inited', m2 : 'v2', m3 : 'v3' }
                }
            ].forEach(function(data) {
                $('<div class="' + data.cls + '"/>').bem('block').getMods()
                    .should.be.eql(data.mods);
            });

            delete DOM.blocks['block'];
        });
    });
});

provide();

});
