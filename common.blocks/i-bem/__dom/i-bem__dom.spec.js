modules.define(
    'spec',
    ['i-bem__dom', 'objects', 'jquery', 'sinon', 'BEMHTML'],
    function(provide, DOM, objects, $, sinon, BEMHTML) {

describe('i-bem__dom', function() {
    describe('getMod', function() {
        it('should return properly extracted mod from html', function() {
            DOM.decl('block', {});

            var rootNode;
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
                (rootNode = $('<div class="' + data.cls + '"/>')).bem('block').getMod('m1')
                    .should.be.eql(data.val);
                DOM.destruct(rootNode);
            });

            delete DOM.blocks['block'];
        });
    });

    describe('getMods', function() {
        it('should return properly extracted block mods from html', function() {
            DOM.decl('block', {});

            var rootNode;
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
                (rootNode = $('<div class="' + data.cls + '"/>')).bem('block').getMods()
                    .should.be.eql(data.mods);
                DOM.destruct(rootNode);
            });

            delete DOM.blocks['block'];
        });

        it('should return properly extracted elem mods from html', function() {
            DOM.decl('block', {});

            var rootNode;
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
                var block = (rootNode = $('<div class="block block__e1 ' + data.cls + '"/>')).bem('block');
                block.getMods(block.elem('e1')).should.be.eql(data.mods);
                DOM.destruct(rootNode);
            });

            delete DOM.blocks['block'];
        });
    });

    describe('setMod', function() {
        it('should properly set CSS classes', function() {
            DOM.decl('block', {});

            var rootNode;
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
                },
                {
                    beforeCls : 'bla-block bla-block_m1_v1 bla-block_m3 block i-bem block_m6 block_m7_v7',
                    afterCls : 'bla-block bla-block_m1_v1 bla-block_m3 block i-bem block_js_inited block_m1_v1 block_m2_v2 block_m3 block_m4_v4 block_m5',
                    mods : { m1 : 'v1', m2 : 'v2', m3 : true, m4 : 'v4', m5 : true, m6 : false, m7 : '' }
                }
            ].forEach(function(data) {
                var block = (rootNode = $('<div class="' + data.beforeCls + '"/>')).bem('block');

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        block.setMod(modName) :
                        block.setMod(modName, modVal);
                });

                block.domElem[0].className.should.be.equal(data.afterCls);

                DOM.destruct(rootNode);
            });

            delete DOM.blocks['block'];
        });

        it('should properly set elem CSS classes', function() {
            DOM.decl('block', {});

            var rootNode;
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
                var block = (rootNode = $('<div class="block"><div class="' + data.beforeCls + '"/></div>')).bem('block'),
                    elem = block.elem('elem');

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        block.setMod(elem, modName) :
                        block.setMod(elem, modName, modVal);
                });

                elem[0].className.should.be.equal(data.afterCls);

                DOM.destruct(rootNode);
            });

            delete DOM.blocks['block'];
        });
    });

    describe('elem', function() {
        var rootNode, instance, e1Elems;
        function areElemsEqual(e1, e2) {
            if(e1.length !== e2.length) return false;

            var res = false;
            e1.each(function(i) {
                return res = e1[i] === e2[i];
            });
            return res;
        }

        beforeEach(function() {
            DOM.decl('block', {});
            rootNode = DOM.init($(BEMHTML.apply({
                block : 'block',
                js : true,
                content : [
                    { elem : 'e1' },
                    { elem : 'e1', elemMods : { m1 : 'v1' } },
                    { elem : 'e1', elemMods : { m1 : 'v2' } },
                    { elem : 'e1', elemMods : { m1 : 'v1' } },
                    { elem : 'e1', elemMods : { m1 : true } },
                    { elem : 'e2' }
                ]
            })));
            instance = rootNode.bem('block');
            e1Elems = instance.domElem.find('.block__e1');
        });

        afterEach(function() {
            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
        });

        it('should properly find elem by given name', function() {
            areElemsEqual(instance.elem('e1'), [e1Elems[0], e1Elems[1], e1Elems[2], e1Elems[3], e1Elems[4]])
                .should.be.true;
        });

        it('should properly find elem by given mod', function() {
            areElemsEqual(instance.elem('e1', 'm1', 'v1'), [e1Elems[1], e1Elems[3]])
                .should.be.true;
        });

        it('should properly find elem by given boolean mod with modVal', function() {
            areElemsEqual(instance.elem('e1', 'm1', true), [e1Elems[4]])
                .should.be.true;
        });

        it('should properly find elem by given boolean mod without modVal', function() {
            areElemsEqual(instance.elem('e1', 'm1'), [e1Elems[4]])
                .should.be.true;
        });
    });

    describe('elemify', function() {
        var rootNode, instance;
        beforeEach(function() {
            DOM.decl('block', {});
            rootNode = DOM.init($(BEMHTML.apply({
                block : 'block',
                js : true,
                content : { elem : 'e1', mix : { elem : 'e2' } } })));
            instance = rootNode.bem('block');
        });
        afterEach(function() {
            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
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

        var rootNode, rootBlock;
        beforeEach(function() {
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
            rootBlock = DOM.init(rootNode).bem('root');
        });

        afterEach(function() {
            DOM.destruct(rootNode);
            delete DOM.blocks['root'];
            delete DOM.blocks['b1'];
        });

        it('should find all blocks by name', function() {
            getBlockIds(rootBlock.findBlocksInside('b1')).should.be.eql(['1', '2', '3', '4']);
        });

        it('should find all blocks by name, modName and modVal', function() {
            getBlockIds(rootBlock.findBlocksInside({ block : 'b1', modName : 'm1', modVal : 'v1' }))
                .should.be.eql(['2']);
        });

        it('should find all blocks by name and boolean mod', function() {
            getBlockIds(rootBlock.findBlocksInside({ block : 'b1', modName : 'm1', modVal : true }))
                .should.be.eql(['4']);
        });

        it('should force init for found blocks', function(done) {
            DOM.decl('block', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            this.findBlocksInside('block2').map(function(block) {
                                return block.hasMod('js', 'inited');
                            }).should.be.eql([true, true]);
                            done();
                        }
                    }
                }
            });

            DOM.decl('block2');

            DOM.init(BEMHTML.apply({
                block : 'block',
                js : true,
                content : [
                    { block : 'block2', js : true },
                    { block : 'block2', js : true }
                ]
            }));

            delete DOM.blocks['block'];
            delete DOM.blocks['block2'];
        });
    });

    describe('findElem', function() {
        function getElemIds(elems) {
            return Array.prototype.map.call(elems, function(elem) {
                return elem.id;
            });
        }

        var rootNode, rootBlock;
        beforeEach(function() {
            rootNode = $(BEMHTML.apply(
                {
                    block : 'root',
                    content : [
                        { elem : 'e1', attrs : { id : '1' } },
                        {
                            elem : 'e2', attrs : { id : '2' },
                            content : [
                                {
                                    elem : 'e1', attrs : { id : '2-1' },
                                    elemMods : { inner : 'no' }
                                },
                                {
                                    elem : 'e3', attrs : { id : '2-3' },
                                    elemMods : { inner : 'no', bool : true }
                                }
                            ]
                        },
                        {
                            elem : 'e3', attrs : { id : '3' },
                            content : {
                                elem : 'e2', attrs : { id : '3-2' },
                                elemMods : { inner : 'yes', bool : true },
                                content : {
                                    elem : 'e1', attrs : { id : '3-2-1' },
                                    elemMods : { inner : 'yes', bool : true }
                                }
                            }
                        },
                        { elem : 'e2', attrs : { id : '2.' }, elemMods : { bool : true } }
                    ]
                }));
            rootBlock = DOM.init(rootNode).bem('root');
        });

        afterEach(function() {
            DOM.destruct(rootNode);
            delete DOM.blocks['root'];
        });

        it('should find all elems by name', function() {
            getElemIds(rootBlock.findElem('e1')).should.be.eql(['1', '2-1', '3-2-1']);
            getElemIds(rootBlock.findElem('e2')).should.be.eql(['2', '3-2', '2.']);
            getElemIds(rootBlock.findElem('e3')).should.be.eql(['2-3', '3']);
        });

        it('should find all elems by name, modName and modVal', function() {
            getElemIds(rootBlock.findElem('e1', 'inner', 'no')).should.be.eql(['2-1']);
            getElemIds(rootBlock.findElem('e1', 'inner', 'yes')).should.be.eql(['3-2-1']);
            getElemIds(rootBlock.findElem('e2', 'inner', 'no')).should.be.eql([]);
            getElemIds(rootBlock.findElem('e2', 'inner', 'yes')).should.be.eql(['3-2']);
            getElemIds(rootBlock.findElem('e3', 'inner', 'no')).should.be.eql(['2-3']);
            getElemIds(rootBlock.findElem('e3', 'inner', 'yes')).should.be.eql([]);
        });

        it('should find all elems by name and boolean mod', function() {
            getElemIds(rootBlock.findElem('e1', 'bool', true)).should.be.eql(['3-2-1']);
            getElemIds(rootBlock.findElem('e2', 'bool', true)).should.be.eql(['3-2', '2.']);
            getElemIds(rootBlock.findElem('e3', 'bool', true)).should.be.eql(['2-3']);
        });

        it('should find all elems by name and boolean mod', function() {
            getElemIds(rootBlock.findElem('e1', 'bool', false)).should.be.eql(['1', '2-1', '3-2-1']);
            getElemIds(rootBlock.findElem('e2', 'bool', false)).should.be.eql(['2', '3-2', '2.']);
            getElemIds(rootBlock.findElem('e3', 'bool', false)).should.be.eql(['2-3', '3']);
        });

        it('should cache found elems', function() {
            // should cache results after first calls
            rootBlock.findElem('e1 e2 e3');
            rootBlock.findElem('e1 e2 e3', 'inner', 'no');
            rootBlock.findElem('e1 e2 e3', 'inner', 'yes');
            rootBlock.findElem('e1 e2 e3', 'bool', true);

            // and shouldn't touch `findElem` inside `elem`
            sinon.spy(rootBlock, 'findElem');

            getElemIds(rootBlock.elem('e1')).should.be.eql(['1', '2-1', '3-2-1']);
            getElemIds(rootBlock.elem('e2')).should.be.eql(['2', '3-2', '2.']);
            getElemIds(rootBlock.elem('e3')).should.be.eql(['2-3', '3']);
            getElemIds(rootBlock.elem('e1', 'inner', 'yes')).should.be.eql(['3-2-1']);
            getElemIds(rootBlock.elem('e2', 'inner', 'yes')).should.be.eql(['3-2']);
            getElemIds(rootBlock.elem('e3', 'inner', 'no')).should.be.eql(['2-3']);
            getElemIds(rootBlock.elem('e1', 'bool', true)).should.be.eql(['3-2-1']);
            getElemIds(rootBlock.elem('e2', 'bool', true)).should.be.eql(['3-2', '2.']);
            getElemIds(rootBlock.elem('e3', 'bool', true)).should.be.eql(['2-3']);

            rootBlock.findElem.called.should.be.false;
            rootBlock.findElem.restore();
        });

        it('should not update _elemCache on findElem call with ctx', function() {
            rootBlock.findElem(rootNode.find('[id=2]'), 'e2');

            sinon.stub(rootBlock, 'findElem');

            rootBlock.elem('e2');

            rootBlock.findElem.should.have.been.calledOnce;
            rootBlock.findElem.restore();
        });

        it('should update _elemCache after findElem call', function() {
            rootBlock.elem('e1');
            rootNode.html(BEMHTML.apply({
                    block : 'root',
                    elem : 'e1',
                    attrs : { id : '1.' }
                }));
            rootBlock.findElem('e1');

            getElemIds(rootBlock.elem('e1')).should.be.eql(['1.']);
        });

        it('should update _elemCache only if ctx is the same', function() {
            rootBlock.findElem(rootBlock.domElem, 'e1');
            rootNode.html(BEMHTML.apply({
                    block : 'root',
                    elem : 'e1',
                    attrs : { id : '1.' }
                }));

            rootBlock.findElem($('.something-else'), 'e1');
            getElemIds(rootBlock.elem('e1')).should.be.eql(['1', '2-1', '3-2-1']);

            rootBlock.findElem(rootBlock.domElem, 'e1');
            getElemIds(rootBlock.elem('e1')).should.be.eql(['1.']);
        });
    });

    describe('drop elem cache', function() {
        var block;
        beforeEach(function() {
            block = $(BEMHTML.apply({ block : 'b1', content : { elem : 'e1', elemMods : { m1 : 'v1' } } })).bem('b1');
        });

        afterEach(function() {
            DOM.destruct(block.domElem);
            delete DOM.blocks['b1'];
        });

        it('should properly drop elem cache', function() {
            sinon.spy(block, 'findElem');

            block.elem('e1', 'm1', 'v1');
            block.dropElemCache('e1', 'm1', 'v1');
            block.elem('e1', 'm1', 'v1');

            block.findElem.should.have.been.calledTwice;
        });
    });

    describe('DOM.init', function() {
        it('should init block', function() {
            var spy = sinon.spy();
            DOM.decl('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block', js : true } })));

            spy.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
        });

        it('should call live function for block', function() {
            var spy = sinon.spy();
            DOM.decl('block', {}, {
                live : spy
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block', js : true } })));

            DOM.init(rootNode);
            spy.should.have.been.calledOnce;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
        });

        it('shouldn\'t init live block', function() {
            var spy = sinon.spy();
            DOM.decl('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            }, {
                live : true
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block', js : true } })));

            DOM.init(rootNode);
            spy.called.should.be.false;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
        });

        it('should allow to pass string', function() {
            var spy = sinon.spy();
            DOM.decl('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            var rootNode = DOM.init(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block', js : true } }));

            spy.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
        });
    });

    describe('DOM.destruct', function() {
        it('should destruct block only if it has no dom nodes', function() {
            var spy = sinon.spy();
            DOM.decl('block', {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : [
                        { block : 'block', js : { id : 'block' } },
                        { block : 'block', js : { id : 'block' } }
                    ]
                })));

            DOM.destruct(rootNode.find('.block :eq(0)'));
            spy.called.should.be.false;

            DOM.destruct(rootNode.find('.block'));
            spy.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
        });

        it('should destruct implicitly inited block', function() {
            var spy = sinon.spy();
            DOM.decl('imp-block', {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            var blockNode = DOM.init($(BEMHTML.apply({ block : 'imp-block' })));
            blockNode.bem('imp-block');
            DOM.destruct(blockNode);
            spy.should.have.been.calledOnce;

            delete DOM.blocks['imp-block'];
        });
    });

    describe('DOM.detach', function() {
        it('should detach block and leave DOM node', function() {
            var spy = sinon.spy();
            DOM.decl('block2', {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    block : 'block1',
                    content : {
                        block : 'block2',
                        js : true
                    }
                })));

            DOM.detach(rootNode.bem('block1').findBlockInside('block2').domElem);

            spy.should.have.been.calledOnce;
            rootNode.find('.block2').length.should.be.equal(1);

            delete DOM.blocks['block1'];
            delete DOM.blocks['block2'];
        });
    });

    describe('DOM.update', function() {
        it('should update tree', function() {
            var spyBlock1Destructed = sinon.spy(),
                spyBlock2Inited = sinon.spy();

            DOM.decl('block1', {
                onSetMod : {
                    js : {
                        '' : spyBlock1Destructed
                    }
                }
            });
            DOM.decl('block2', {
                onSetMod : {
                    js : {
                        inited : spyBlock2Inited
                    }
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block1', js : true } })));

            DOM.update(rootNode, BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.called.should.be.true;
            spyBlock2Inited.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block1'];
            delete DOM.blocks['block2'];
        });

        it('should allow to pass simple string', function() {
            var domElem = $('<div/>');
            DOM.update(domElem, 'simple string');
            domElem.html().should.be.equal('simple string');
        });
    });

    describe('DOM.replace', function() {
        it('should properly replace tree', function() {
            var spyBlock1Destructed = sinon.spy(),
                spyBlock2Inited = sinon.spy();

            DOM.decl('block1', {
                onSetMod : {
                    js : {
                        '' : spyBlock1Destructed
                    }
                }
            });
            DOM.decl('block2', {
                onSetMod : {
                    js : {
                        inited : spyBlock2Inited
                    }
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : { block : 'block1', js : true } })));

            DOM.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledOnce;
            spyBlock2Inited.should.have.been.calledOnce;

            rootNode.html().should.be.equal('<div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div>');

            DOM.destruct(rootNode);

            rootNode = DOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : [{ tag : 'p' }, { block : 'block1', js : true }, { tag : 'p' }] })));

            DOM.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledTwice;
            spyBlock2Inited.should.have.been.calledTwice;

            rootNode.html().should.be.equal('<p></p><div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div><p></p>');

            delete DOM.blocks['block1'];
            delete DOM.blocks['block2'];
        });
    });

    describe('params', function() {
        it('should properly join params', function() {
            DOM.decl('block', {
                getDefaultParams : function() {
                    return { p1 : 1 };
                }
            });

            DOM.decl('block2', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            var params = this.findBlockOn('block').params;
                            params.p1.should.be.equal(1);
                            params.p2.should.be.equal(2);
                            params.p3.should.be.equal(3);
                        }
                    }
                }
            });

            var rootNode = DOM.init($(BEMHTML.apply({
                    tag : 'div',
                    content : [
                        { block : 'block', js : { id : 'bla', p2 : 2 }, mix : { block : 'block2', js : true } },
                        { block : 'block', js : { id : 'bla', p3 : 3 } }
                    ]
                })));

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
            delete DOM.blocks['block2'];
        });
    });

    describe('emit', function() {
        it('should emit context event with target', function() {
            DOM.decl('block', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            this.emit('event');
                        }
                    }
                }
            });

            var rootNode = $('<div/>'),
                spy = sinon.spy();

            DOM.blocks['block'].on(rootNode, 'event', spy);
            DOM.update(rootNode, BEMHTML.apply({ block : 'block', js : true }));

            var block = rootNode.find('.block').bem('block');

            spy.should.have.been.calledOnce;
            spy.args[0][0].target.should.be.equal(block);

            delete DOM.blocks['block'];
        });
    });

    describe('containsDomElem', function() {
        var domElem, block, block2;
        beforeEach(function() {
            DOM.decl('block');
            DOM.decl('block2');

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

            DOM.init(domElem);
            block = domElem.filter('.block').bem('block');
            block2 = domElem.filter('.block2').bem('block2');
        });

        afterEach(function() {
            DOM.destruct(domElem);
            delete DOM.blocks['block'];
            delete DOM.blocks['block2'];
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
        var block, spy1, spy2, spy3, spy4, spy5, spy6, spy7, spy8, spy9,
            data = { data : 'data' },
            win = DOM.win,
            doc = DOM.doc;

        beforeEach(function() {
            spy1 = sinon.spy();
            spy2 = sinon.spy();
            spy3 = sinon.spy();
            spy4 = sinon.spy();
            spy5 = sinon.spy();
            spy6 = sinon.spy();
            spy7 = sinon.spy();
            spy8 = sinon.spy();
            spy9 = sinon.spy();

            DOM.decl('block', {
                 bindToClick : function() {
                    this
                        .bindTo('click', this._handler1)
                        .bindTo('click', this._handler2)
                        .bindTo('elem', 'click', this._handler3)
                        .bindTo(this.elem('elem'), 'click', this._handler4)
                        .bindTo(this.elem('elem2'), 'click', this._handler5)
                        .bindToWin('resize', this._handler6)
                        .bindToWin('resize', this._handler7)
                        .bindToDoc('mouseup', this._handler8)
                        .bindToDoc('mouseup', this._handler9)
                        // bind with data
                        .bindTo('dblclick', data, this._handler1)
                        .bindTo('elem', 'dblclick', data, this._handler2)
                        .bindTo(this.elem('elem'), 'dblclick', data, this._handler3)
                        .bindToWin('winevent', data, this._handler4)
                        .bindToDoc('docevent', data, this._handler5)
                        // bind with data and event object
                        .bindTo({ 'mousedown' : this._handler1 }, data)
                        .bindTo('elem', { 'mousedown' : this._handler2 }, data)
                        .bindTo(this.elem('elem'), { 'mousedown' : this._handler3 }, data)
                        .bindToWin({ 'winevent2' : this._handler4 }, data)
                        .bindToDoc({ 'docevent2' : this._handler5 }, data);
                },

                _handler1 : spy1,
                _handler2 : spy2,
                _handler3 : spy3,
                _handler4 : spy4,
                _handler5 : spy5,
                _handler6 : spy6,
                _handler7 : spy7,
                _handler8 : spy8,
                _handler9 : spy9,

                unbindAllFromDomElem : function() {
                    this.unbindFrom('click');
                },

                unbindHandler1FromDomElem : function() {
                    this.unbindFrom('click', this._handler1);
                },

                unbindAllFromElemByString : function() {
                    this.unbindFrom('elem', 'click');
                },

                unbindAllFromElemByElem : function() {
                    this.unbindFrom(this.elem('elem'), 'click');
                },

                unbindHandler3FromElemByString : function() {
                    this.unbindFrom('elem', 'click', this._handler3);
                },

                unbindClick4FromElemByElem : function() {
                    this.unbindFrom(this.elem('elem'), 'click', this._handler4);
                },

                unbindHandler6FromWin : function() {
                    this.unbindFromWin('resize', this._handler6);
                },

                unbindHandler8FromDoc : function() {
                    this.unbindFromDoc('mouseup', this._handler8);
                }
            });

            block = DOM.init($(BEMHTML.apply({ block : 'block', content : { elem : 'elem' } }))).bem('block');
            block.bindToClick();
        });

        afterEach(function() {
            DOM.destruct(block.domElem);
            delete DOM.blocks['block'];
        });

        it('should properly bind to block-self DOM elem', function() {
            block.domElem.click();
            spy1.should.have.been.calledOnce;
            spy2.should.have.been.calledOnce;
            spy3.should.not.have.been.called;
            spy4.should.not.have.been.called;
            spy5.should.not.have.been.called;
        });

        it('should properly unbind to block-self DOM elem', function() {
            block.unbindAllFromDomElem();
            block.domElem.click();
            spy1.should.not.have.been.called;
            spy2.should.not.have.been.called;
        });

        it('should unbind from block-self DOM elem specified function only', function() {
            block.unbindHandler1FromDomElem();
            block.domElem.click();
            spy1.should.not.have.been.called;
            spy2.should.have.been.calledOnce;
        });

        it('should properly bind to block elem', function() {
            block.elem('elem').click();
            spy3.should.have.been.calledOnce;
            spy4.should.have.been.calledOnce;
            spy5.should.not.have.been.called;
        });

        it('should properly unbind from block elem by string', function() {
            block.unbindAllFromElemByString();
            block.elem('elem').click();
            spy3.should.not.have.been.called;
            spy4.should.not.have.been.called;
        });

        it('should properly unbind from block elem by elem', function() {
            block.unbindAllFromElemByElem();
            block.elem('elem').click();
            spy3.should.not.have.been.called;
            spy4.should.not.have.been.called;
        });

        it('should properly unbind specified function from block elem by elem', function() {
            block.unbindHandler3FromElemByString();
            block.elem('elem').click();
            spy3.should.not.have.been.called;
            spy4.should.have.been.calledOnce;
        });

        it('should properly unbind specified function from block elem by string', function() {
            block.unbindClick4FromElemByElem();
            block.elem('elem').click();
            spy3.should.have.been.calledOnce;
            spy4.should.not.have.been.called;
        });

        it('should properly bind to window event', function() {
            win.trigger('resize');
            spy6.should.have.been.calledOnce;
            spy7.should.have.been.calledOnce;
        });

        it('should properly unbind from window event', function() {
            block.unbindFromWin('resize');
            win.trigger('resize');
            spy6.should.not.have.been.called;
            spy7.should.not.have.been.called;
        });

        it('should properly unbind specified function from window event', function() {
            block.unbindHandler6FromWin();
            win.trigger('resize');
            spy6.should.not.have.been.called;
            spy7.should.have.been.calledOnce;
        });

        it('should properly bind to document event', function() {
            doc.trigger('mouseup');
            spy8.should.have.been.calledOnce;
            spy9.should.have.been.calledOnce;
        });

        it('should properly unbind from document event', function() {
            block.unbindFromWin('resize');
            doc.trigger('resize');
            spy8.should.not.have.been.called;
            spy9.should.not.have.been.called;
        });

        it('should properly unbind specified function from document event', function() {
            block.unbindHandler8FromDoc();
            doc.trigger('mouseup');
            spy8.should.not.have.been.called;
            spy9.should.have.been.calledOnce;
        });

        it('should properly bind with aditional event data', function() {
            block.domElem.dblclick();
            block.elem('elem').dblclick();
            win.trigger('winevent');
            doc.trigger('docevent');
            spy1.args[0][0].data.should.have.been.equal(data);
            spy2.args[0][0].data.should.have.been.equal(data);
            spy3.args[0][0].data.should.have.been.equal(data);
            spy4.args[0][0].data.should.have.been.equal(data);
            spy5.args[0][0].data.should.have.been.equal(data);
        });

        it('should properly bind with aditional event data when use event object', function() {
            block.domElem.mousedown();
            block.elem('elem').mousedown();
            win.trigger('winevent2');
            doc.trigger('docevent2');
            spy1.args[0][0].data.should.have.been.equal(data);
            spy2.args[0][0].data.should.have.been.equal(data);
            spy3.args[0][0].data.should.have.been.equal(data);
            spy4.args[0][0].data.should.have.been.equal(data);
            spy5.args[0][0].data.should.have.been.equal(data);
        });
    });

    describe('closestElem', function() {
        it('should return the closest element', function() {
            DOM.decl('block', {}, {});

            var rootNode = $(BEMHTML.apply({
                    block : 'block',
                    js : true,
                    content : {
                        elem : 'elem1',
                        content : {
                            elem : 'elem2'
                        }
                    }
                })),
                block = rootNode.bem('block'),
                closest = block.closestElem(block.elem('elem2'), 'elem1');

            closest[0].should.be.equal(block.elem('elem1')[0]);

            DOM.destruct(rootNode);
            delete DOM.blocks['block'];
        });
    });

    describe('live', function() {
        it('should properly use live of base block', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy();

            DOM.decl('block1', {}, { live : spy1 });
            DOM.decl({ block : 'block2', baseBlock : 'block1' }, {}, {
                live : function() {
                    this.__base.apply(this, arguments);
                    spy2();
                }
            });

            DOM.init(BEMHTML.apply([
                { block : 'block1', js : true },
                { block : 'block2', js : true }
            ]));

            spy1.should.have.been.calledTwice;
            spy2.should.have.been.calledOnce;

            delete DOM.blocks['block1'];
            delete DOM.blocks['block2'];
        });

        it('should properly use live after adding a new block', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy();

            DOM.decl('block1', {}, { live : spy1 });

            DOM.init(BEMHTML.apply({ block : 'block1', js : true }));

            spy1.should.have.been.calledOnce;

            DOM.decl({ block : 'block2', baseBlock : 'block1' }, {}, {
                live : function() {
                    this.__base.apply(this, arguments);
                    spy2();
                }
            });

            spy2.should.not.have.been.called;

            DOM.init(BEMHTML.apply({ block : 'block2', js : true }));

            spy1.should.have.been.calledTwice;
            spy2.should.have.been.calledOnce;

            delete DOM.blocks['block1'];
            delete DOM.blocks['block2'];
        });

        it('should properly use live after adding declaration', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy();

            DOM.decl('block1', {}, { live : spy1 });

            DOM.init(BEMHTML.apply({ block : 'block1', js : true }));

            spy1.should.have.been.calledOnce;

            DOM.decl('block1', {}, {
                live : function() {
                    this.__base.apply(this, arguments);
                    spy2();
                }
            });

            spy1.should.have.been.calledOnce;
            spy2.should.have.been.calledOnce;

            DOM.init(BEMHTML.apply({ block : 'block1', js : true }));

            spy1.should.have.been.calledOnce;
            spy2.should.have.been.calledOnce;

            delete DOM.blocks['block1'];
        });
    });

    describe('liveInitOnBlockInsideEvent', function() {
        it('should init and call handler on live initialization', function() {
            var spyInit = sinon.spy(),
                spyHandler = sinon.spy();

            DOM.decl('block1', {
                onSetMod : {
                    js : {
                        inited : spyInit
                    }
                }
            }, {
                live : function() {
                    this.liveInitOnBlockInsideEvent('event', 'block2', spyHandler);
                }
            });
            DOM.decl('block2', {}, {});

            var rootNode = DOM.init($(BEMHTML.apply({
                    block : 'block1',
                    js : true,
                    content : {
                        block : 'block2',
                        js : true
                    }
                }))),
                block = rootNode.find('.block2').bem('block2');

            spyInit.called.should.be.false;
            spyHandler.called.should.be.false;

            block.emit('event');

            spyInit.called.should.be.true;
            spyHandler.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block1'];
            delete DOM.blocks['block2'];
        });
    });

    describe('modules.define patching', function() {
        it('should provide BEMDOM block', function(done) {
            var name = 'b' + Math.random(),
                spy = sinon.spy();

            modules.define(name, ['i-bem__dom'], function(provide, BEMDOM) {
                spy();
                provide(BEMDOM.decl(this.name, {}));
            });

            modules.define(name, function(provide, Prev) {
                spy();
                Prev.should.be.eql(DOM.blocks[this.name]);
                provide(Prev.decl(this.name, {}));
            });

            modules.require([name], function(Block) {
                spy.should.have.been.calledTwice;
                Block.should.be.eql(DOM.blocks[name]);
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
                        { elem : 'e1', elemMods : { 'mod1' : 'val1' } },
                        { elem : 'e1', elemMods : { 'mod1' : 'val1' } },
                        { elem : 'e2', elemMods : { 'mod1' : 'val1' } }
                    ]
                }))
                .bem('block');
        });

        afterEach(function() {
            delete DOM.blocks['block'];
        });

        it('should propagate destructing event', function() {
            var spy = sinon.spy();

            DOM.decl('block1', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            DOM.blocks['block2'].on(this.domElem, { modName : 'js', modVal : '' }, spy);
                        }
                    }
                }
            });

            DOM.decl('block2');

            var domElem = $(BEMHTML.apply({
                block : 'block1',
                content : {
                    block : 'block2'
                }
            })).appendTo('body');

            DOM.init(domElem);

            var block1 = domElem.bem('block1'),
                block2 = block1.findBlockInside('block2');

            DOM.destruct(block2.domElem);

            spy.should.have.been.called;

            delete DOM.blocks['block2'];
            delete DOM.blocks['block1'];
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

                DOM.blocks['block']
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
