modules.define('spec', ['dom', 'jquery'], function(provide, dom, $) {

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

        it('should returns true for itself', function() {
            dom.contains(domElem.find('.x'), domElem.find('.x')).should.be.true;
        });

        it('should returns false for empty DOM elem', function() {
            dom.contains(domElem.find('.a'), domElem.find('.no-exist')).should.be.false;
        });
    });

    describe('getFocused', function() {
        it('should returns focused DOM elem', function() {
            var elem = $('<input/>')
                .appendTo('body')
                .focus();
            dom.getFocused()[0].should.be.eql(elem[0]);
            elem.blur();
            dom.getFocused()[0].should.not.be.eql(elem[0]);
            elem.remove();
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
            dom.isFocusable($('<a tabindex="5"/>')).should.be.true;
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

        it('should returns true if context self-focused', function() {
            dom.containsFocus(domElem.find('.x')).should.be.true;
        });

        it('should returns false if context not contains focused DOM elem', function() {
            dom.containsFocus(domElem.find('.b')).should.be.false;
        });

        it('should returns false if context is empty', function() {
            dom.containsFocus(domElem.find('.__no-exist')).should.be.false;
        });
    });

    describe('isEditable', function() {
        it('should returns true if given DOM elem is text or password input', function() {
            dom.isEditable($('<input type="text"/>')).should.be.true;
            dom.isEditable($('<input type="password"/>')).should.be.true;
            dom.isEditable($('<textarea/>')).should.be.true;
            dom.isEditable($('<input type="radio"/>')).should.be.false;
            dom.isEditable($('<input type="checkbox"/>')).should.be.false;
            dom.isEditable($('<div/>')).should.be.false;
        });

        it('should returns false if given input is readonly', function() {
            dom.isEditable($('<input type="text" readonly="readonly"/>')).should.be.false;
            dom.isEditable($('<texarea readonly="readonly"/>')).should.be.false;
        });

        it('should returns false if given input is disabled', function() {
            dom.isEditable($('<input type="text" disabled="disabled"/>')).should.be.false;
            dom.isEditable($('<texarea disabled="disabled"/>')).should.be.false;
        });

        it('should returns true for contenteditable DOM elems', function() {
            dom.isEditable($('<div contenteditable="true"/>')).should.be.true;
            dom.isEditable($('<div contenteditable="false"/>')).should.be.false;
            dom.isEditable($('<div contenteditable="yet-another-val"/>')).should.be.false;
        });

        it('should returns false if given DOM elem is empty', function() {
            dom.isEditable($('.__no-exist')).should.be.false;
        });
    });
});

provide();

});
