modules.define(
    'test',
    ['i-bem__dom', 'jquery', 'sinon', 'BEMHTML'],
    function(provide, DOM, $, sinon, BEMHTML) {

describe('i-bem__dom_elements', function() {
    describe('element', function() {
        it('should return the instance of element', function() {
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
                elem = block.element('elem');

            elem.should.be.instanceOf(DOM.blocks['block__elem']);
            elem.__self.getName(true).should.be.equal('elem');

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('getBlock', function() {
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
                elem = block.element('elem');

            elem.getBlock().should.be.equal(block);

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('closestElem', function() {
        it('should return the closest element', function() {
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
                block = rootNode.bem('block'),
                elem2 = block.element('elem2'),
                closest = elem2.closestElem('elem1');

            closest[0].should.be.equal(block.elem('elem1')[0]);

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem2'];
        });
    });

    describe('mods', function() {
        it('should update element\'s modifier properly', function() {
            DOM.decl('block', {}, {});
            DOM.decl({ block: 'block', elem: 'elem' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block: 'block',
                    js: true,
                    content: {
                        elem: 'elem',
                        elemMods: { mod: 'val1' },
                        mix: { block: 'i-bem' },
                        js: true
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.element('elem');

            elem.hasMod('mod', 'val1').should.be.true;

            block.setMod(block.elem('elem'), 'mod', 'val2');
            elem.hasMod('mod', 'val2').should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });

        it('should call block\'s onElemSetMod handler when element updates it\'s own modifier', function() {
            var spy = sinon.spy();
            DOM.decl('block', {
                onElemSetMod : {
                    elem: {
                        mod: {
                            val: spy
                        }
                    }
                }
            }, {});
            DOM.decl({ block: 'block', elem: 'elem' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block: 'block',
                    js: true,
                    content: {
                        elem: 'elem',
                        mix: { block: 'i-bem' },
                        js: true
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.element('elem');

            elem.setMod('mod', 'val');
            spy.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('findElem', function() {
        it('should filter nested block\'s elements in strict mode', function() {
            DOM.decl('block', {}, {});
            DOM.decl({ block: 'block', elem: 'elem' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block: 'block',
                    js: true,
                    content: {
                        elem: 'elem',
                        mix: { block: 'i-bem' },
                        js: true,
                        content: [
                            { elem: 'nested' },
                            {
                                block: 'block',
                                content: { elem: 'nested' }
                            }
                        ]
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.element('elem'),
                nested = elem.findElem('nested', true);

            nested.length.should.be.equal(1);
            nested[0].should.be.equal(elem.domElem[0].children[0]);

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('auto declaration', function() {
        it('should declare element properly on initialization', function() {
            DOM.decl('block', {}, {});

            var rootNode = $(BEMHTML.apply({
                    block: 'block',
                    js: true,
                    content: {
                        elem: 'elem'
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.element('elem');

            elem.__self.should.be.equal(DOM.blocks['block__elem']);
            elem.__self.getName(true).should.be.equal('elem');

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('liveInitOnOwnBlockEvent', function() {
        it('should init and call handler on live initialization', function() {
            var spyInit = sinon.spy(),
                spyHandler = sinon.spy();

            DOM.decl('block', {}, {});
            DOM.decl({ block: 'block', elem: 'elem' }, {
                onSetMod: {
                    js: {
                        inited: spyInit
                    }
                }
            }, {
                live: function() {
                    this.liveInitOnOwnBlockEvent('event', spyHandler);
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    block: 'block',
                    js: true,
                    content: {
                        elem: 'elem',
                        js: true,
                        mix: { block: 'i-bem' }
                    }
                }))),
                block = rootNode.bem('block');

            spyInit.called.should.be.false;
            spyHandler.called.should.be.false;

            block.emit('event');

            spyInit.called.should.be.true;
            spyHandler.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });
});

provide();

});