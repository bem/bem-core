modules.define(
    'spec',
    ['i-bem', 'i-bem-dom'],
    function(provide, BEM, BEMDOM) {

describe('i-bem-dom__init', function() {
    it('block should exist on init', function(done) {
        var name = 'b' + Math.random();

        modules.define(name, ['i-bem-dom'], function(provide, BEMDOM) {
            provide(BEMDOM.declBlock(this.name, {}));
        });

        modules.require(['i-bem-dom__init'], function() {
            BEM.blocks.should.have.property(name);
            done();
        });
    });
});

provide();

});
