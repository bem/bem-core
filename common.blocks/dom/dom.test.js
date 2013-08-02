modules.define('test', ['dom', 'jquery'], function(provide, dom, $) {

describe('dom', function() {
    describe('contains', function() {
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

    describe('isFocusable', function() {
        it('should returns true if given DOM elem is iframe, input, button, textarea or select', function() {
            dom.isFocusable($('<iframe/>')).should.be.true;
            dom.isFocusable($('<input/>')).should.be.true;
            dom.isFocusable($('<button/>')).should.be.true;
            dom.isFocusable($('<textarea/>')).should.be.true;
            dom.isFocusable($('<select/>')).should.be.true;
        });

        it('should returns false if given DOM elem is disabled', function() {
            dom.isFocusable($('<input disabled="disabled"/>')).should.be.false;
            dom.isFocusable($('<button disabled="disabled"/>')).should.be.false;
            dom.isFocusable($('<textarea disabled="disabled"/>')).should.be.false;
            dom.isFocusable($('<select disabled="disabled"/>')).should.be.false;
        });

        it('should returns true if given DOM elem is link with href', function() {
            dom.isFocusable($('<a href="/"/>')).should.be.true;
            dom.isFocusable($('<a/>')).should.be.false;
        });

        it('should returns true if given DOM elem has tabindex', function() {
            dom.isFocusable($('<span tabindex="4"/>')).should.be.true;
            dom.isFocusable($('<span/>')).should.be.false;
        });

        it('should returns false if given DOM elem is empty', function() {
            dom.isFocusable($('.__no-exist')).should.be.false;
        });
    });

    describe('containsFocus', function() {
        var domElem;
        beforeEach(function() {
            domElem = $(
                '<div>' +
                    '<div class="a">' +
                        '<input class="x"/>' +
                    '</div>' +
                    '<div class="b"/>' +
                '</div>')
                    .appendTo('body');
            domElem.find('.x').focus();
        });

        afterEach(function() {
            domElem.remove();
        });

        it('should returns true if context contains focused DOM elem', function() {
            dom.containsFocus(domElem.find('.a')).should.be.true;
        });

        it('should returns false if context not contains focused DOM elem', function() {
            dom.containsFocus(domElem.find('.b')).should.be.false;
        });
    });
});

provide();

});
