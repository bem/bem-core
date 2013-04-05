BEM.TEST.decl({ block : 'i-ecma', elem : 'object' }, function(undefined) {

    describe('keys specs', function() {
        [
            { data : {}, res : [] },
            { data : { a : 1, b : 2, c : 2, d : undefined }, res : ['a', 'b', 'c', 'd'] }
        ].forEach(function(test) {
            it('should be correct result', function() {
                expect(Object.keys(test.data)).toEqual(test.res);
            });
        });
    });

});