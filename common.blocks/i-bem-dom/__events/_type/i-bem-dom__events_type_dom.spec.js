modules.define(
    'spec',
    ['i-bem', 'i-bem-dom', 'objects', 'chai', 'sinon', 'BEMHTML'],
    function(provide, bem, bemDom, objects, chai, sinon, BEMHTML) {

var undef,
    expect = chai.expect;

describe('DOM events', function() {
    var Block1, Block2, Block3, block1, spy1, spy2, spy3, spy4, spy5, spy6, spy7, spy8,
        wrapSpy = function(spy) {
            return function(e) {
                // NOTE: we need to pass bemTarget and data explicitly, as `e` is being
                // changed while event is propagating
                spy.call(this, e, e.bemTarget, e.data);
            };
        },
        data = { data : 'data' };

    beforeEach(function() {
        spy1 = sinon.spy();
        spy2 = sinon.spy();
        spy3 = sinon.spy();
        spy4 = sinon.spy();
        spy5 = sinon.spy();
        spy6 = sinon.spy();
        spy7 = sinon.spy();
        spy8 = sinon.spy();
    });

    afterEach(function() {
        destructDom();

        objects.each(bem.entities, function(_, entityName) {
            delete bem.entities[entityName];
        });
    });

    describe('on instance events', function() {
        describe('block DOM nodes events', function() {
            beforeEach(function() {
                Block1 = bemDom.declBlock('block1', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents()
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3))
                                    .once('click', spy4);
                            }
                        }
                    }
                });

                Block2 = bemDom.declBlock('block2', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents()
                                    .on('click', spy5);
                            }
                        }
                    }
                });

                block1 = initBemEntity(
                    {
                        block : 'block1',
                        mix : { block : 'block2', js : true }
                    },
                    Block1);
            });

            it('should properly bind handlers', function() {
                block1.domNodes[0].click();

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][1].should.be.instanceOf(Block1);
                // spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
                block1.domNodes[0].click();
                spy4.should.have.been.called;

                block1.domNodes[0].click();
                spy4.should.have.been.calledOnce;

                block1._domEvents().once('click', spy4);
                block1.domNodes[0].click();
                spy4.should.have.been.calledTwice;
            });

            it('should properly bind the same handler', function() {
                block1._domEvents()
                    .on('click', spy6)
                    .on('click', spy6);

                block1.domNodes[0].click();
                spy6.should.have.been.calledOnce;

                block1._domEvents().un('click', spy6);
                block1.domNodes[0].click();
                spy6.should.have.been.calledOnce;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents().un('click');
                block1.domNodes[0].click();

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents().un('click', spy1);
                block1.domNodes[0].click();

                spy1.should.not.have.been.called;
                spy3.should.have.been.called;
            });

            it('should unbind only own handlers', function() {
                block1._domEvents().un('click');
                block1.domNodes[0].click();

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                spy5.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents().un('click', spy4);
                block1.domNodes[0].click();
                spy4.should.not.have.been.called;
            });
        });

        describe('block elems events', function() {
            ['string', 'Class'].forEach(function(elemType) {
                var elem1, elem2;

                describe('elem as ' + elemType, function() {
                    var Elem1, Elem2;

                    beforeEach(function() {
                        elem1 = elemType === 'string'?
                            'e1' :
                            bemDom.declElem('block', 'e1');
                        Block1 = bemDom.declBlock('block', {
                            onSetMod : {
                                'js' : {
                                    'inited' : function() {
                                        this._domEvents(elem1)
                                            .on('click', spy1)
                                            .on('click', spy2)
                                            .on('click', data, wrapSpy(spy3));

                                        this._domEvents('e2').on('click', spy5);
                                        this._domEvents('e4').on('click', spy8);
                                    }
                                }
                            }
                        });

                        Elem1 = elemType === 'string'?
                            bemDom.declElem('block', 'e1') :
                            elem1;
                        Elem2 = bemDom.declElem('block', 'e2', {
                            onSetMod : {
                                'js' : {
                                    'inited' : function() {
                                        this._domEvents(elem1)
                                            .on('click', wrapSpy(spy6))
                                            .on('click', spy7);
                                    }
                                }
                            }
                        });

                        block1 = initBemEntity(
                            {
                                block : 'block',
                                mix : { block : 'block', elem : 'e4' },
                                content : [
                                    { elem : 'e1', content : { elem : 'e3' } },
                                    { elem : 'e2', content : { elem : 'e1' } }
                                ]
                            },
                            Block1);

                        elem2 = block1._elem('e2');
                    });

                    describe('block', function() {
                        it('should properly bind handlers', function() {
                            block1.domNodes[0].click();

                            spy1.should.not.have.been.called;
                            spy2.should.not.have.been.called;

                            block1._elem('e3').domNodes[0].click();

                            spy1.should.have.been.called;
                            spy1.should.have.been.calledOn(block1);

                            spy2.should.have.been.called;

                            spy3.should.have.been.called;
                            spy3.args[0][2].should.have.been.equal(data);
                            spy3.args[0][1].should.be.instanceOf(Elem1);
                            spy3.args[0][1].domNodes[0]
                                .should.be.equal(block1._elem(elem1).domNodes[0]);

                            spy5.should.not.have.been.called;
                        });

                        it('should properly bind handlers to mixed elem', function() {
                            block1._elem('e4').domNodes[0].click();

                            spy8.should.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            block1._domEvents(elem1).un('click');
                            block1._elem(elem1).domNodes[0].click();

                            spy1.should.not.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.not.have.been.called;

                            elem2.domNodes[0].click();

                            spy5.should.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            block1._domEvents(elem1).un('click', spy2);
                            block1._elem(elem1).domNodes[0].click();

                            spy1.should.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.have.been.called;
                        });

                        it('should properly unbind handlers from mixed elem', function() {
                            block1._domEvents('e4').un('click', spy8);
                            block1._elem('e4').domNodes[0].click();

                            spy8.should.not.have.been.called;
                        });
                    });

                    describe('elem instance', function() {
                        it('should properly bind handlers', function() {
                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1.domNodes[0].click();

                            spy6.should.have.been.called;
                            spy6.should.have.been.calledOn(elem2);
                            spy6.args[0][1].should.be.instanceOf(Elem1);
                            spy6.args[0][1].domNodes[0]
                                .should.be.equal(e2elem1.domNodes[0]);

                            spy7.should.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            elem2._domEvents(elem1).un('click');

                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1.domNodes[0].click();

                            spy6.should.not.have.been.called;
                            spy7.should.not.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            elem2._domEvents(elem1).un('click', spy7);

                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1.domNodes[0].click();

                            spy6.should.have.been.called;
                            spy7.should.not.have.been.called;
                        });
                    });
                });

                describe('elem as ' + elemType + ', modName, modVal', function() {
                    beforeEach(function() {
                        Block1 = bemDom.declBlock('block', {
                            onSetMod : {
                                'js' : {
                                    'inited' : function() {
                                        this._domEvents({ elem : elem1 })
                                            .on('click', spy1);
                                        this._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' })
                                            .on('click', spy2)
                                            .on('click', spy3);
                                    }
                                }
                            }
                        });

                        block1 = initBemEntity(
                            {
                                block : 'block',
                                content : [
                                    { elem : 'e1' },
                                    { elem : 'e1', elemMods : { m1 : 'v1' } }
                                ]
                            },
                            Block1);
                    });

                    it('should properly bind handlers', function() {
                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domNodes[0].click();

                        spy1.should.have.been.called;
                        spy2.should.have.been.called;

                        block1._elem('e1').domNodes[0].click();

                        spy1.should.have.been.calledTwice;
                        spy2.should.have.been.calledOnce;
                    });

                    it('should properly unbind all handlers', function() {
                        block1._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click');

                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domNodes[0].click();

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                    });

                    it('should properly unbind specified handler', function() {
                        block1._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click', spy2);

                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domNodes[0].click();

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                        spy3.should.have.been.called;
                    });
                });
            });

            describe('elem as instance', function() {
                var elem1, elem2;

                beforeEach(function() {
                    Block1 = bemDom.declBlock('block', {
                        onSetMod : {
                            'js' : {
                                'inited' : function() {
                                    this._domEvents(this._elem('e1'))
                                        .on('click', spy1)
                                        .on('click', spy2)
                                        .on('click', data, wrapSpy(spy3));

                                    this._domEvents(this._elem('e2')).on('click', spy5);

                                    this._domEvents(this._elems('e1').get(1)).on('click', spy6);
                                }
                            }
                        }
                    });

                    block1 = initBemEntity(
                        {
                            block : 'block',
                            content : [
                                { elem : 'e1', content : { elem : 'e3' } },
                                { elem : 'e2', content : { elem : 'e1' } }
                            ]
                        },
                        Block1);

                    elem1 = block1._elem('e1');
                    elem2 = block1._elem('e2');
                });

                describe('block', function() {
                    it('should properly bind handlers', function() {
                        block1._elem('e3').domNodes[0].click();

                        spy1.should.have.been.called;
                        spy1.should.have.been.calledOn(block1);

                        spy2.should.have.been.called;

                        spy3.should.have.been.called;
                        spy3.args[0][1].should.be.equal(elem1);
                        spy3.args[0][2].should.be.equal(data);

                        spy5.should.not.have.been.called;
                    });

                    it('should properly bind handlers on elem with the same name', function() {
                        block1._elem('e1').domNodes[0].click();

                        spy1.should.have.been.called;
                        spy6.should.not.have.been.called;
                    });

                    it('should properly unbind all handlers', function() {
                        block1._domEvents(elem1).un('click');
                        elem1.domNodes[0].click();

                        spy1.should.not.have.been.called;
                        spy2.should.not.have.been.called;
                        spy3.should.not.have.been.called;

                        elem2.domNodes[0].click();

                        spy5.should.have.been.called;
                    });

                    it('should properly unbind specified handler', function() {
                        block1._domEvents(elem1).un('click', spy2);
                        elem1.domNodes[0].click();

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                        spy3.should.have.been.called;
                    });
                });
            });
        });

        describe('collection events', function() {
            var Elem1, collection;

            beforeEach(function() {
                Block1 = bemDom.declBlock('block1', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents(collection = this.findChildElems(Elem1))
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3))
                                    .once('click', spy4);
                            }
                        }
                    }
                });

                Elem1 = bemDom.declElem('block1', 'elem1');

                block1 = initBemEntity(
                    {
                        block : 'block1',
                        content : { elem : 'elem1' }
                    },
                    Block1);
            });

            it('should properly bind handlers', function() {
                block1._elem('elem1').domNodes[0].click();

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][1].should.be.instanceOf(Elem1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
                block1._elem('elem1').domNodes[0].click();
                spy4.should.have.been.called;

                block1._elem('elem1').domNodes[0].click();
                spy4.should.have.been.calledOnce;

                block1._domEvents(collection).once('click', spy4);
                block1._elem('elem1').domNodes[0].click();
                spy4.should.have.been.calledTwice;
            });

            it('should properly bind the same handler', function() {
                block1._domEvents(collection)
                    .on('click', spy6)
                    .on('click', spy6);

                block1._elem('elem1').domNodes[0].click();
                spy6.should.have.been.calledOnce;

                block1._domEvents(collection).un('click', spy6);
                block1._elem('elem1').domNodes[0].click();
                spy6.should.have.been.calledOnce;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents(collection).un('click');
                block1._elem('elem1').domNodes[0].click();

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents(collection).un('click', spy1);
                block1._elem('elem1').domNodes[0].click();

                spy1.should.not.have.been.called;
                spy3.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents(collection).un('click', spy4);
                block1._elem('elem1').domNodes[0].click();
                spy4.should.not.have.been.called;
            });
        });

        describe('document events', function() {
            beforeEach(function() {
                Block1 = bemDom.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents(document)
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3))
                                    .once('click', spy4);
                            }
                        }
                    }
                });
                block1 = initBemEntity({ block : 'block' }, Block1);
            });

            it('should properly bind handlers', function() {
                document.documentElement.click();

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
                document.documentElement.click();
                spy4.should.have.been.called;

                document.documentElement.click();
                spy4.should.have.been.calledOnce;

                block1._domEvents(document).once('click', spy4);
                document.documentElement.click();
                spy4.should.have.been.calledTwice;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents(document).un('click');
                document.documentElement.click();

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents(document).un('click', spy1);
                document.documentElement.click();

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents(document).un('click', spy4);
                document.documentElement.click();
                spy4.should.not.have.been.called;
            });

            it.skip('should properly unbind all handlers on block destruct', function() {
                bemDom.destruct(block1.domNodes);
                document.documentElement.click();

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
                spy4.should.not.have.been.called;
            });
        });

        describe('window events', function() {
            beforeEach(function() {
                Block1 = bemDom.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents(window)
                                    .on('resize', spy1)
                                    .on('resize', spy2)
                                    .on('resize', data, wrapSpy(spy3))
                                    .once('resize', spy4);
                            }
                        }
                    }
                });
                block1 = initBemEntity({ block : 'block' }, Block1);
            });

            it('should properly bind handlers', function() {
                windowDispatchEvent('resize');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
                windowDispatchEvent('resize');
                spy4.should.have.been.called;

                windowDispatchEvent('resize');
                spy4.should.have.been.calledOnce;

                block1._domEvents(window).once('click', spy4);
                windowDispatchEvent('click');
                spy4.should.have.been.calledTwice;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents(window).un('resize');
                windowDispatchEvent('resize');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents(window).un('resize', spy1);
                windowDispatchEvent('resize');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents(window).un('resize', spy4);
                windowDispatchEvent('resize');
                spy4.should.not.have.been.called;
            });

            it.skip('should properly unbind all handlers on block destruct', function() {
                bemDom.destruct(block1.domNodes);
                windowDispatchEvent('resize');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
                spy4.should.not.have.been.called;
            });
        });

        describe('arbitrary DOM node events', function() {
            var rootNode;

            beforeEach(function() {
                Block1 = bemDom.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._domEvents(rootNode)
                                    .on('click', spy1)
                                    .on('click', spy2);

                                this._domEvents([rootNode, rootNode.querySelector('div')])
                                    .on('dblclick', data, wrapSpy(spy3))
                                    .once('dblclick', spy4);
                            }
                        }
                    }
                });
                rootNode = initDom({
                    content : {
                        content : { block : 'block', tag : 'p' }
                    }
                });
                block1 = bemDom.getEntity(rootNode.querySelector(Block1._buildSelector()), Block1);
            });

            it('should properly bind handlers', function() {
                rootNode.click();

                spy1.should.have.been.calledOnce;
                spy2.should.have.been.calledOnce;

                rootNode.querySelector('div').dblclick();

                spy3.should.have.been.calledTwice;
                spy3.should.have.been.calledOn(block1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
                rootNode.dblclick();
                spy4.should.have.been.called;

                rootNode.dblclick();
                spy4.should.have.been.calledOnce;

                block1._domEvents([rootNode, rootNode.querySelector('div')]).once('dblclick', spy4);
                rootNode.dblclick();
                spy4.should.have.been.calledTwice;
            });

            it('should properly unbind all handlers', function() {
                block1._domEvents(rootNode).un('click');
                rootNode.click();

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                block1._domEvents([rootNode, rootNode.querySelector('div')]).un('dblclick');
                rootNode.querySelector('div').dblclick();

                spy3.should.not.have.been.called;
                spy4.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._domEvents(rootNode).un('click', spy1);
                rootNode.click();

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._domEvents([rootNode, rootNode.querySelector('div')]).un('dblclick', spy4);
                rootNode.querySelector('div').dblclick();
                spy4.should.not.have.been.called;
            });

            it.skip('should properly unbind all handlers on block destruct', function() {
                bemDom.destruct(block1.domNodes);
                rootNode.click();

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });
        });
    });

    describe('delegated events', function() {
        describe('block DOM nodes events', function() {
            beforeEach(function() {
                Block1 = bemDom.declBlock('block1', {}, {
                    onInit : function() {
                        this._domEvents()
                            .on('click', spy1)
                            .on('click', spy2)
                            .on('click', data, wrapSpy(spy3))
                            .once('click', spy4);
                    }
                });

                Block2 = bemDom.declBlock('block2', {}, {
                    onInit : function() {
                        this._domEvents()
                            .on('click', spy5);
                    }
                });

                Block3 = bemDom
                    .declBlock('block3')
                    .declMod({ modName : 'm1', modVal : 'v1' }, {}, {
                        onInit : function() {
                            this._domEvents({ modName : 'm1', modVal : 'v1' }).on('click', spy6);
                        }
                    });

                block1 = initBemEntity(
                    {
                        block : 'block1',
                        mix : { block : 'block2', js : true },
                        content : [
                            { block : 'block3', js : true },
                            { block : 'block3', mods : { m1 : 'v1' }, js : true }
                        ]
                    },
                    Block1);
            });

            it('should properly bind handlers', function() {
                block1.domNodes[0].click();

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][1].should.be.instanceOf(Block1);
                spy3.args[0][2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
                block1.domNodes[0].click();
                spy4.should.have.been.called;

                block1.domNodes[0].click();
                spy4.should.have.been.calledOnce;

                block1._domEvents().once('click', spy4);
                block1.domNodes[0].click();
                spy4.should.have.been.calledTwice;
            });

            it('should properly unbind all handlers', function() {
                Block1._domEvents().un('click');
                block1.domNodes[0].click();

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                Block1._domEvents().un('click', spy1);
                block1.domNodes[0].click();

                spy1.should.not.have.been.called;
                spy3.should.have.been.called;
            });

            it('should unbind only own handlers', function() {
                Block1._domEvents().un('click');
                block1.domNodes[0].click();

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                spy5.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                Block1._domEvents().un('click', spy4);
                block1.domNodes[0].click();
                spy4.should.not.have.been.called;
            });

            it('should properly bind to self with modifier', function() {
                var blocks = block1.findChildBlocks(Block3);

                blocks.get(0).domNodes[0].click();
                spy6.should.not.have.been.called;

                blocks.get(1).domNodes[0].click();
                spy6.should.have.been.called;
            });
        });

        describe('block elems events', function() {
            ['string', 'Class'].forEach(function(elemType) {
                var elem1, elem2;

                describe('elem as ' + elemType, function() {
                    var Elem1, Elem2;

                    beforeEach(function() {
                        elem1 = elemType === 'string'?
                            'e1' :
                            bemDom.declElem('block', 'e1');

                        Block1 = bemDom.declBlock('block', {}, {
                            onInit : function() {
                                this._domEvents(elem1)
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3));

                                this._domEvents('e2').on('click', spy5);
                            }
                        });

                        Elem1 = elemType === 'string'?
                            bemDom.declElem('block', 'e1') :
                            elem1;
                        Elem2 = bemDom.declElem('block', 'e2', {}, {
                            onInit : function() {
                                this._domEvents(elem1)
                                    .on('click', wrapSpy(spy6))
                                    .on('click', spy7);
                            }
                        });

                        block1 = initBemEntity(
                            {
                                block : 'block',
                                content : [
                                    { elem : 'e1', content : { elem : 'e3' } },
                                    { elem : 'e2', content : { elem : 'e1' } }
                                ]
                            },
                            Block1);

                        elem2 = block1._elem('e2');
                    });

                    describe('block', function() {
                        it('should properly bind handlers', function() {
                            block1._elem('e3').domNodes[0].click();

                            spy1.should.have.been.called;
                            spy1.should.have.been.calledOn(block1);

                            spy2.should.have.been.called;

                            spy3.should.have.been.called;
                            spy3.args[0][2].should.have.been.equal(data);
                            spy3.args[0][1].should.be.instanceOf(Elem1);
                            spy3.args[0][1].domNodes[0]
                                .should.be.equal(block1._elem(elem1).domNodes[0]);

                            spy5.should.not.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            Block1._domEvents(elem1).un('click');
                            block1._elem(elem1).domNodes[0].click();

                            spy1.should.not.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.not.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            Block1._domEvents(elem1).un('click', spy2);
                            block1._elem(elem1).domNodes[0].click();

                            spy1.should.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.have.been.called;
                        });
                    });

                    describe('elem instance', function() {
                        it('should properly bind handlers', function() {
                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1.domNodes[0].click();

                            spy6.should.have.been.called;
                            spy6.should.have.been.calledOn(elem2);
                            spy6.args[0][1].should.be.instanceOf(Elem1);
                            spy6.args[0][1].domNodes[0]
                                .should.be.equal(e2elem1.domNodes[0]);

                            spy7.should.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            Elem2._domEvents(elem1).un('click');

                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1.domNodes[0].click();

                            spy6.should.not.have.been.called;
                            spy7.should.not.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            Elem2._domEvents(elem1).un('click', spy7);

                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1.domNodes[0].click();

                            spy6.should.have.been.called;
                            spy7.should.not.have.been.called;
                        });
                    });
                });

                describe('elem as ' + elemType + ', modName, modVal', function() {
                    beforeEach(function() {
                        Block1 = bemDom.declBlock('block', {}, {
                            onInit : function() {
                                this._domEvents({ elem : elem1 })
                                    .on('click', spy1);
                                this._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' })
                                    .on('click', spy2)
                                    .on('click', spy3);
                            }
                        });

                        block1 = initBemEntity(
                            {
                                block : 'block',
                                content : [
                                    { elem : 'e1' },
                                    { elem : 'e1', elemMods : { m1 : 'v1' } }
                                ]
                            },
                            Block1);
                    });

                    it('should properly bind handlers', function() {
                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domNodes[0].click();

                        spy1.should.have.been.called;
                        spy2.should.have.been.called;

                        block1._elem('e1').domNodes[0].click();

                        spy1.should.have.been.calledTwice;
                        spy2.should.have.been.calledOnce;
                    });

                    it('should properly unbind all handlers', function() {
                        Block1._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click');

                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domNodes[0].click();

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                    });

                    it('should properly unbind specified handler', function() {
                        Block1._domEvents({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click', spy2);

                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' }).domNodes[0].click();

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                        spy3.should.have.been.called;
                    });
                });
            });
        });
    });
});

provide();

var initedDom = [];

function initDom(bemjson) {
    var res = bemDom.append(bemDom.scope, BEMHTML.apply(bemjson));
    initedDom.push(res);
    return res;
}

function destructDom() {
    var domNode;
    while(domNode = initedDom.pop()) bemDom.destruct(domNode);
}

function initBemEntity(bemjson, entityCls) {
    return bemDom.getEntity(initDom(bemjson), entityCls);
}

function windowDispatchEvent(eventName) {
    var event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    window.dispatchEvent(event);
}

// shim for PhantomJS < 2.0.0
['click', 'dblclick'].forEach(function(eventName) {
    HTMLElement.prototype[eventName] || (HTMLElement.prototype[eventName] = function() {
        var e = document.createEvent('MouseEvent');
        e.initMouseEvent(
            eventName,
            true, // bubble
            true, // cancelable
            window,
            null,
            0, 0, 0, 0, // coordinates
            false, false, false, false, // modifier keys
            0, // button=left
            null);
        this.dispatchEvent(e);
    });
});

});
