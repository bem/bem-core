modules.define('spec', function(provide) {

describe('ecma__object', function() {
    describe('keys', function() {
        [
            { data : {}, res : [] },
            { data : { a : 1, b : 2, c : 2, d : undefined }, res : ['a', 'b', 'c', 'd'] }
        ].forEach(function(test) {
            it('should be correct result', function() {
                Object.keys(test.data).should.to.eql(test.res);
            });
        });
    });
});

provide();

});
