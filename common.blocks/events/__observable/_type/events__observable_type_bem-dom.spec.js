modules.define(
    'spec',
    [
        'events__observable',
        'sinon',
        'i-bem-dom',
        'BEMHTML'
    ],
    function(
        provide,
        observable,
        sinon,
        bemDom,
        BEMHTML) {

describe('events__observable_type_bem-dom', function() {
    var spy1, spy2, spy3, block;

    beforeEach(function() {
        spy1 = sinon.spy();
        spy2 = sinon.spy();
        spy3 = sinon.spy();
        block = bemDom.init(BEMHTML.apply({
            block : 'block'
        })).appendTo('body').bem(bemDom.declBlock('block'));
    });

    afterEach(function() {
        bemDom.destruct(block.domElem);
    });

    describe('on', function() {
        it('should properly bind handlers', function() {
            var data = {},
                ctx = {};

            observable(block)
                .on('myevent', spy1)
                .on('myevent', spy2, ctx)
                .on('myevent', data, spy3, ctx);

            block._emit('myevent');

            spy1.should.have.been.calledOn(block);
            spy2.should.have.been.calledOn(ctx);
            spy3.args[0][0].data.should.be.equal(data);
        });
    });

    describe('once', function() {
        it('should properly bind handlers', function() {
            var data = {},
                ctx = {};

            observable(block)
                .once('myevent', spy1)
                .once('myevent', spy2, ctx)
                .once('myevent', data, spy3, ctx);

            block._emit('myevent');
            block._emit('myevent');

            spy1.should.have.been.calledOnce;
            spy1.should.have.been.calledOn(block);
            spy2.should.have.been.calledOnce;
            spy2.should.have.been.calledOn(ctx);
            spy3.should.have.been.calledOnce;
            spy3.args[0][0].data.should.be.equal(data);
        });
    });

    describe('un', function() {
        it('should properly unbind handlers', function() {
            var ctx = {},
                blockObserver = observable(block)
                    .on('myevent', spy1)
                    .on('myevent', spy2, ctx)
                    .un('myevent', spy1)
                    .un('myevent', spy2);

            block._emit('myevent');

            spy1.should.not.have.been.called;
            spy2.should.have.been.called;

            blockObserver.un('myevent', spy2, ctx);
            block._emit('myevent');

            spy2.should.have.been.calledOnce;
        });
    });
});

provide();

});
