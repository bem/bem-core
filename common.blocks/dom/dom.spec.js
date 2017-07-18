modules.define('spec', ['dom'], function(provide, dom, $) {

describe('dom', function() {
    describe('contains', function() {
        var domNode;
        beforeEach(function() {
            domNode = createDomNode();
            domNode.innerHTML = '<div class="a">' +
                    '<div class="x"/>' +
                '</div>' +
                '<div class="a">' +
                    '<div class="x"/>' +
                    '<div class="y"/>' +
                '</div>' +
                '<div class="c"/>';
            document.documentElement.appendChild(domNode);
        });

        afterEach(function() {
            domNode.parentNode.removeChild(domNode);
        });

        it('should properly checks for nested dom elem', function() {
            dom.contains(domNode.querySelectorAll('.a'), domNode.querySelectorAll('.x')).should.be.true;
            dom.contains(domNode.querySelectorAll('.a'), domNode.querySelector('.y')).should.be.true;
            dom.contains(domNode.querySelector('.c'), domNode.querySelectorAll('.x')).should.be.false;
        });

        it('should returns true for itself', function() {
            dom.contains(domNode.querySelectorAll('.x'), domNode.querySelectorAll('.x')).should.be.true;
        });

        it('should returns false for empty DOM elem', function() {
            dom.contains(domNode.querySelectorAll('.a'), domNode.querySelectorAll('.no-exist')).should.be.false;
        });
    });

    describe('getFocused', function() {
        it('should returns focused DOM elem', function() {
            var input = createDomNode('input');
            document.documentElement.appendChild(input);
            input.focus();

            dom.getFocused().should.be.eql(input);
            input.blur();
            dom.getFocused().should.not.be.eql(input);
            input.parentNode.removeChild(input);
        });
    });

    describe('isFocusable', function() {
        it('should returns true if given DOM elem is iframe, input, button, textarea or select', function() {
            ['input', 'button', 'textarea', 'select'].forEach(function(elementName) {
                dom.isFocusable(createDomNode(elementName)).should.be.true;
            });
        });

        it('should returns false if given DOM elem is disabled', function() {
            ['input', 'button', 'textarea', 'select'].forEach(function(elementName) {
                dom.isFocusable(createDomNode(elementName, { disabled : 'disabled' })).should.be.false;
            });
        });

        it('should returns true if given DOM elem is link with href', function() {
            dom.isFocusable(createDomNode('a', { href : '/' })).should.be.true;
            dom.isFocusable(createDomNode('a')).should.be.false;
        });

        it('should returns true if given DOM elem has tabindex', function() {
            dom.isFocusable(createDomNode('span', { tabindex : '4' })).should.be.true;
            dom.isFocusable(createDomNode('a', { tabindex : '5' })).should.be.true;
            dom.isFocusable(createDomNode('span')).should.be.false;
        });

        it('should returns false if given DOM elem is empty', function() {
            dom.isFocusable(document.querySelector('.__no-exist')).should.be.false;
        });
    });

    describe('containsFocus', function() {
        var domNode;
        beforeEach(function() {
            domNode = createDomNode();
            domNode.innerHTML = '<div class="a">' +
                    '<input class="x"/>' +
                '</div>' +
                '<div class="b"/>';
            document.documentElement.appendChild(domNode);

            domNode.querySelector('.x').focus();
        });

        afterEach(function() {
            domNode.parentNode.removeChild(domNode);
        });

        it('should returns true if context contains focused DOM elem', function() {
            dom.containsFocus(domNode.querySelectorAll('.a')).should.be.true;
        });

        it('should returns true if context self-focused', function() {
            dom.containsFocus(domNode.querySelectorAll('.x')).should.be.true;
        });

        it('should returns false if context not contains focused DOM elem', function() {
            dom.containsFocus(domNode.querySelectorAll('.b')).should.be.false;
        });

        it('should returns false if context is empty', function() {
            dom.containsFocus(domNode.querySelectorAll('.__no-exist')).should.be.false;
        });
    });

    describe('isEditable', function() {
        it('should returns true if given DOM elem is text or password input', function() {
            dom.isEditable(createDomNode('input', { type : 'text' })).should.be.true;
            dom.isEditable(createDomNode('input', { type : 'password' })).should.be.true;
            dom.isEditable(createDomNode('textarea')).should.be.true;
            dom.isEditable(createDomNode('input', { type : 'radio' })).should.be.false;
            dom.isEditable(createDomNode('input', { type : 'checkbox' })).should.be.false;
            dom.isEditable(createDomNode()).should.be.false;
        });

        it('should returns false if given input is readonly', function() {
            dom.isEditable(createDomNode('input', { type : 'text', readonly : 'readonly' })).should.be.false;
            dom.isEditable(createDomNode('texarea', { readonly : 'readonly' })).should.be.false;
        });

        it('should returns false if given input is disabled', function() {
            dom.isEditable(createDomNode('input', { type : 'text', disabled : 'disabled' })).should.be.false;
            dom.isEditable(createDomNode('texarea', { disabled : 'disabled' })).should.be.false;
        });

        it('should returns true for contenteditable DOM elems', function() {
            dom.isEditable(createDomNode('div', { contenteditable : 'true' })).should.be.true;
            dom.isEditable(createDomNode('div', { contenteditable : 'false' })).should.be.false;
            dom.isEditable(createDomNode('div', { contenteditable : 'yet-another-val' })).should.be.false;
        });

        it('should returns false if given DOM elem is empty', function() {
            dom.isEditable(document.querySelector('.__no-exist')).should.be.false;
        });
    });
});

function createDomNode(elemName, attrs) {
    var elem = document.createElement(elemName || 'div');

    attrs && Object.keys(attrs).forEach(function(attrName) {
        elem.setAttribute(attrName, attrs[attrName]);
    });

    return elem;
}

provide();

});
