modules.define(
    'spec',
    ['i-bem', 'i-bem-dom', 'objects', 'jquery', 'sinon', 'BEMHTML'],
    function(provide, BEM, BEMDOM, objects, $, sinon, BEMHTML) {

describe('i-bem-dom', function() {
    describe('getMod', function() {
        it('should return properly extracted mod from html', function() {
            var Block = BEMDOM.declBlock('block'),
                rootNode;

            [
                {
                    cls : '',
                    val : ''
                },
                {
                    cls : 'block_m1_v1',
                    val : 'v1'
                },
                {
                    cls : 'block_m1_v1 bla-block_m1_v2',
                    val : 'v1'
                },
                {
                    cls : 'bla-block_m1_v2 block_m1_v1',
                    val : 'v1'
                },
                {
                    cls : 'block_m1',
                    val : true
                }
            ].forEach(function(data) {
                (rootNode = $('<div class="' + data.cls + '"/>')).bem(Block).getMod('m1')
                    .should.be.eql(data.val);
                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });
    });

    describe('getMods', function() {
        it('should return properly extracted block mods from html', function() {
            var Block = BEMDOM.declBlock('block'),
                rootNode;

            [
                {
                    cls : '',
                    mods : { js : 'inited' }
                },
                {
                    cls : 'block_m1_v1',
                    mods : { js : 'inited', m1 : 'v1' }
                },
                {
                    cls : 'block_m1_v1 block_m2_v2 bla-block_m4_v3 block_m4_v4',
                    mods : { js : 'inited', m1 : 'v1', m2 : 'v2', m4 : 'v4' }
                },
                {
                    cls : 'bla-block_m1_v1 block_m2_v2 block_m3_v3 bla-block_m3_v4 block_m4',
                    mods : { js : 'inited', m2 : 'v2', m3 : 'v3', m4 : true }
                }
            ].forEach(function(data) {
                (rootNode = $('<div class="' + data.cls + '"/>')).bem(Block).getMods()
                    .should.be.eql(data.mods);
                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });

        it('should return properly extracted elem mods from html', function() {
            var Block = BEMDOM.declBlock('block'),
                rootNode;

            [
                {
                    cls : 'block__e1_m1_v1',
                    mods : { m1 : 'v1' }
                },
                {
                    cls : 'block__e1_m1_v1 block__e1_m2_v2 bla-block__e1_m4_v3 block__e1_m4_v4',
                    mods : { m1 : 'v1', m2 : 'v2', m4 : 'v4' }
                },
                {
                    cls : 'bla-block__e1_m1_v1 block__e1_m2_v2 block__e1_m3_v3 bla-block__e1_m3_v4 block__e1_m4',
                    mods : { m2 : 'v2', m3 : 'v3', m4 : true }
                }
            ].forEach(function(data) {
                var block = (rootNode = $('<div class="block block__e1 ' + data.cls + '"/>')).bem(Block);
                block.getMods(block.elem('e1')).should.be.eql(data.mods);
                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });
    });

    describe('setMod', function() {
        it('should properly set CSS classes', function() {
            var Block = BEMDOM.declBlock('block'),
                rootNode;

            [
                {
                    beforeCls : 'block i-bem',
                    afterCls : 'block i-bem block_js_inited block_m1_v1',
                    mods : { m1 : 'v1' }
                },
                {
                    beforeCls : 'block i-bem block_m6 block_m7_v7',
                    afterCls : 'block i-bem block_js_inited block_m1_v1 block_m2_v2 block_m3 block_m4_v4 block_m5',
                    mods : { m1 : 'v1', m2 : 'v2', m3 : true, m4 : 'v4', m5 : true, m6 : false, m7 : '' }
                }
            ].forEach(function(data) {
                var block = (rootNode = $('<div class="' + data.beforeCls + '"/>')).bem(Block);

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        block.setMod(modName) :
                        block.setMod(modName, modVal);
                });

                block.domElem[0].className.should.be.equal(data.afterCls);

                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });

        it('should properly set elem CSS classes', function() {
            var Block = BEMDOM.declBlock('block'),
                rootNode;

            [
                {
                    beforeCls : 'block__elem',
                    afterCls : 'block__elem block__elem_m1_v1',
                    mods : { m1 : 'v1' }
                },
                {
                    beforeCls : 'block__elem block__elem_m6 block__elem_m7_v7',
                    afterCls : 'block__elem block__elem_m1_v1 block__elem_m2_v2 block__elem_m3 block__elem_m4_v4 block__elem_m5',
                    mods : { m1 : 'v1', m2 : 'v2', m3 : true, m4 : 'v4', m5 : true, m6 : false, m7 : '' }
                }
            ].forEach(function(data) {
                var block = (rootNode = $('<div class="block"><div class="' + data.beforeCls + '"/></div>')).bem(Block),
                    elem = block.elem('elem');

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        block.setMod(elem, modName) :
                        block.setMod(elem, modName, modVal);
                });

                elem[0].className.should.be.equal(data.afterCls);

                BEMDOM.destruct(rootNode);
            });

            delete BEM.blocks['block'];
        });
    });

    describe('elemify', function() {
        var rootNode, instance;
        beforeEach(function() {
            var Block = BEMDOM.declBlock('block');
            rootNode = BEMDOM.init(BEMHTML.apply({
                block : 'block',
                js : true,
                content : { elem : 'e1', mix : { elem : 'e2' } }
            }));
            instance = rootNode.bem(Block);
        });
        afterEach(function() {
            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block'];
        });

        it('shouldn\'t change given elem', function() {
            var elem1 = instance.elem('e1');
            instance.elemify(elem1, 'e2');
            instance.__self._extractElemNameFrom(elem1).should.be.equal('e1');
        });

        it('should return', function() {
            var elem = instance.elemify(instance.elem('e1'), 'e2');
            instance.__self._extractElemNameFrom(elem).should.be.equal('e2');
        });
    });

    describe('findBlocksInside', function() {
        function getBlockIds(blocks) {
            return blocks.map(function(block) {
                return block.params.id;
            });
        }

        var rootNode, rootBlock, B1Block;
        beforeEach(function() {
            var RootBlock = BEMDOM.declBlock('root');
            B1Block = BEMDOM.declBlock('b1');
            rootNode = $(BEMHTML.apply(
                {
                    block : 'root',
                    content : {
                        block : 'b1',
                        js : { id : '1' },
                        content : [
                            { block : 'b2' },
                            {
                                block : 'b1',
                                mods : { m1 : 'v1' },
                                js : { id : '2' }
                            },
                            {
                                block : 'b3',
                                content : {
                                    block : 'b1',
                                    mods : { m1 : 'v2' },
                                    js : { id : '3' },
                                    content : {
                                        block : 'b1',
                                        mods : { m1 : true },
                                        js : { id : '4' }
                                    }
                                }
                            }
                        ]
                    }
                }));
            rootBlock = BEMDOM.init(rootNode).bem(RootBlock);
        });

        afterEach(function() {
            BEMDOM.destruct(rootNode);
            delete BEM.blocks['b-root'];
            delete BEM.blocks['b1'];
        });

        it('should find all blocks by block', function() {
            getBlockIds(rootBlock.findBlocksInside(B1Block)).should.be.eql(['1', '2', '3', '4']);
        });

        it('should find all blocks by block, modName and modVal', function() {
            getBlockIds(rootBlock.findBlocksInside({ block : B1Block, modName : 'm1', modVal : 'v1' }))
                .should.be.eql(['2']);
        });

        it('should find all blocks by block and boolean mod', function() {
            getBlockIds(rootBlock.findBlocksInside({ block : B1Block, modName : 'm1', modVal : true }))
                .should.be.eql(['4']);
        });
    });

    describe('BEMDOM.init', function() {
        var spy, rootNode;
        beforeEach(function() {
            spy = sinon.spy();
        });

        afterEach(function() {
            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block'];
        });

        it('should init block', function() {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            rootNode = BEMDOM.init(BEMHTML.apply({
                tag : 'div',
                content : { block : 'block', js : true }
            }));

            spy.should.have.been.called;
        });

        it('should init block with multiple DOM nodes', function(done) {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : function() {
                            this.domElem.length.should.be.equal(2);
                            done();
                        }
                    }
                }
            });

            rootNode = BEMDOM.init(BEMHTML.apply({
                tag : 'div',
                content : [
                    { block : 'block', js : { id : 'id' } },
                    { block : 'block', js : { id : 'id' } }
                ]
            }));
        });

        it('shouldn\'t init live block', function() {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            }, {
                live : true
            });

            rootNode = BEMDOM.init(BEMHTML.apply({
                tag : 'div',
                content : { block : 'block', js : true }
            }));

            BEMDOM.init(rootNode);
            spy.should.not.have.been.called;
        });

        it('should allow to pass string', function() {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            rootNode = BEMDOM.init(BEMHTML.apply({
                tag : 'div',
                content : { block : 'block', js : true }
            }));

            spy.should.have.been.called;
        });
    });

    describe('BEMDOM.destruct', function() {
        var spy, rootNode;
        beforeEach(function() {
            spy = sinon.spy();
        });

        afterEach(function() {
            delete BEM.blocks['block'];
        });

        it('should destruct block only if it has no dom nodes', function() {
            BEMDOM.declBlock('block', {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            rootNode = BEMDOM.init(BEMHTML.apply({
                tag : 'div',
                content : [
                    { block : 'block', js : { id : 'block' } },
                    { block : 'block', js : { id : 'block' } }
                ]
            }));

            BEMDOM.destruct(rootNode.find('.block :eq(0)'));
            spy.should.not.have.been.called;

            BEMDOM.destruct(rootNode.find('.block'));
            spy.should.have.been.called;

            BEMDOM.destruct(rootNode);
        });

        it('should destruct implicitly inited block', function() {
            var Block = BEMDOM.declBlock('block', {
                    onSetMod : {
                        js : {
                            '' : spy
                        }
                    }
                });

            rootNode = BEMDOM.init(BEMHTML.apply({
                tag : 'div',
                content : { block : 'block' }
            }));

            var blockNode = rootNode.find('.block');
            blockNode.bem(Block);
            BEMDOM.destruct(blockNode);
            spy.should.have.been.called;
        });
    });

    describe('BEMDOM.update', function() {
        it('should properly update tree', function() {
            var spyBlock1Destructed = sinon.spy(),
                spyBlock2Inited = sinon.spy();

            BEMDOM.declBlock('block1', {
                onSetMod : {
                    js : {
                        '' : spyBlock1Destructed
                    }
                }
            });
            BEMDOM.declBlock('block2', {
                onSetMod : {
                    js : {
                        inited : spyBlock2Inited
                    }
                }
            });

            var rootNode = BEMDOM.init(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block1', js : true } }));

            BEMDOM.update(rootNode, BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.called.should.be.true;
            spyBlock2Inited.called.should.be.true;

            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block1'];
            delete BEM.blocks['block2'];
        });

        it('should allow to pass simple string', function() {
            var domElem = $('<div/>');
            BEMDOM.update(domElem, 'simple string');
            domElem.html().should.be.equal('simple string');
        });
    });

    describe('BEMDOM.replace', function() {
        it('should properly replace tree', function() {
            var spyBlock1Destructed = sinon.spy(),
                spyBlock2Inited = sinon.spy();

            BEMDOM.declBlock('block1', {
                onSetMod : {
                    js : {
                        '' : spyBlock1Destructed
                    }
                }
            });
            BEMDOM.declBlock('block2', {
                onSetMod : {
                    js : {
                        inited : spyBlock2Inited
                    }
                }
            });

            var rootNode = BEMDOM.init(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block1', js : true }
                }));

            BEMDOM.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledOnce;
            spyBlock2Inited.should.have.been.calledOnce;

            rootNode.html().should.be.equal('<div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div>');

            BEMDOM.destruct(rootNode);

            rootNode = BEMDOM.init(BEMHTML.apply({
                    tag : 'div',
                    content : [{ tag : 'p' }, { block : 'block1', js : true }, { tag : 'p' }]
                }));

            BEMDOM.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledTwice;
            spyBlock2Inited.should.have.been.calledTwice;

            rootNode.html().should.be.equal('<p></p><div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div><p></p>');

            delete BEM.blocks['block1'];
            delete BEM.blocks['block2'];
        });
    });

    describe('params', function() {
        it('should properly join params', function() {
            var Block = BEMDOM.declBlock('block', {
                    getDefaultParams : function() {
                        return { p1 : 1 };
                    }
                });

            BEMDOM.declBlock('block2', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            var params = this.findBlockOn(Block).params;
                            params.p1.should.be.equal(1);
                            params.p2.should.be.equal(2);
                            params.p3.should.be.equal(3);
                        }
                    }
                }
            });

            var rootNode = BEMDOM.init(BEMHTML.apply({
                    tag : 'div',
                    content : [
                        { block : 'block', js : { id : 'bla', p2 : 2 }, mix : { block : 'block2', js : true } },
                        { block : 'block', js : { id : 'bla', p3 : 3 } }
                    ]
                }));

            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block'];
            delete BEM.blocks['block2'];
        });
    });

    describe('emit', function() {
        it('should emit context event with target', function() {
            var Block = BEMDOM.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this.emit('event');
                            }
                        }
                    }
                }),
                rootNode = $('<div/>'),
                spy = sinon.spy();

            BEM.blocks['block'].on(rootNode, 'event', spy);
            BEMDOM.update(rootNode, BEMHTML.apply({ block : 'block', js : true }));

            var block = rootNode.find('.block').bem(Block);

            spy.should.have.been.calledOnce;
            spy.args[0][0].target.should.be.equal(block);

            delete BEM.blocks['block'];
        });
    });

    describe('containsDomElem', function() {
        var domElem, block, block2;
        beforeEach(function() {
            var Block = BEMDOM.declBlock('block'),
                Block2 = BEMDOM.declBlock('block2');

            domElem = $(BEMHTML.apply([
                {
                    block : 'block',
                    js : { id : '1' },
                    content : [
                        { elem : 'e1' },
                        { elem : 'e2' }
                    ]
                },
                {
                    block : 'block',
                    js : { id : '1' },
                    content : [
                        { elem : 'e1' },
                        { elem : 'e2', content : { elem : 'e2-1' } }
                    ]
                },
                {
                    block : 'block2'
                }
            ]));

            BEMDOM.init(domElem);
            block = domElem.filter('.block').bem(Block);
            block2 = domElem.filter('.block2').bem(Block2);
        });

        afterEach(function() {
            BEMDOM.destruct(domElem);
            delete BEM.blocks['block'];
            delete BEM.blocks['block2'];
        });

        it('should properly checks for nested dom elem', function() {
            block.containsDomElem(block.elem('e2-1')).should.be.true;
            block.containsDomElem(block2.domElem).should.be.false;
        });

        it('should properly checks for nested dom elem with given context', function() {
            block.containsDomElem(block.elem('e1'), block.elem('e2-1')).should.be.false;
            block.containsDomElem(block.elem('e2'), block.elem('e2-1')).should.be.true;
        });
    });

    describe('DOM events', function() {
        var Block, block, spy1, spy2, spy3, spy4, spy5,
            data = { data : 'data' };

        beforeEach(function() {
            spy1 = sinon.spy();
            spy2 = sinon.spy();
            spy3 = sinon.spy();
            spy4 = sinon.spy();
            spy5 = sinon.spy();
        });

        afterEach(function() {
            BEMDOM.destruct(block.domElem);
            delete BEM.blocks['block'];
        });

        describe('block domElem events', function() {
            beforeEach(function() {
                Block = BEMDOM.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this
                                    .bindTo('click', spy1)
                                    .bindTo('click', spy2)
                                    .bindTo('click', data, spy3)
                                    .bindTo({ 'click' : spy4 }, data);
                            }
                        }
                    }
                });
                block = BEMDOM.init(BEMHTML.apply({ block : 'block' })).bem(Block);
            });

            it('should properly bind handlers', function() {
                block.domElem.trigger('click');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.args[0][0].data.should.have.been.equal(data);
                spy4.args[0][0].data.should.have.been.equal(data);
            });

            it('should properly unbind all handlers', function() {
                block.unbindFrom('click');
                block.domElem.trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block.unbindFrom('click', spy1);
                block.domElem.trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
            });
        });

        describe('block elems (as string) events', function() {
            var spy3;

            beforeEach(function() {
                spy3 = sinon.spy();
                Block = BEMDOM.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this
                                    .bindTo('e1', 'click', spy1)
                                    .bindTo('e2', 'click', spy2)
                                    .bindTo('e2', 'click', spy3)
                                    .bindTo('e2', 'click', data, spy4)
                                    .bindTo('e2', { 'click' : spy5 }, data);
                            }
                        }
                    }
                });
                block = BEMDOM.init(BEMHTML.apply({ block : 'block', content : [{ elem : 'e1' }, { elem : 'e2' }] }))
                    .bem(Block);
            });

            it('should properly bind handlers', function() {
                block.elem('e2').trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
                spy3.should.have.been.called;

                spy4.args[0][0].data.should.have.been.equal(data);
                spy5.args[0][0].data.should.have.been.equal(data);
            });

            it('should properly unbind all handlers', function() {
                block.unbindFrom('e2', 'click');
                block.elem('e2').trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
                spy3.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block.unbindFrom('e2', 'click', spy2);
                block.elem('e2').trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
                spy3.should.have.been.called;
            });
        });

        describe('block elems (as $) events', function() {
            var spy3;

            beforeEach(function() {
                spy3 = sinon.spy();
                Block = BEMDOM.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this
                                    .bindTo(this.elem('e1'), 'click', spy1)
                                    .bindTo(this.elem('e2'), 'click', spy2)
                                    .bindTo(this.elem('e2'), 'click', spy3)
                                    .bindTo(this.elem('e2'), 'click', data, spy4)
                                    .bindTo(this.elem('e2'), { 'click' : spy5 }, data);
                            }
                        }
                    }
                });
                block = BEMDOM.init(BEMHTML.apply({ block : 'block', content : [{ elem : 'e1' }, { elem : 'e2' }] }))
                    .bem(Block);
            });

            it('should properly bind handlers', function() {
                block.elem('e2').trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
                spy3.should.have.been.called;

                spy4.args[0][0].data.should.have.been.equal(data);
                spy5.args[0][0].data.should.have.been.equal(data);
            });

            it('should properly unbind all handlers', function() {
                block.unbindFrom('e2', 'click');
                block.elem('e2').trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
                spy3.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block.unbindFrom('e2', 'click', spy2);
                block.elem('e2').trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
                spy3.should.have.been.called;
            });
        });

        describe('document events', function() {
            beforeEach(function() {
                Block = BEMDOM.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this
                                    .bindToDoc('click', spy1)
                                    .bindToDoc('click', spy2)
                                    .bindToDoc('click', data, spy3)
                                    .bindToDoc({ 'click' : spy4 }, data);
                            }
                        }
                    }
                });
                block = BEMDOM.init(BEMHTML.apply({ block : 'block' })).bem(Block);
            });

            it('should properly bind handlers', function() {
                BEMDOM.doc.trigger('click');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.args[0][0].data.should.have.been.equal(data);
                spy4.args[0][0].data.should.have.been.equal(data);
            });

            it('should properly unbind all handlers', function() {
                block.unbindFromDoc('click');
                BEMDOM.doc.trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block.unbindFromDoc('click', spy1);
                BEMDOM.doc.trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
            });

            it('should properly unbind all handlers on block destruct', function() {
                BEMDOM.destruct(block.domElem);
                BEMDOM.doc.trigger('click');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });
        });

        describe('window events', function() {
            beforeEach(function() {
                Block = BEMDOM.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this
                                    .bindToWin('resize', spy1)
                                    .bindToWin('resize', spy2)
                                    .bindToWin('resize', data, spy3)
                                    .bindToWin({ 'resize' : spy4 }, data);
                            }
                        }
                    }
                });
                block = BEMDOM.init(BEMHTML.apply({ block : 'block' })).bem(Block);
            });

            it('should properly bind handlers', function() {
                BEMDOM.win.trigger('resize');

                spy1.should.have.been.called;
                spy2.should.have.been.called;

                spy3.args[0][0].data.should.have.been.equal(data);
                spy4.args[0][0].data.should.have.been.equal(data);
            });

            it('should properly unbind all handlers', function() {
                block.unbindFromWin('resize');
                BEMDOM.win.trigger('resize');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });

            it('should properly unbind specified handler', function() {
                block.unbindFromWin('resize', spy1);
                BEMDOM.win.trigger('resize');

                spy1.should.not.have.been.called;
                spy2.should.have.been.called;
            });

            it('should properly unbind all handlers on block destruct', function() {
                BEMDOM.destruct(block.domElem);
                BEMDOM.win.trigger('resize');

                spy1.should.not.have.been.called;
                spy2.should.not.have.been.called;
            });
        });
    });

    describe('closestElem', function() {
        it('should return the closest element', function() {
            var Block = BEMDOM.declBlock('block'),
                rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem1',
                        content : {
                            elem : 'elem2'
                        }
                    }
                })),
                block = rootNode.bem(Block),
                closest = block.closestElem(block.elem('elem2'), 'elem1');

            closest[0].should.be.equal(block.elem('elem1')[0]);

            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block'];
        });
    });

    describe('liveInitOnBlockInsideEvent', function() {
        it('should init and call handler on live initialization', function() {
            var spyInit = sinon.spy(),
                spyHandler = sinon.spy(),
                Block2 = BEMDOM.declBlock('block2', {}, {}),
                Block1 = BEMDOM.declBlock('block1', {
                        onSetMod : {
                            js : {
                                inited : spyInit
                            }
                        }
                    }, {
                        live : function() {
                            this.liveInitOnBlockInsideEvent('event', Block2, spyHandler);
                        }
                    }),
                rootNode = BEMDOM.init(BEMHTML.apply({
                    block : 'block1',
                    js : true,
                    content : {
                        block : 'block2',
                        js : true
                    }
                })),
                block = rootNode.find('.block2').bem(Block2);

            spyInit.called.should.be.false;
            spyHandler.called.should.be.false;

            block.emit('event');

            spyInit.called.should.be.true;
            spyHandler.called.should.be.true;

            BEMDOM.destruct(rootNode);
            delete BEM.blocks['block1'];
            delete BEM.blocks['block2'];
        });
    });

    describe('modules.define patching', function() {
        it('should provide BEMDOM block', function(done) {
            var name = 'b' + Math.random(),
                spy = sinon.spy();

            modules.define(name, ['i-bem-dom'], function(provide, BEMDOM) {
                spy();
                provide(BEMDOM.declBlock(this.name, {}));
            });

            modules.define(name, function(provide, Prev) {
                spy();
                Prev.should.be.eql(BEM.blocks[this.name]);
                provide(BEMDOM.declBlock(this.name, {}));
            });

            modules.require([name], function(Block) {
                spy.should.have.been.calledTwice;
                Block.should.be.eql(BEM.blocks[name]);
                done();
            });
        });
    });

    describe('mod change events', function() {
        var block;
        beforeEach(function() {
            block = $(BEMHTML.apply(
                {
                    block : 'block',
                    content : [
                        { elem : 'e1', mods : { 'mod1' : 'val1' } },
                        { elem : 'e1', mods : { 'mod1' : 'val1' } },
                        { elem : 'e2', mods : { 'mod1' : 'val1' } }
                    ]
                }))
                    .bem(BEMDOM.declBlock('block'));
        });

        afterEach(function() {
            delete BEM.blocks['block'];
        });

        it('should propagate destructing event', function() {
            var spy = sinon.spy(),
                Block1 = BEMDOM.declBlock('block1', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                Block2.on(this.domElem, { modName : 'js', modVal : '' }, spy);
                            }
                        }
                    }
                }),
                Block2 = BEMDOM.declBlock('block2'),
                domElem = $(BEMHTML.apply({
                    block : 'block1',
                    content : {
                        block : 'block2'
                    }
                })).appendTo('body');

            BEMDOM.init(domElem);

            var block1 = domElem.bem(Block1),
                block2 = block1.findBlockInside(Block2);

            BEMDOM.destruct(block2.domElem);

            spy.should.have.been.called;

            delete BEM.blocks['block2'];
            delete BEM.blocks['block1'];
        });

        describe('elems', function() {
            it('should emit event on elem mod change with correct arguments', function() {
                var spy1 = sinon.spy(),
                    spy2 = sinon.spy(),
                    spy3 = sinon.spy(),
                    spy4 = sinon.spy(),
                    elem = block.elem('e1');

                block
                    .on({ elem : 'e1', modName : 'mod1', modVal : '*' }, spy1)
                    .on({ elem : 'e1', modName : 'mod1', modVal : 'val2' }, spy2)
                    .on({ elem : 'e1', modName : 'mod1', modVal : 'val3' }, spy3)
                    .on({ elem : 'e2', modName : 'mod1', modVal : 'val2' }, spy4)
                    .setMod(elem, 'mod1', 'val2');

                spy1.should.have.been.called.twice;
                spy2.should.have.been.called.twice;
                spy3.should.not.have.been.called;
                spy4.should.not.have.been.called;

                var eventData = spy1.args[0][1];
                eventData.modName.should.be.equal('mod1');
                eventData.modVal.should.be.equal('val2');
                eventData.oldModVal.should.be.equal('val1');
                eventData.elem[0].should.be.eql(elem[0]);
                spy1.args[1][1].elem[0].should.be.eql(elem[1]);
            });

            it('should emit live event on elem mod change with correct arguments', function() {
                var spy1 = sinon.spy(),
                    spy2 = sinon.spy(),
                    spy3 = sinon.spy(),
                    spy4 = sinon.spy(),
                    elem = block.elem('e1');

                BEM.blocks['block']
                    .on({ elem : 'e1', modName : 'mod1', modVal : '*' }, spy1)
                    .on({ elem : 'e1', modName : 'mod1', modVal : 'val2' }, spy2)
                    .on({ elem : 'e1', modName : 'mod1', modVal : 'val3' }, spy3)
                    .on({ elem : 'e2', modName : 'mod1', modVal : 'val2' }, spy4);

                block.setMod(elem, 'mod1', 'val2');

                spy1.should.have.been.called.twice;
                spy2.should.have.been.called.twice;
                spy3.should.not.have.been.called;
                spy4.should.not.have.been.called;

                var eventData = spy1.args[0][1];
                eventData.modName.should.be.equal('mod1');
                eventData.modVal.should.be.equal('val2');
                eventData.oldModVal.should.be.equal('val1');
                eventData.elem[0].should.be.eql(elem[0]);
                spy1.args[1][1].elem[0].should.be.eql(elem[1]);
            });
        });
    });
});

provide();

});
