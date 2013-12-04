modules.define('spec', ['sinon'], function(provide, sinon) {

describe('ecma__function', function() {
    describe('bind', function() {
        it('should be called with bound context', function() {
            var ctx = {},
                expectedCtx,
                fn = (function() { expectedCtx = this; }).bind(ctx);

            fn();

            expectedCtx.should.to.equal(ctx);
        });

        it('should be called with original and bound params', function() {
           var ctx = {},
               spy = sinon.spy(),
               fn = spy.bind(ctx, 1, 2);

           fn(3, 4);

           spy.lastCall.calledWith(1, 2, 3, 4).should.to.be.true;
       });
    });
});

provide();

});
