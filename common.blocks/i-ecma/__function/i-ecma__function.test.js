BEM.TEST.decl({ block : 'i-ecma', elem : 'function' }, function() {

    describe('bind specs', function() {
        it('should be called with bound context', function() {
            var ctx = {},
                expectedCtx,
                fn = (function() { expectedCtx = this; }).bind(ctx);

            fn();

            expect(expectedCtx).toBe(ctx);
        });

        it('should be called with original and bound params', function() {
           var ctx = {},
               spy = jasmine.createSpy(),
               fn = spy.bind(ctx, 1, 2);

           fn(3, 4);

           expect(spy.mostRecentCall.args).toEqual([1, 2, 3, 4]);
       });
    });

});