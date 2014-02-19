modules.define('spec', ['tick', 'sinon'], function(provide, tick, sinon) {

describe('tick', function() {
    describe('start/stop', function() {
        it('should emit tick event only if started', function(done) {
            var TICK_INTERVAL = 50,
                spy = sinon.spy();

            tick
                .on('tick', spy)
                .start();

            setTimeout(function() {
                tick.stop();
                setTimeout(function() {
                    spy.should.have.been.calledOnce;
                    done();
                }, TICK_INTERVAL);
            }, TICK_INTERVAL);
        });
    });
});

provide();

});
