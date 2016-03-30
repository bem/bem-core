modules.define(
    'spec',
    ['jquery', 'sinon'],
    function(provide, $, sinon) {

describe.only('jquery__event_type_pointerpressrelease', function() {
    var elem;

    beforeEach(function() {
        elem = $('<div/>').appendTo('body');
    });

    afterEach(function() {
        elem.remove();
    });

    it('should trigger "pointerpress" event on "mousedown"', function() {
        var spy = sinon.spy();
        elem.on('pointerpress', spy)
            .trigger($.Event('mousedown', { which : 1 }))
            .trigger('mouseup');

        spy.should.have.been.calledOnce;
    });

    it('should trigger "pointerrelease" event on "mouseup"', function() {
        var spy = sinon.spy();
        elem.on('pointerrelease', spy)
            .trigger('mousedown')
            .trigger($.Event('mouseup', { which : 1 }));

        spy.should.have.been.calledOnce;
    });

    it('"pointerpress" should have "pointerdown" original event', function(done) {
        elem
            .on('pointerpress', function(e) {
                e.originalEvent.type.should.be.equal('pointerdown');
                done();
            })
            .trigger($.Event('mousedown', { which : 1 }))
            .trigger('mouseup');
    });

    it('"pointerrelease" should have "pointerup" original event', function(done) {
        elem
            .on('pointerrelease', function(e) {
                e.originalEvent.type.should.be.equal('pointerup');
                done();
            })
            .trigger('mousedown')
            .trigger($.Event('mouseup', { which : 1 }));
    });

    it('"pointerrelease" should have "pointercancel" original event', function(done) {
        elem
            .on('pointerrelease', function(e) {
                e.originalEvent.type.should.be.equal('pointercancel');
                done();
            })
            .trigger($.Event('pointercancel', { which : 1 }));
    });
});

provide();

});
