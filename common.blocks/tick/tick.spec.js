modules.define('spec', ['tick', 'sinon'], function(provide, tick, sinon) {

describe('tick', function() {
    describe('start/stop', function() {
        var TICK_INTERVAL = 50,
            clock;

        beforeEach(function() {
            tick.stop();
            clock = sinon.useFakeTimers();
        });

        afterEach(function() {
            clock.restore();
        });

        it('should emit tick event only if started', function(done) {
            var spy = sinon.spy();

            tick
                .on('tick', spy)
                .start();

            setTimeout(function() {
                tick.stop();
                setTimeout(function() {
                    spy.should.have.been.calledOnce;
                    done();
                }, TICK_INTERVAL);

                clock.tick(TICK_INTERVAL);
            }, TICK_INTERVAL);

            clock.tick(TICK_INTERVAL);
        });

        it('should not emit tick event after .stop() in callback', function(done) {
            var spy = sinon.spy();

            tick
                .on('tick', function() {
                    spy();
                    tick.stop();
                })
                .start();

            setTimeout(function() {
                setTimeout(function() {
                    spy.should.have.been.calledOnce;
                    tick.stop();

                    done();
                }, TICK_INTERVAL);

                clock.tick(TICK_INTERVAL);
            }, TICK_INTERVAL);

            clock.tick(TICK_INTERVAL);
        });
    });
});

provide();

});
