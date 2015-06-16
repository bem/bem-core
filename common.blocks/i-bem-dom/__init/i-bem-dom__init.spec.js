modules.define('spec', ['i-bem'], function(provide, bem) {

describe('i-bem-dom__init', function() {
    it('block should exist on init', function(done) {
        var name = 'b' + Math.random();

        modules.define(name, ['i-bem-dom'], function(provide, bemDom) {
            provide(bemDom.declBlock(this.name, {}));
        });

        modules.require(['i-bem-dom__init'], function() {
            bem.entities.should.have.property(name);
            done();
        });
    });
});

provide();

});
