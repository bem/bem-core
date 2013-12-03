modules.define('spec', ['next-tick'], function(provide, nextTick) {

describe('next-tick', function() {
    it('should call callback asynchronously', function(done) {
        var isSync = true;
        nextTick(function() {
            isSync.should.be.false;
            done();
        });
        isSync = false;
    });

    it('should call callbacks in the order of their originating calls', function(done) {
        var order = [];
        nextTick(function() { order.push(1); });
        nextTick(function() { order.push(2); });
        nextTick(function() { order.push(3); });
        nextTick(function() {
            order.should.be.eql([1, 2, 3]);
            done();
        });
    });
});

provide();

});
