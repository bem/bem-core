modules.define('spec', ['events', 'sinon'], function(provide, events, sinon) {

describe('events', function() {
    describe('Emitter', function() {
        var emitter;
        beforeEach(function() {
            emitter = new events.Emitter();
        });

        describe('on/emit', function() {
            it('should call callbacks according to the type of event', function() {
                var spy1 = sinon.spy(),
                    spy1_1 = sinon.spy(),
                    spy2 = sinon.spy();

                emitter
                    .on('event1', spy1)
                    .on('event1', spy1_1)
                    .on('event2', spy2)
                    .emit('event1');

                spy1.should.have.been.calledOnce;
                spy1_1.should.have.been.calledOnce;
                spy2.should.not.have.been.called;

                emitter.emit('event2');
                spy2.should.have.been.calledOnce;

                emitter.emit('event1');
                spy1.should.have.been.calledTwice;
                spy1_1.should.have.been.calledTwice;
            });

            it('should call callbacks according to all types of event', function() {
                var spy = sinon.spy();

                emitter
                    .on('event1 event2', spy)
                    .emit('event1');
                spy.should.have.been.calledOnce;

                emitter.emit('event2');
                spy.should.have.been.calledTwice;
            });

            it('should call callbacks for all types of event', function() {
                var spy = sinon.spy();

                emitter
                    .on('*', spy)
                    .emit('event1');
                spy.should.have.been.calledOnce;

                emitter.emit('event2');
                spy.should.have.been.calledTwice;

                emitter.emit('event3');
                spy.should.have.been.calledThrice;
            });

            it('should call callback with given context', function() {
                var spy = sinon.spy(),
                    ctx = {};

                emitter
                    .on('event', spy, ctx)
                    .emit('event');

                spy.should.have.been.calledOn(ctx);
            });

            it('should pass event to callback', function() {
                var spy = sinon.spy(),
                    data = { data : 'ok' };

                emitter
                    .on('event', spy)
                    .emit('event', data);

                var event = spy.args[0][0];
                event.should.be.instanceOf(events.Event);
                event.type.should.be.equal('event');
            });

            it('should pass additional data to callback', function() {
                var spy = sinon.spy(),
                    data = { data : 'ok' };

                emitter
                    .on('event', spy)
                    .emit('event', data);

                spy.args[0][1].should.be.equal(data);
            });

            it('should allow to Event instance to be passed', function() {
                var spy = sinon.spy(),
                    e = new events.Event('event');

                emitter
                    .on('event', spy)
                    .emit(e);

                spy.args[0][0].should.be.equal(e);
            });

            it('should set default target', function() {
                var spy = sinon.spy();

                emitter
                    .on('event', spy)
                    .emit('event');

                spy.args[0][0].target.should.be.equal(emitter);
            });

            it('should pass custom target', function() {
                var spy = sinon.spy(),
                    target = {},
                    e = new events.Event('event', target);

                emitter
                    .on('event', spy)
                    .emit(e);

                spy.args[0][0].target.should.be.equal(target);
            });

            it('should call stopPropagation and preventDefault if callback returns false', function() {
                var e = new events.Event('event');
                emitter
                    .on('event', function() {
                        return false;
                    })
                    .emit(e);

                e.isPropagationStopped().should.be.true;
                e.isDefaultPrevented().should.be.true;
            });

            it('should not immediately call callback that was binded in callback', function() {
                var spy = sinon.spy();

                emitter
                    .on('event', function() {
                        emitter.on('event', spy);
                    })
                    .emit('event');

                spy.should.not.have.been.called;

                emitter.emit('event');
                spy.should.have.been.called;
            });
        });

        describe('once/emit', function() {
            it('should call callback once', function() {
                var spy = sinon.spy();

                emitter
                    .once('event', spy)
                    .emit('event')
                    .emit('event')
                    .emit('event');

                spy.should.have.been.calledOnce;
            });
        });

        describe('un/emit', function() {
            it('should unbind given callback according to the type of event', function() {
                var spy1 = sinon.spy(),
                    spy2 = sinon.spy();

                emitter
                    .on('event', spy1)
                    .on('event2', spy1)
                    .on('event', spy2)
                    .un('event', spy1)
                    .emit('event');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;

                emitter.emit('event2');
                spy1.should.have.been.called;
            });

            it('should unbind given callback according to the type of all given events', function() {
                var spy = sinon.spy();

                emitter
                    .on('event', spy)
                    .on('event2', spy)
                    .un('event event2', spy)
                    .emit('event')
                    .emit('event2');

                spy.should.not.have.been.called;
            });

            it('should unbind given callback according to the type of event and context', function() {
                var spy = sinon.spy(),
                    ctx1 = {},
                    ctx2 = {};

                emitter
                    .on('event', spy, ctx1)
                    .on('event', spy, ctx2)
                    .on('event', spy)
                    .un('event', spy, ctx1)
                    .emit('event');

                spy.should.have.been.calledTwice;
            });

            it('should unbind all callbacks according to the type of event', function() {
                var spy1 = sinon.spy(),
                    spy2 = sinon.spy();

                emitter
                    .on('event', spy1)
                    .on('event2', spy1)
                    .on('event', spy2)
                    .un('event')
                    .emit('event');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                emitter.emit('event2');
                spy1.should.have.been.called;
            });

            it('should unbind all callbacks', function() {
                var spy1 = sinon.spy(),
                    spy2 = sinon.spy();

                emitter
                    .on('event', spy1)
                    .on('event2', spy1)
                    .on('event', spy2)
                    .un()
                    .emit('event');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                emitter.emit('event2');
                spy1.should.not.have.been.called;
            });
        });
    });
});

provide();

});
