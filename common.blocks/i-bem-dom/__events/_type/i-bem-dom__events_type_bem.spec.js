modules.define(
    'spec',
    ['i-bem', 'i-bem-dom', 'objects', 'events', 'jquery', 'chai', 'sinon', 'BEMHTML'],
    function(provide, BEM, BEMDOM, objects, events, $, chai, sinon, BEMHTML) {

describe('BEM events', function() {
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
        BEMDOM.destruct(BEMDOM.scope, true);

        objects.each(BEM.entities, function(_, entityName) {
            delete BEM.entities[entityName];
        });
    });

    function initDom(bemjson) {
        return createDomNode(bemjson).appendTo(BEMDOM.scope);
    }

    describe('on instance events', function() {
        describe('block BEM events', function() {
            beforeEach(function() {
                Block1 = BEMDOM.declBlock('block1', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._events()
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3))
                                    .on({ modName : 'm1', modVal : 'v1' }, spy4)
                                    .on({ modName : 'm1', modVal : '*' }, spy5)
                                    .on({ modName : 'm2', modVal : true }, spy6)
                                    .once('click', spy7);
                            }
                        }
                    }
                });

                Block2 = BEMDOM.declBlock('block2', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._events()
                                    .on('click', spy5);
                            }
                        }
                    }
                });

                block1 = initDom({
                    block : 'block1',
                    mix : { block : 'block2', js : true }
                }).bem(Block1);
            });

            it('should properly bind handlers', function() {
                block1._emit('click');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                var spy3args = spy3.args[0];
                spy3args[0].should.be.instanceOf(events.Event);
                spy3args[1].should.be.instanceOf(Block1);
                spy3args[1].should.be.equal(block1);
                spy3args[2].should.have.been.equal(data);
            });

            it('should properly bind once handler', function() {
                block1._emit('click');
                spy7.should.have.been.called;

                block1._emit('click');
                spy7.should.have.been.calledOnce;
            });

            it('should properly bind the same handler', function() {
                block1._events()
                    .on('click', spy8)
                    .on('click', spy8);

                block1._emit('click');
                spy8.should.have.been.calledOnce;

                block1._events().un('click', spy8);
                block1._emit('click');
                spy8.should.have.been.calledOnce;
            });

            it('should not handle homonymous dom event', function() {
                block1.domElem.trigger('click');
                spy1.should.not.have.been.called;
            });

            it('should not handle homonymous bem event', function() {
                block1._domEvents().on('click', spy8);
                block1._emit('click');
                spy8.should.not.have.been.called;
            });

            it('should properly unbind all handlers', function() {
                block1._events().un('click');
                block1._emit('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._events().un('click', spy1);
                block1._emit('click');

                spy1.should.not.have.been.called;
                spy3.should.have.been.called;
            });

            it('should unbind only own handlers', function() {
                block1._events().un('click');
                block1._emit('click');
                block1.findMixedBlock(Block2)._emit('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                spy5.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                block1._events().un('click', spy7);
                block1._emit('click');
                spy7.should.not.have.been.called;
            });

            it('should properly emit event as instance (not string)', function() {
                var e = new events.Event('click');
                block1._emit(e);
                spy1.args[0][0].should.be.equal(e);
            });

            it('should handle modifier change events', function() {
                block1.setMod('m1', 'v1');

                spy4.should.have.been.called;
                spy4.args[0][0].should.be.instanceOf(events.Event);
                var eventData = spy4.args[0][1];
                eventData.modName.should.be.equal('m1');
                eventData.modVal.should.be.equal('v1');
                eventData.oldModVal.should.be.equal('');

                spy5.should.have.been.called;

                block1.delMod('m1');

                spy4.should.have.been.calledOnce;
                spy5.should.have.been.calledTwice;

                spy6.should.not.have.been.called;

                block1.setMod('m2');

                spy6.should.have.been.called;
            });

            it('should emit only destructing event after destruction', function() {
                block1._events().on({ modName : 'js', modVal : '' }, spy8);

                BEMDOM.destruct(block1.domElem);
                block1.setMod('m1', 'v1');

                spy8.should.have.been.called;

                spy4.should.not.been.called;
                spy5.should.not.been.called;
            });
        });

        describe('block instance events', function() {
            var block2_1, block2_2;
            beforeEach(function() {
                Block1 = BEMDOM.declBlock('block1', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._events(block2_1 = this.findChildBlocks(Block2)[0])
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3));

                                this._events(block2_2 = this.findChildBlocks(Block2)[1])
                                    .on('click', spy5);
                            }
                        }
                    }
                });

                Block2 = BEMDOM.declBlock('block2');

                block1 = initDom({
                    block : 'block1',
                    content : [
                        { block : 'block2' },
                        { block : 'block2' }
                    ]
                }).bem(Block1);
            });

            it('should properly bind handlers', function() {
                block2_1._emit('click');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][0].should.be.instanceOf(events.Event);
                spy3.args[0][1].should.be.equal(block2_1);
                spy3.args[0][2].should.be.equal(data);

                spy5.should.not.have.been.called;
            });

            it('should properly unbind all handlers', function() {
                block1._events(block2_1).un('click');
                block2_1._emit('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                spy5.should.not.have.been.called;

                block2_2._emit('click');

                spy5.should.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block1._events(block2_1).un('click', spy1);
                block2_1._emit('click');

                spy1.should.not.have.been.called;
                spy3.should.have.been.called;
            });
        });

        describe('nested blocks events', function() {
            beforeEach(function() {
                Block1 = BEMDOM.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._events(Block2).on('click', wrapSpy(spy1));
                            }
                        }
                    }
                });

                Block2 = BEMDOM.declBlock('block2');

                block1 = initDom({
                    block : 'block',
                    content : [
                        {
                            block : 'block2',
                            content : { block : 'block2' }
                        }
                    ]
                }).bem(Block1);
            });

            it('should properly handle events (bound in class context) from nested block', function() {
                var block2 = block1.findChildBlocks(Block2)[1];
                block2._emit('click');

                spy1.should.have.been.calledOnce;
                spy1.args[0][1].should.be.equal(block2);
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
                            BEMDOM.declElem('block', 'e1');

                        Block1 = BEMDOM.declBlock('block', {
                            onSetMod : {
                                'js' : {
                                    'inited' : function() {
                                         this._events(elem1)
                                            .on('click', spy1)
                                            .on('click', spy2)
                                            .on('click', data, spy3);

                                         this._events('e2').on('click', spy5);
                                    }
                                }
                            }
                        });

                        Block2 = BEMDOM.declBlock('block2');

                        Elem1 = elemType === 'string'?
                            BEMDOM.declElem('block', 'e1') :
                            elem1;
                        Elem2 = BEMDOM.declElem('block', 'e2', {
                            onSetMod : {
                                'js' : {
                                    'inited' : function() {
                                        this._events(elem1)
                                            .on('click', wrapSpy(spy6))
                                            .on('click', spy7);
                                    }
                                }
                            }
                        });

                        block1 = initDom({
                            block : 'block',
                            content : [
                                { elem : 'e1', content : { elem : 'e3' } },
                                { elem : 'e2', content : { elem : 'e1' } },
                                { elem : 'e4', js : { id : 'ie4' } },
                                { elem : 'e4', js : { id : 'ie4' } },
                                { elem : 'e5', content : { elem : 'e5' } }
                            ]
                        }).bem(Block1);

                        elem2 = block1._elem('e2');
                    });

                    describe('block', function() {
                        it('should properly handle events on elems with multiple DOM nodes', function() {
                            block1._events('e4').on('click', spy8);

                            block1._elem('e4')._emit('click');

                            spy8.should.have.been.calledOnce;
                        });

                        it('should properly handle events (bound in class context) from nested elems', function() {
                            block1._events('e5').on('click', wrapSpy(spy8));

                            var nestedE5 = block1.findChildElems('e5')[1];
                            nestedE5._emit('click');

                            spy8.should.have.been.calledOnce;
                            spy8.args[0][0].bemTarget.domElem[0]
                                .should.be.equal(nestedE5.domElem[0]);
                        });

                        it('should properly bind handlers', function() {
                            block1._elem('e3')._emit('click');
                            spy1.should.not.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            block1._events(elem1).un('click');
                            block1._elem(elem1)._emit('click');

                            spy1.should.not.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.not.have.been.called;

                            elem2._emit('click');

                            spy5.should.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            block1._events(elem1).un('click', spy2);
                            block1._elem(elem1)._emit('click');

                            spy1.should.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.have.been.called;
                        });
                    });

                    describe('elem instance', function() {
                        it('should properly bind handlers', function() {
                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1._emit('click');

                            spy6.should.have.been.called;
                            spy6.should.have.been.calledOn(elem2);
                            spy6.args[0][1].should.be.instanceOf(Elem1);
                            spy6.args[0][1].domElem[0]
                                .should.be.equal(e2elem1.domElem[0]);

                            spy7.should.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            elem2._events(elem1).un('click');

                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1._emit('click');

                            spy6.should.not.have.been.called;
                            spy7.should.not.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            elem2._events(elem1).un('click', spy7);

                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1._emit('click');

                            spy6.should.have.been.called;
                            spy7.should.not.have.been.called;
                        });
                    });
                });

                describe('elem as ' + elemType + ', modName, modVal', function() {
                    beforeEach(function() {
                        Block1 = BEMDOM.declBlock('block', {
                            onSetMod : {
                                'js' : {
                                    'inited' : function() {
                                        this._events({ elem : elem1 })
                                            .on('click', spy1);
                                        this._events({ elem : elem1, modName : 'm1', modVal : 'v1' })
                                            .on('click', spy2)
                                            .on('click', spy3);
                                    }
                                }
                            }
                        });

                        block1 = createDomNode({
                            block : 'block',
                            content : [
                                { elem : 'e1' },
                                { elem : 'e1', elemMods : { m1 : 'v1' } }
                            ]
                        }).bem(Block1);
                    });

                    it('should properly bind handlers', function() {
                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' })._emit('click');

                        spy1.should.have.been.called;
                        spy2.should.have.been.called;

                        block1._elem('e1')._emit('click');

                        spy1.should.have.been.calledTwice;
                        spy2.should.have.been.calledOnce;
                    });

                    it('should properly unbind all handlers', function() {
                        block1._events({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click');

                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' })._emit('click');

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                    });

                    it('should properly unbind specified handler', function() {
                        block1._events({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click', spy2);

                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' })._emit('click');

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                        spy3.should.have.been.called;
                    });
                });
            });
        });

        describe('stop propagation', function() {
            beforeEach(function() {
                Block1 = BEMDOM.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._events(Block3).on('click', spy1);
                            }
                        }
                    }
                });

                Block2 = BEMDOM.declBlock('block2', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this._events(Block3).on('click', function(e) {
                                    e.stopPropagation();
                                    spy2();
                                });
                            }
                        }
                    }
                });

                Block3 = BEMDOM.declBlock('block3');

                block1 = initDom({
                    block : 'block',
                    content : [
                        {
                            block : 'block2',
                            js : true,
                            content : { block : 'block3' }
                        }
                    ]
                }).bem(Block1);
            });

            it('should properly stop propagation', function() {
                var block3 = block1.findChildBlock(Block3);
                block3._emit('click');

                spy2.should.have.been.called;
                spy1.should.not.have.been.called;
            });
        });
    });

    describe('live events', function() {
        function initDom(bemjson) {
            return createDomNode(bemjson).appendTo(BEMDOM.scope);
        }

        describe('block events', function() {
            beforeEach(function() {
                Block1 = BEMDOM.declBlock('block1', {}, {
                    live : function() {
                        this._events()
                            .on('click', spy1)
                            .on('click', spy2)
                            .on('click', data, wrapSpy(spy3))
                            .once('click', spy4)
                            .on({ modName : 'm1', modVal : 'v1' }, spy6)
                            .on({ modName : 'm1', modVal : '*' }, spy7)
                            .on({ modName : 'm2', modVal : true }, spy8);
                    }
                });

                Block2 = BEMDOM.declBlock('block2', {}, {
                    live : function() {
                        this._events()
                            .on('click', spy5);
                    }
                });

                block1 = initDom({
                    block : 'block1',
                    mix : { block : 'block2', js : true }
                }).bem(Block1);
            });

            it('should properly bind handlers', function() {
                block1._emit('click');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.should.have.been.calledOn(block1);
                spy3.args[0][1].should.be.instanceOf(Block1);
                spy3.args[0][2].should.have.been.equal(data);

                spy5.should.not.have.been.called;
            });

            it('should properly bind once handler', function() {
                block1._emit('click');
                spy4.should.have.been.called;

                block1._emit('click');
                spy4.should.have.been.calledOnce;
            });

            it('should properly unbind all handlers', function() {
                Block1._events().un('click');
                block1._emit('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                Block1._events().un('click', spy1);
                block1._emit('click');

                spy1.should.not.have.been.called;
                spy3.should.have.been.called;
            });

            it('should unbind only own handlers', function() {
                Block1._events().un('click');
                block1._emit('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;

                block1
                    .findMixedBlock(Block2)
                    ._emit('click');

                spy5.should.have.been.called;
            });

            it('should properly unbind once handler', function() {
                Block1._events().un('click', spy4);
                block1._emit('click');
                spy4.should.not.have.been.called;
            });

            it('should handle modifier change events', function() {
                block1.setMod('m1', 'v1');

                spy6.should.have.been.called;
                var eventData = spy6.args[0][1];
                eventData.modName.should.be.equal('m1');
                eventData.modVal.should.be.equal('v1');
                eventData.oldModVal.should.be.equal('');

                spy7.should.have.been.called;

                block1.delMod('m1');

                spy6.should.have.been.calledOnce;
                spy7.should.have.been.calledTwice;

                spy8.should.not.have.been.called;

                block1.setMod('m2');

                spy8.should.have.been.called;
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
                            BEMDOM.declElem('block', 'e1');

                        Block1 = BEMDOM.declBlock('block', {}, {
                            live : function() {
                                this._events(elem1)
                                    .on('click', spy1)
                                    .on('click', spy2)
                                    .on('click', data, wrapSpy(spy3));

                                this._events('e2').on('click', spy5);
                            }
                        });

                        Elem1 = elemType === 'string'?
                            BEMDOM.declElem('block', 'e1') :
                            elem1;
                        Elem2 = BEMDOM.declElem('block', 'e2', {}, {
                            live : function() {
                                this._events(elem1)
                                    .on('click', wrapSpy(spy6))
                                    .on('click', spy7);
                            }
                        });

                        block1 = initDom({
                            block : 'block',
                            content : [
                                { elem : 'e1', content : { elem : 'e3' } },
                                { elem : 'e2', content : { elem : 'e1' } }
                            ]
                        }).bem(Block1);

                        elem2 = block1._elem('e2');
                    });

                    describe('block', function() {
                        it('should properly bind handlers', function() {
                            block1._elem('e1')._emit('click');

                            spy1.should.have.been.called;
                            spy1.should.have.been.calledOn(block1);

                            spy2.should.have.been.called;

                            spy3.should.have.been.called;
                            spy3.args[0][0].data.should.have.been.equal(data);
                            spy3.args[0][1].should.be.instanceOf(Elem1);
                            spy3.args[0][1].domElem[0]
                                .should.be.equal(block1._elem(elem1).domElem[0]);

                            spy5.should.not.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            Block1._events(elem1).un('click');
                            block1._elem(elem1)._emit('click');

                            spy1.should.not.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.not.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            Block1._events(elem1).un('click', spy2);
                            block1._elem(elem1)._emit('click');

                            spy1.should.have.been.called;
                            spy2.should.not.have.been.called;
                            spy3.should.have.been.called;
                        });
                    });

                    describe('elem instance', function() {
                        it('should properly bind handlers', function() {
                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1._emit('click');

                            spy6.should.have.been.called;
                            spy6.should.have.been.calledOn(elem2);
                            spy6.args[0][1].should.be.instanceOf(Elem1);
                            spy6.args[0][1].domElem[0]
                                .should.be.equal(e2elem1.domElem[0]);

                            spy7.should.have.been.called;
                        });

                        it('should properly unbind all handlers', function() {
                            Elem2._events(elem1).un('click');

                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1._emit('click');

                            spy6.should.not.have.been.called;
                            spy7.should.not.have.been.called;
                        });

                        it('should properly unbind specified handler', function() {
                            Elem2._events(elem1).un('click', spy7);

                            var e2elem1 = elem2.findChildElem('e1');
                            e2elem1._emit('click');

                            spy6.should.have.been.called;
                            spy7.should.not.have.been.called;
                        });
                    });
                });

                describe('elem as ' + elemType + ', modName, modVal', function() {
                    beforeEach(function() {
                        Block1 = BEMDOM.declBlock('block', {}, {
                            live : function() {
                                this._events({ elem : elem1 })
                                    .on('click', spy1);
                                this._events({ elem : elem1, modName : 'm1', modVal : 'v1' })
                                    .on('click', spy2)
                                    .on('click', spy3);
                            }
                        });

                        block1 = initDom({
                            block : 'block',
                            content : [
                                { elem : 'e1' },
                                { elem : 'e1', elemMods : { m1 : 'v1' } }
                            ]
                        }).bem(Block1);
                    });

                    it('should properly bind handlers', function() {
                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' })._emit('click');

                        spy1.should.have.been.called;
                        spy2.should.have.been.called;

                        block1._elem('e1')._emit('click');

                        spy1.should.have.been.calledTwice;
                        spy2.should.have.been.calledOnce;
                    });

                    it('should properly unbind all handlers', function() {
                        Block1._events({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click');

                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' })._emit('click');

                        spy1.should.have.been.called;
                        spy2.should.not.have.been.called;
                    });

                    it('should properly unbind specified handler', function() {
                        Block1._events({ elem : elem1, modName : 'm1', modVal : 'v1' }).un('click', spy2);

                        block1._elem({ elem : 'e1', modName : 'm1', modVal : 'v1' })._emit('click');

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

function createDomNode(bemjson) {
    return BEMDOM.init(BEMHTML.apply(bemjson));
}

});
