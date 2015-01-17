modules.define(
    'spec',
    ['jquery', 'sinon'],
    function(provide, $, sinon) {

describe('jquery__event_type_pointer', function() {
    var elem;

    beforeEach(function() {
        elem = $('<div/>').appendTo('body');
    });

    afterEach(function() {
        elem instanceof $ && elem.remove();
    });

    it('should trigger "pointerenter" event on "mouseenter"', function() {
        var spy = sinon.spy();

        elem.on('pointerenter', spy).mouseenter();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerover" event on "mouseover"', function() {
        var spy = sinon.spy();

        elem.on('pointerover', spy).mouseover();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerdown" event on "mousedown"', function() {
        var spy = sinon.spy(),
            e = $.Event('mousedown', {
                clientX : 100,
                clientY : 200,
                buttons : 1
            }),
            args;

        elem.on('pointerdown', spy).trigger(e);

        spy.should.have.been.calledOnce;

        args = spy.args[0][0];

        args.isPrimary.should.be.true;
        args.pointerId.should.be.equal(1);
        args.pointerType.should.be.equal('mouse');
        args.clientX.should.be.equal(e.clientX);
        args.clientY.should.be.equal(e.clientY);
        args.pressure.should.be.equal(0.5);
        args.width.should.be.equal(0);
        args.height.should.be.equal(0);
        args.tiltX.should.be.equal(0);
        args.tiltY.should.be.equal(0);
    });

    it('should trigger "pointermove" event on "mousemove"', function() {
        var spy = sinon.spy();

        elem.on('pointermove', spy).mousemove();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerup" event on "mouseup"', function() {
        var spy = sinon.spy();

        elem.on('pointerup', spy).mouseup();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerleave" event on "mouseleave"', function() {
        var spy = sinon.spy();

        elem.on('pointerleave', spy).mouseleave();

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerout" event on "mouseout"', function() {
        var spy = sinon.spy();

        elem.on('pointerout', spy).mouseout();

        spy.should.have.been.calledOnce;
    });

    it('should successfully unbind from aliased events', function() {
        var spy = sinon.spy();

        elem
            .on('pointerenter', spy).off('pointerenter').mouseenter()
            .on('pointerover', spy).off('pointerover').mouseover()
            .on('pointerdown', spy).off('pointerdown').mousedown()
            .on('pointermove', spy).off('pointermove').mousemove()
            .on('pointerup', spy).off('pointerup').mouseup()
            .on('pointerleave', spy).off('pointerleave').mouseleave()
            .on('pointerout', spy).off('pointerout').mouseout();

        spy.callCount.should.be.equal(0);
    });

    it('should not affect native "mouse*" events (#534)', function() {
        var eventsMap = {
                mouseenter : 'pointerenter',
                mouseover : 'pointerover',
                mousedown : 'pointerdown',
                mousemove : 'pointermove',
                mouseup : 'pointerup',
                mouseleave : 'pointerleave',
                mouseout : 'pointerout'
            };

        function assertEventType(type) {
            return function(e) {
                e.type.should.be.equal(type);
            };
        }

        Object.keys(eventsMap).forEach(function(mouseEvent) {
            var pointerEvent = eventsMap[mouseEvent],
                spy = sinon.spy();

            elem
                .on(pointerEvent, assertEventType(pointerEvent))
                .on(mouseEvent, function(e) {
                    spy();
                    assertEventType(mouseEvent)(e);
                });

            elem[mouseEvent]();

            spy.should.have.been.calledOnce;
        });
    });

    it('should not bubble pointerenter / pointerleave events from inner elements (#801)', function() {
        var innerElem = $('<div/>').appendTo(elem),
            enterSpy = sinon.spy(),
            leaveSpy = sinon.spy();

        elem
            .on('pointerenter', enterSpy)
            .on('pointerleave', leaveSpy)
            .on('mouseenter', function() {
                innerElem
                    .trigger($.Event('mouseenter', { relatedTarget : this }))    // simulate mouseenter from elem to innerElem
                    .trigger($.Event('mouseleave', { relatedTarget : this }));   // simulate mouseleave from innerElem to elem
            })
            .mouseenter();

        enterSpy.should.have.been.calledOnce;   // pointerenter shouldn't bubble from innerElem to elem
        leaveSpy.should.not.have.been.called;   // pointerleave shouldn't bubble from innerElem to elem
    });

    it('should trigger pointerenter / pointerleave on the subtree from event\'s relatedTarget to target', function() {
        var elemSubtree = $('<div><div></div></div>').appendTo(elem),
            innerElem1 = elemSubtree.eq(0),
            innerElem2 = innerElem1.find('div:eq(0)'),
            enterEvent = $.Event('mouseenter', {
                relatedTarget : elem
            }),
            leaveEvent = $.Event('mouseleave', {
                relatedTarget : elem
            }),
            enterSpy = sinon.spy(),
            leaveSpy = sinon.spy(),
            enterArgs, leaveArgs;

        innerElem1
            .on('pointerenter', enterSpy)
            .on('pointerleave', leaveSpy);

        innerElem2
            .trigger(enterEvent)
            .trigger(leaveEvent);

        enterSpy.should.have.been.calledOnce;
        enterArgs = enterSpy.args[0][0];
        enterArgs.target.should.be.equal(innerElem1[0], 'pointerenter triggered with wrong target');

        leaveSpy.should.have.been.calledOnce;
        leaveArgs = leaveSpy.args[0][0];
        leaveArgs.target.should.be.equal(innerElem1[0], 'pointerleave triggered with wrong target');
    });
});

provide();

});
