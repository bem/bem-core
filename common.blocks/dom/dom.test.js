modules.define('test', ['dom', 'jquery'], function(provide, dom, $) {

describe('dom', function() {
    describe('containsDomElem', function() {
        var domElem;
        beforeEach(function() {
            domElem = $(
                '<div>' +
                    '<div class="a">' +
                        '<div class="x"/>' +
                    '</div>' +
                    '<div class="a">' +
                        '<div class="x"/>' +
                        '<div class="y"/>' +
                    '</div>' +
                    '<div class="c"/>' +
                '</div>')
                    .appendTo('body');
        });

        afterEach(function() {
            domElem.remove();
        });

        it('should properly checks for nested dom elem', function() {
            dom.contains(domElem.find('.a'), domElem.find('.x')).should.be.true;
            dom.contains(domElem.find('.a'), domElem.find('.y')).should.be.true;
            dom.contains(domElem.find('.c'), domElem.find('.x')).should.be.false;
        });

        it('should returns false for empty jquery chain', function() {
            dom.contains(domElem.find('.a'), domElem.find('.no-exist')).should.be.false;
        });
    });
});

provide();

});
