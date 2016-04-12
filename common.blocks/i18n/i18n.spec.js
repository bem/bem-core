modules.define('spec', ['i18n'], function(provide, i18n) {

describe('i18n', function() {
    it('should return "keyset:key" if it does not exist in data', function() {
        i18n('undefkeyset', 'undefkey').should.be.equal('undefkeyset:undefkey');
        i18n('keyset1', 'undefkey').should.be.equal('keyset1:undefkey');
    });
});

provide();

});
