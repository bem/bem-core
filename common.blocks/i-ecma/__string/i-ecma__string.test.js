BEM.TEST.decl({ block : 'i-ecma', elem : 'string' }, function() {

    describe('trim specs', function() {
        [
            { data : ' trim ', res : 'trim' },
            { data : ' trim', res : 'trim' },
            { data : 'trim ', res : 'trim' }
        ].forEach(function(test) {
            it('should be correct result', function() {
                expect(test.data.trim()).toEqual(test.res);
            });
        });
    });

});