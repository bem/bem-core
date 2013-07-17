modules.define(
    'test',
    ['i-bem__dom', 'jquery', 'sinon', 'BEMHTML'],
    function(provide, DOM, $, sinon, BEMHTML) {

describe('i-bem__dom_elems_yes', function() {
    describe('getOwnBlock', function() {
        it('should return instance of the own block', function() {
            DOM.decl('block', {}, {});
            DOM.decl({ block: 'block', elem: 'elem' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block: 'block',
                    js: true,
                    content: {
                        elem: 'elem',
                        js: true
                    }
                })),
                block = rootNode.bem('block'),
                elem = rootNode.find('.block__elem').bem('block__elem');

            elem.getOwnBlock().should.be.equal(block);

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('closestElem', function() {
        it('should return the closest element regarding to block', function() {
            DOM.decl('block', {}, {});

            var rootNode = $(BEMHTML.apply({
                    block: 'block',
                    js: true,
                    content: {
                        elem: 'elem1',
                        content: {
                            elem: 'elem2'
                        }
                    }
                })),
                block = rootNode.bem('block'),
                closest = block.closestElem(block.elem('elem2'), 'elem1')[0];

            closest.should.be.equal(block.elem('elem1')[0]);

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
        });

        it('should return the closest element regarding to another element', function() {
            DOM.decl('block', {}, {});
            DOM.decl({ block: 'block', elem: 'elem2' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block: 'block',
                    js: true,
                    content: {
                        elem: 'elem1',
                        content: {
                            elem: 'elem2',
                            js: true
                        }
                    }
                })),
                elem2 = rootNode.find('.block__elem2').bem('block__elem2'),
                closest = elem2.closestElem('elem1')[0];

            closest.should.be.equal(rootNode.find('.block__elem1')[0]);

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem2'];
        });
    });
});

provide();

});