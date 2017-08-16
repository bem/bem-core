modules.define('spec', ['dom'], function(provide, dom, $) {

describe('dom', function() {
    describe('contains', function() {
        var domNode;
        beforeEach(function() {
            document.documentElement.appendChild(domNode = createDomNode(
                'div',
                '<div class="a">' +
                    '<div class="x"/>' +
                '</div>' +
                '<div class="a">' +
                    '<div class="x"/>' +
                    '<div class="y"/>' +
                '</div>' +
                '<div class="c"/>'
            ));
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
    });

    describe('containsFocus', function() {
        var domNode;
        beforeEach(function() {
            document.documentElement.appendChild(domNode = createDomNode(
                'div',
                '<div class="a">' +
                    '<input class="x"/>' +
                '</div>' +
                '<div class="b"/>'
            ));

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
            dom.isEditable(createDomNode({ contenteditable : 'true' })).should.be.true;
            dom.isEditable(createDomNode({ contenteditable : 'false' })).should.be.false;
            dom.isEditable(createDomNode({ contenteditable : 'yet-another-val' })).should.be.false;
        });
    });

    describe('each', function() {
        var domNode;
        beforeEach(function() {
            document.documentElement.appendChild(domNode = createDomNode(
                'div',
                '<div class="a"/>' +
                '<div class="b"/>' +
                '<div class="c"/>'
            ));
        });

        afterEach(function() {
            domNode.parentNode.removeChild(domNode);
        });

        it('should properly iterate many DOM nodes', function() {
            var res = [];

            dom.each(domNode.querySelectorAll('div'), function(childDomNode, i) {
                res.push(childDomNode.className);
            }).should.be.true;

            res.should.be.eql(['a', 'b', 'c']);
        });

        it('should properly stop iteration', function() {
            var res = [];

            dom.each(domNode.querySelectorAll('div'), function(childDomNode, i) {
                res.push(childDomNode.className);
                if(i === 2) return false;
            }).should.be.false;

            res.should.be.eql(['a', 'b']);
        });

        it('should properly iterate one DOM node', function() {
            var res = [];

            dom.each(domNode.querySelector('div'), function(childDomNode, i) {
                res.push(childDomNode.className);
            });

            res.should.be.eql(['a']);
        });
    });
});

function createDomNode(elemName, attrs, html) {
    if(typeof elemName === 'object') {
        html = attrs;
        attrs = elemName;
        elemName = undefined;
    }

    var elem = document.createElement(elemName || 'div');

    if(typeof attrs === 'string') {
        html = attrs;
        attrs = undefined;
    }

    attrs && Object.keys(attrs).forEach(function(attrName) {
        elem.setAttribute(attrName, attrs[attrName]);
    });

    html && (elem.innerHTML = html);

    return elem;
}

provide();

});
