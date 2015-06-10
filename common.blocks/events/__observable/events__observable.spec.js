modules.define(
    'spec',
    [
        'events__observable',
        'sinon',
        'events'
    ],
    function(
        provide,
        observable,
        sinon,
        events) {

describe('events__observable', function() {
    var spy1, spy2, spy3, emitter;

    beforeEach(function() {
        spy1 = sinon.spy();
        spy2 = sinon.spy();
        spy3 = sinon.spy();
        emitter = new events.Emitter();
    });

    describe('on', function() {
        it('should properly bind handlers', function() {
            var data = {},
                ctx = {};

            observable(emitter)
                .on('myevent', spy1)
                .on('myevent', spy2, ctx)
                .on('myevent', data, spy3, ctx);

            emitter.emit('myevent');

            spy1.should.have.been.calledOn(emitter);
            spy2.should.have.been.calledOn(ctx);
            spy3.args[0][0].data.should.be.equal(data);
        });
    });

    describe('once', function() {
        it('should properly bind handlers', function() {
            var data = {},
                ctx = {};

            observable(emitter)
                .once('myevent', spy1)
                .once('myevent', spy2, ctx)
                .once('myevent', data, spy3, ctx);

            emitter.emit('myevent');
            emitter.emit('myevent');

            spy1.should.have.been.calledOnce;
            spy1.should.have.been.calledOn(emitter);
            spy2.should.have.been.calledOnce;
            spy2.should.have.been.calledOn(ctx);
            spy3.should.have.been.calledOnce;
            spy3.args[0][0].data.should.be.equal(data);
        });
    });

    describe('un', function() {
        it('should properly unbind handlers', function() {
            var ctx = {},
                blockObserver = observable(emitter)
                    .on('myevent', spy1)
                    .on('myevent', spy2, ctx)
                    .un('myevent', spy1)
                    .un('myevent', spy2);

            emitter.emit('myevent');

            spy1.should.not.have.been.called;
            spy2.should.have.been.called;

            blockObserver.un('myevent', spy2, ctx);
            emitter.emit('myevent');

            spy2.should.have.been.calledOnce;
        });
    });
});

provide();

});
