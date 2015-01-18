modules.define(
    'spec',
    ['i-bem__dom', 'jquery', 'sinon', 'BEMHTML'],
    function(provide, DOM, $, sinon, BEMHTML) {

describe('i-bem__dom_elem-instances', function() {
    describe('elemInstance', function() {
        it('should return the instance of element', function() {
            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        js : true
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.elemInstance('elem');

            elem.should.be.instanceOf(DOM.blocks['block__elem']);
            elem.__self.getName(true).should.be.equal('elem');

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('block', function() {
        it('should return instance of the own block', function() {
            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        js : true
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.elemInstance('elem');

            elem.block().should.be.equal(block);

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('closestElem', function() {
        it('should return the closest element', function() {
            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem2' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem1',
                        content : {
                            elem : 'elem2',
                            js : true
                        }
                    }
                })),
                block = rootNode.bem('block'),
                elem2 = block.elemInstance('elem2'),
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
            DOM.decl({ block : 'block', elem : 'elem' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        elemMods : { mod : 'val1' },
                        mix : { block : 'i-bem' },
                        js : true
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.elemInstance('elem');

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
                onElemSetMod  : {
                    elem : {
                        mod : {
                            val : spy
                        }
                    }
                }
            }, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        mix : { block : 'i-bem' },
                        js : true
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.elemInstance('elem');

            elem.setMod('mod', 'val');
            spy.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });

        it('should call block\'s onElemSetMod handler when element updates modifier of another element', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy();

            DOM.decl('block', {
                onElemSetMod  : {
                    elem1 : {
                        mod : {
                            val : spy1
                        }
                    },
                    elem2 : {
                        mod : {
                            val : spy2
                        }
                    }
                }
            }, {});
            DOM.decl({ block : 'block', elem : 'elem1' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem1',
                        mix : { block : 'i-bem' },
                        js : true,
                        content : { elem : 'elem2' }
                    }
                })),
                block = rootNode.bem('block'),
                elem1 = block.elemInstance('elem1'),
                elem2 = block.elem('elem2');

            elem1.setMod(elem2, 'mod', 'val');

            spy1.called.should.be.false;
            spy2.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('findElem', function() {
        it('should filter nested block\'s elements in strict mode', function() {
            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        mix : { block : 'i-bem' },
                        js : true,
                        content : [
                            { elem : 'nested' },
                            {
                                block : 'block',
                                content : { elem : 'nested' }
                            }
                        ]
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.elemInstance('elem'),
                nested = elem.findElem('nested', true);

            nested.length.should.be.equal(1);
            nested[0].should.be.equal(elem.domElem[0].children[0]);

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('elemParams', function() {
        it('should extract element\'s parameters properly', function() {
            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem1' }, {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem1',
                        mix : { block : 'i-bem' },
                        js : true,
                        content : [
                            {
                                elem : 'elem2',
                                js : { p1 : 'v1' }
                            }
                        ]
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.elemInstance('elem1'),
                elemParams = elem.elemParams('elem2');

            elemParams.p1.should.be.equal('v1');

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem1'];
        });
    });

    describe('decl', function() {
        it('should declare element properly on initialization', function() {
            DOM.decl('block', {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem'
                    }
                })),
                block = rootNode.bem('block'),
                elem = block.elemInstance('elem');

            elem.__self.should.be.equal(DOM.blocks['block__elem']);
            elem.__self.getName(true).should.be.equal('elem');

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });

        it('should declare element\'s modifier properly', function() {
            var E1 = DOM.decl({ block : 'block', elem : 'e1' }, {}, {}),
                e2Class = E1.buildClass('e2');

            E1.decl({ modName : 'mod', modVal : 'val' }, {}, {});

            E1.buildClass('e2').should.be.equal(e2Class);

            delete DOM.blocks['block'];
            delete DOM.blocks['block__e1'];
        });

        it('should inherit from itself properly', function() {
            var Block = DOM.decl('block'),
                method = function() {};

            Block.decl({ method : method });

            method.should.be.equal(Block.prototype.method);

            delete DOM.blocks['block'];
        });
    });

    describe('DOM.init', function() {
        it('should init elem', function() {
            var spy = sinon.spy();
            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        js : true,
                        mix : { block : 'i-bem' }
                    }
                })));
            DOM.init(rootNode);

            spy.should.have.been.calledOnce;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });

        it('should call live function once for elem', function() {
            var spy = sinon.spy();
            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {}, {
                live : spy
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        js : true,
                        mix : { block : 'i-bem' }
                    }
                })));
            DOM.init(rootNode);

            spy.should.have.been.calledOnce;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });

        it('should not call live function for elem without i-bem mix', function() {
            var spy = sinon.spy();
            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {}, {
                live : spy
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        js : true
                    }
                })));
            DOM.init(rootNode);

            spy.called.should.be.false;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });

        it('should not init live elem', function() {
            var spy = sinon.spy();
            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            }, {
                live : true
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        js : true,
                        mix : { block : 'i-bem' }
                    }
                })));
            DOM.init(rootNode);

            spy.called.should.be.false;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });

    describe('liveInitOnBlockEvent', function() {
        it('should init and call handler on live initialization', function() {
            var spyInit = sinon.spy(),
                spyHandler = sinon.spy();

            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {
                onSetMod : {
                    js : {
                        inited : spyInit
                    }
                }
            }, {
                live : function() {
                    this.liveInitOnBlockEvent('event', spyHandler);
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        js : true,
                        mix : { block : 'i-bem' }
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

    describe('destruct', function() {
        it('should destruct element\'s instance properly', function() {
            var spy = sinon.spy();

            DOM.decl('block', {}, {});
            DOM.decl({ block : 'block', elem : 'elem' }, {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem',
                        js : true,
                        mix : { block : 'i-bem' }
                    }
                })));

            spy.called.should.be.false;

            DOM.destruct(rootNode);

            spy.called.should.be.true;

            delete DOM.blocks['block'];
            delete DOM.blocks['block__elem'];
        });
    });
});

provide();

});
