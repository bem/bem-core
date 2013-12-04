modules.define('spec', function(provide) {

describe('ecma__string', function() {
    describe('trim', function() {
        [
            { data : ' trim ', res : 'trim' },
            { data : ' trim', res : 'trim' },
            { data : 'trim ', res : 'trim' }
        ].forEach(function(test) {
            it('should be correct result', function() {
                test.data.trim().should.to.equal(test.res);
            });
        });
    });
});

provide();

});
