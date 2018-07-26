modules.define(
    'spec',
    ['i-bem', 'i-bem-dom', 'i-bem-dom__collection', 'objects', 'functions', 'jquery', 'chai', 'sinon', 'BEMHTML'],
    function(provide, bem, bemDom, BemDomCollection, objects, functions, $, chai, sinon, BEMHTML) {

var undef,
    expect = chai.expect;

describe('i-bem-dom', function() {
    var rootNode;

    afterEach(function() {
        if(rootNode) {
            bemDom.destruct(rootNode);
            rootNode = null;
        }

        objects.each(bem.entities, function(_, entityName) {
            delete bem.entities[entityName];
        });
    });

    describe('decl', function() {
        it('should enable to inherit block to itself', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                Block = bemDom.declBlock('block', {
                    onSetMod : {
                        js : {
                            inited : spy1
                        }
                    }
                }),
                Block2 = bemDom.declBlock('block', {
                    onSetMod : {
                        js : {
                            inited : spy2
                        }
                    }
                }),
                block = (rootNode = createDomNode({
                    block : 'block'
                })).bem(Block);

            Block2.should.be.equal(Block);
            spy1.should.not.have.been.called;
            spy2.should.have.been.called;
        });

        it('should enable to inherit block to itself using entity class', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                Block = bemDom.declBlock('block', {
                    onSetMod : {
                        js : {
                            inited : spy1
                        }
                    }
                }),
                Block2 = bemDom.declBlock(Block, {
                    onSetMod : {
                        js : {
                            inited : spy2
                        }
                    }
                }),
                block = (rootNode = createDomNode({
                    block : 'block'
                })).bem(Block);

            Block2.should.be.equal(Block);
            spy1.should.not.have.been.called;
            spy2.should.have.been.called;
        });

        it('should enable to inherit elem to itself', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                Elem = bemDom.declElem('block', 'elem', {
                    onSetMod : {
                        js : {
                            inited : spy1
                        }
                    }
                }),
                Elem2 = bemDom.declElem('block', 'elem', {
                    onSetMod : {
                        js : {
                            inited : spy2
                        }
                    }
                }),
                elem = (rootNode = createDomNode({
                    block : 'block',
                    elem : 'elem'
                })).bem(Elem);

            Elem2.should.be.equal(Elem);
            spy1.should.not.have.been.called;
            spy2.should.have.been.called;
        });

        it('should enable to inherit elem to itself using entity class', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                Elem = bemDom.declElem('block', 'elem', {
                    onSetMod : {
                        js : {
                            inited : spy1
                        }
                    }
                }),
                Elem2 = bemDom.declElem(Elem, {
                    onSetMod : {
                        js : {
                            inited : spy2
                        }
                    }
                }),
                elem = (rootNode = createDomNode({
                    block : 'block',
                    elem : 'elem'
                })).bem(Elem);

            Elem2.should.be.equal(Elem);
            spy1.should.not.have.been.called;
            spy2.should.have.been.called;
        });

        it('should enable to mix block', function() {
            var MixBlock = bemDom.declMixin({}),

                Block = bemDom.declBlock('block', MixBlock),
                block = (rootNode = createDomNode({
                    block : 'block'
                })).bem(Block),

                Elem = bemDom.declElem('block', 'elem', MixBlock),
                elem = (rootNode = createDomNode({
                    block : 'block',
                    elem : 'elem'
                })).bem(Elem);

            block.should.be.instanceOf(bemDom.Block);
            elem.should.be.instanceOf(bemDom.Elem);
        });

        it('should enable to inherit and mix blocks', function() {
            var MixBlock = bemDom.declMixin({}),

                Block1 = bemDom.declBlock('block1'),
                Block2 = bemDom.declBlock('block2', [Block1, MixBlock]),
                block2 = (rootNode = createDomNode({
                    block : 'block2'
                })).bem(Block2),

                Elem1 = bemDom.declElem('block', 'elem1'),
                Elem2 = bemDom.declElem('block', 'elem2', [Elem1, MixBlock]),
                elem2 = (rootNode = createDomNode({
                    block : 'block',
                    elem : 'elem2'
                })).bem(Elem2);

            block2.should.be.instanceOf(Block1);
            elem2.should.be.instanceOf(Elem1);
        });
    });

    describe('getMod', function() {
        it('should return properly extracted mod from html', function() {
            var Block = bemDom.declBlock('block');

            [
                {
                    mods : undef,
                    val : ''
                },
                {
                    mods : { m1 : 'v1' },
                    val : 'v1'
                },
                {
                    mods : { m1 : 'v1' },
                    mix : { block : 'block2', mods : { 'm1' : 'v2' } },
                    val : 'v1'
                },
                {
                    mods : { m1 : true },
                    val : true
                }
            ].forEach(function(data) {
                (rootNode = createDomNode({
                    block : 'block',
                    mods : data.mods,
                    mix : data.mix
                })).bem(Block).getMod('m1')
                    .should.be.eql(data.val);

                bemDom.destruct(rootNode);
            });
        });

        it('should return properly extracted elem mod from html', function() {
            var Block = bemDom.declBlock('block');

            [
                {
                    elemMods : undef,
                    val : ''
                },
                {
                    elemMods : { m1 : 'v1' },
                    val : 'v1'
                },
                {
                    elemMods : { m1 : 'v1', m2 : 'v2' },
                    val : 'v1'
                },
                {
                    elemMods : { m1 : 'v1', m2 : 'v11' },
                    mix : { elem : 'elem1', elemMods : { m1 : 'v2' } },
                    val : 'v1'
                },
                {
                    elemMods : { m1 : true },
                    val : true
                }
            ].forEach(function(data) {
                (rootNode = createDomNode({
                    block : 'block',
                    content : {
                        elem : 'elem',
                        elemMods : data.elemMods,
                        mix : data.mix
                    }
                })).bem(Block)._elem('elem').getMod('m1')
                    .should.be.equal(data.val);

                bemDom.destruct(rootNode);
            });
        });
    });

    describe('setMod', function() {
        it('should properly set CSS class names', function() {
            var Block = bemDom.declBlock('block');

            [
                {
                    beforeMods : undef,
                    afterCls : 'block i-bem block_js_inited block_m1_v1',
                    mods : { m1 : 'v1' }
                },
                {
                    beforeMods : { m6 : true, m7 : 'v7' },
                    afterCls : 'block i-bem block_js_inited block_m1_v1 block_m2_v2 block_m3 block_m4_v4 block_m5',
                    mods : { m1 : 'v1', m2 : 'v2', m3 : true, m4 : 'v4', m5 : true, m6 : false, m7 : '' }
                },
                {
                    beforeMods : { m6 : true, m7 : 'v7' },
                    afterCls : 'block bla-block bla-block_m3 bla-block_m1_v1 i-bem block_js_inited block_m1_v1 block_m2_v2 block_m3 block_m4_v4 block_m5',
                    mods : { m1 : 'v1', m2 : 'v2', m3 : true, m4 : 'v4', m5 : true, m6 : false, m7 : '' },
                    mix : { block : 'bla-block', mods : { m3 : true, m1 : 'v1' } }
                }
            ].forEach(function(data) {
                var block = (rootNode = createDomNode({
                        block : 'block',
                        mods : data.beforeMods,
                        mix : data.mix
                    })).bem(Block);

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        block.setMod(modName) :
                        block.setMod(modName, modVal);
                });

                block.domElem[0].className.should.be.equal(data.afterCls);

                bemDom.destruct(rootNode);
            });
        });

        it('should properly set elem CSS class names', function() {
            var Block = bemDom.declBlock('block'),
                rootNode;

            [
                {
                    elemMods : undef,
                    afterCls : 'block__elem i-bem block__elem_js_inited block__elem_m1_v1',
                    mods : { m1 : 'v1' }
                },
                {
                    elemMods : { m6 : true, m7 : 'v7' },
                    afterCls : 'block__elem i-bem block__elem_js_inited block__elem_m1_v1 block__elem_m2_v2 block__elem_m3 block__elem_m4_v4 block__elem_m5',
                    mods : { m1 : 'v1', m2 : 'v2', m3 : true, m4 : 'v4', m5 : true, m6 : false, m7 : '' }
                }
            ].forEach(function(data) {
                var elem = (rootNode = createDomNode({
                        block : 'block',
                        content : {
                            elem : 'elem',
                            mods : data.elemMods
                        }
                    })).bem(Block)._elem('elem');

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        elem.setMod(modName) :
                        elem.setMod(modName, modVal);
                });

                elem.domElem[0].className.should.be.equal(data.afterCls);

                bemDom.destruct(rootNode);
            });
        });
    });

    describe('find*Block(s)', function() {
        var rootBlock,
            B1Block, B3Block, B4Block, B5Block;

        beforeEach(function() {
            var RootBlock = bemDom.declBlock('root');
            B1Block = bemDom.declBlock('b1');
            B3Block = bemDom.declBlock('b3');
            B4Block = bemDom.declBlock('b4');
            B5Block = bemDom.declBlock('b5');

            rootNode = createDomNode({
                block : 'root',
                content : {
                    block : 'b1',
                    js : { id : '1' },
                    mods : { m2 : 'v1', m3 : true },
                    content : [
                        { block : 'b2' },
                        {
                            block : 'b1',
                            mods : { m1 : 'v1' },
                            js : { id : '2' }
                        },
                        {
                            block : 'b3',
                            mods : { m1 : true },
                            js : { id : '5' },
                            mix : [
                                { block : 'b4', js : { id : '6' } },
                                {
                                    block : 'b5',
                                    mods : { m1 : 'v1' },
                                    js : { id : '7' }
                                }
                            ],
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
                        },
                        {
                            block : 'b3', js : { id : '5' },
                            mix : { block : 'b4', js : { id : '8' } }
                        }
                    ]
                }
            });

            rootBlock = rootNode.bem(RootBlock);
        });

        describe('findChildBlocks', function() {
            it('should throw error if Block given as string', function() {
                function find() {
                    rootBlock.findChildBlocks('string');
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should throw error if Block given as description object with block as string', function() {
                function find() {
                    rootBlock.findChildBlocks({ block : 'string' });
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should return BEM-collection', function() {
                rootBlock.findChildBlocks(B1Block).should.be.instanceOf(BemDomCollection);
            });

            it('should return instances of Block founded by class', function() {
                rootBlock.findChildBlocks(B1Block).forEach(function(block) {
                    block.should.be.instanceOf(B1Block);
                });
            });

            it('should find all blocks by block class', function() {
                getEntityIds(rootBlock.findChildBlocks(B1Block)).should.be.eql(['1', '2', '3', '4']);
            });

            it('should find all blocks by block class, modName and modVal', function() {
                getEntityIds(rootBlock.findChildBlocks({ block : B1Block, modName : 'm1', modVal : 'v1' }))
                    .should.be.eql(['2']);
            });

            it('should find all blocks by block class and boolean mod', function() {
                getEntityIds(rootBlock.findChildBlocks({ block : B1Block, modName : 'm1', modVal : true }))
                    .should.be.eql(['4']);
            });

            it('should find all blocks by block class and boolean mod without modVal', function() {
                getEntityIds(rootBlock.findChildBlocks({ block : B1Block, modName : 'm1' }))
                    .should.be.eql(['4']);
            });
        });

        describe('findChildBlock', function() {
            it('should throw error if Block given as string', function() {
                function find() {
                    rootBlock.findChildBlock('string');
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should throw error if Block given as description object with block as string', function() {
                function find() {
                    rootBlock.findChildBlock({ block : 'string' });
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should return instance of Block found by class', function() {
                rootBlock.findChildBlock(B1Block).should.be.instanceOf(B1Block);
            });

            it('should return null if nothing found', function() {
                var B99Block = bemDom.declBlock('b99');
                expect(rootBlock.findChildBlock(B99Block)).to.be.null;
            });

            it('should find first block by block class', function() {
                rootBlock.findChildBlock(B1Block).params.id
                    .should.be.equal('1');
            });

            it('should find first block by block class, modName and modVal', function() {
                rootBlock.findChildBlock({ block : B1Block, modName : 'm1', modVal : 'v1' })
                    .params.id
                        .should.be.equal('2');
            });

            it('should find first block by block class and boolean mod', function() {
                rootBlock.findChildBlock({ block : B1Block, modName : 'm1', modVal : true })
                    .params.id
                        .should.be.equal('4');
            });

            it('should find first block by block class and boolean mod without modVal', function() {
                rootBlock.findChildBlock({ block : B1Block, modName : 'm1' })
                    .params.id
                        .should.be.equal('4');
            });
        });

        describe('findParentBlocks', function() {
            var leafBlock;

            beforeEach(function() {
                leafBlock = rootBlock.findChildBlock({ block : B1Block, modName : 'm1', modVal : true });
            });

            it('should throw error if Block given as string', function() {
                function find() {
                    rootBlock.findParentBlocks('string');
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should throw error if Block given as description object with block as string', function() {
                function find() {
                    rootBlock.findParentBlocks({ block : 'string' });
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should return BEM-collection', function() {
                leafBlock.findParentBlocks(B1Block).should.be.instanceOf(BemDomCollection);
            });

            it('should find all ancestor blocks by block class', function() {
                getEntityIds(leafBlock.findParentBlocks(B1Block)).should.be.eql(['3', '1']);
            });

            it('should find all ancestor blocks by block class, modName and modVal', function() {
                getEntityIds(leafBlock.findParentBlocks({ block : B1Block, modName : 'm1', modVal : 'v2' }))
                    .should.be.eql(['3']);
            });

            it('should find all ancestor blocks by block class and boolean mod', function() {
                getEntityIds(leafBlock.findParentBlocks({ block : B3Block, modName : 'm1', modVal : true }))
                    .should.be.eql(['5']);
            });

            it('should find all ancestor blocks by block class and boolean mod without modVal', function() {
                getEntityIds(leafBlock.findParentBlocks({ block : B3Block, modName : 'm1' }))
                    .should.be.eql(['5']);
            });
        });

        describe('findParentBlock', function() {
            var leafBlock;

            beforeEach(function() {
                leafBlock = rootBlock.findChildBlock({ block : B1Block, modName : 'm1', modVal : true });
            });

            it('should throw error if Block given as string', function() {
                function find() {
                    rootBlock.findParentBlock('string');
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should throw error if Block given as description object with block as string', function() {
                function find() {
                    rootBlock.findParentBlock({ block : 'string' });
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should find first ancestor block by block class', function() {
                leafBlock.findParentBlock(B1Block).params.id.should.be.equal('3');
            });

            it('should find first ancestor block by block class, modName and modVal', function() {
                leafBlock.findParentBlock({ block : B1Block, modName : 'm2', modVal : 'v1' })
                    .params.id
                        .should.be.equal('1');
            });

            it('should find first ancestor block by block class and boolean mod', function() {
                leafBlock.findParentBlock({ block : B1Block, modName : 'm3', modVal : true })
                    .params.id
                        .should.be.equal('1');
            });

            it('should find first ancestor block by block class and boolean mod without modVal', function() {
                leafBlock.findParentBlock({ block : B1Block, modName : 'm3' })
                    .params.id
                        .should.be.equal('1');
            });
        });

        describe('findMixedBlocks', function() {
            it('should throw error if Block given as string', function() {
                function find() {
                    rootBlock.findMixedBlocks('string');
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should throw error if Block given as description object with block as string', function() {
                function find() {
                    rootBlock.findMixedBlocks({ block : 'string' });
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should return BEM-collection', function() {
                rootBlock.findChildBlock({ block : B3Block }).findMixedBlocks(B4Block)
                    .should.be.instanceOf(BemDomCollection);
            });

            it('should find all mixed blocks by block class', function() {
                getEntityIds(
                    rootBlock.findChildBlock({ block : B3Block }).findMixedBlocks(B4Block))
                        .should.be.eql(['6', '8']);
            });
        });

        describe('findMixedBlock', function() {
            it('should throw error if Block given as string', function() {
                function find() {
                    rootBlock.findMixedBlock('string');
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should throw error if Block given as description object with block as string', function() {
                function find() {
                    rootBlock.findMixedBlock({ block : 'string' });
                }

                find.should.throw(Error, 'Block must be a class or description (block, modName, modVal) of the block to find');
            });

            it('should find first mixed block by block class', function() {
                rootBlock.findChildBlock({ block : B3Block })
                    .findMixedBlock(B4Block)
                        .params.id
                            .should.be.equal('6');
            });

            it('should find mixed block by block class, modName and modVal', function() {
                rootBlock.findChildBlock({ block : B4Block })
                    .findMixedBlock({ block : B5Block, modName : 'm1', modVal : 'v1' })
                        .params.id
                            .should.be.equal('7');
            });

            it('should find mixed block by block class and boolean mod', function() {
                rootBlock.findChildBlock({ block : B4Block })
                    .findMixedBlock({ block : B3Block, modName : 'm1', modVal : true })
                        .params.id
                            .should.be.equal('5');
            });

            it('should find mixed block by block class and boolean mod without modVal', function() {
                rootBlock.findChildBlock({ block : B4Block })
                    .findMixedBlock({ block : B3Block, modName : 'm1' })
                        .params.id
                            .should.be.equal('5');
            });
        });
    });

    describe('find*Elem(s)', function() {
        var b1Block,
            B1E1Elem, B1E2Elem, B1E3Elem, B1E4Elem, B1E5Elem, B1E6Elem;

        beforeEach(function() {
            var B1Block = bemDom.declBlock('b1');

            B1E1Elem = bemDom.declElem('b1', 'e1');
            B1E2Elem = bemDom.declElem('b1', 'e2');
            B1E3Elem = bemDom.declElem('b1', 'e3');
            B1E4Elem = bemDom.declElem('b1', 'e4');
            B1E5Elem = bemDom.declElem('b1', 'e5');
            B1E6Elem = bemDom.declElem('b1', 'e6');

            rootNode = createDomNode(
                {
                    block : 'b1',
                    content : [
                        {
                            block : 'b2',
                            content : { elem : 'e1' }
                        },
                        {
                            elem : 'e2',
                            content : { elem : 'e5', js : { id : '9' } }
                        },
                        {
                            elem : 'e1',
                            elemMods : { m2 : 'v1' },
                            js : { id : '1' },
                            content : [
                                {
                                    elem : 'e1',
                                    elemMods : { m1 : 'v1' },
                                    js : { id : '2' }
                                },
                                {
                                    block : 'b3',
                                    content : {
                                        block : 'b1',
                                        elem : 'e1',
                                        elemMods : { m1 : 'v2', m2 : true },
                                        mix : [
                                            { elem : 'e3', js : { id : '5' } },
                                            { elem : 'e4', js : { id : '6' } }
                                        ],
                                        js : { id : '3' },
                                        content : [
                                            {
                                                elem : 'e1',
                                                elemMods : { m1 : true },
                                                js : { id : '4' }
                                            },
                                            {
                                                block : 'b1',
                                                content : { elem : 'e6', js : { id : '10' } }
                                            }
                                        ]
                                    }
                                },
                                { elem : 'e6', js : { id : '11' } }
                            ]
                        },
                        {
                            block : 'b1', elem : 'e3', js : { id : '5' },
                            mix : {
                                elem : 'e4',
                                elemMods : { m2 : 'v1' },
                                js : { id : '8' }
                            }
                        }
                    ]
                });

            b1Block = rootNode.bem(B1Block);
        });

        describe('findChildElems', function() {
            it('should return BEM-collection', function() {
                b1Block.findChildElems(B1E1Elem).should.be.instanceOf(BemDomCollection);
            });

            it('should return instances of Elem founded by class', function() {
                b1Block.findChildElems(B1E1Elem).forEach(function(elem) {
                    elem.should.be.instanceOf(B1E1Elem);
                });
            });

            it('should find all elems by elem class', function() {
                getEntityIds(b1Block.findChildElems(B1E1Elem)).should.be.eql(['1', '2', '3', '4']);
            });

            it('should find all elems by elem name', function() {
                getEntityIds(b1Block.findChildElems('e1')).should.be.eql(['1', '2', '3', '4']);
            });

            it('should find all elems by elem class, modName and modVal', function() {
                getEntityIds(
                        b1Block.findChildElems({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' }))
                    .should.be.eql(['2']);
            });

            it('should find all elems by elem class and boolean mod', function() {
                getEntityIds(
                        b1Block.findChildElems({ elem : B1E1Elem, modName : 'm1', modVal : true }))
                    .should.be.eql(['4']);
            });

            it('should find all elems by elem class and boolean mod without modVal', function() {
                getEntityIds(
                        b1Block.findChildElems({ elem : B1E1Elem, modName : 'm1' }))
                    .should.be.eql(['4']);
            });

            it('should find elems in strict mode', function() {
                getEntityIds(b1Block.findChildElems(B1E6Elem, true)).should.be.eql(['11']);
            });
        });

        describe('findChildElem', function() {
            it('should return instance of Elem founded by class', function() {
                b1Block.findChildElem(B1E1Elem).should.be.instanceOf(B1E1Elem);
            });

            it('should return null if nothing found', function() {
                var B99Elem = bemDom.declElem('b1', 'e99');
                expect(b1Block.findChildElem(B99Elem)).to.be.null;
            });

            it('should find first elem by elem class', function() {
                b1Block.findChildElem(B1E1Elem).params.id.should.be.equal('1');
            });

            it('should find first elem by elem name', function() {
                b1Block.findChildElem('e1').params.id.should.be.equal('1');
            });

            it('should find first elem by elem class, modName and modVal', function() {
                b1Block.findChildElem({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' })
                    .params.id
                        .should.be.equal('2');
            });

            it('should find first elem by elem name, modName and modVal', function() {
                b1Block.findChildElem({ elem : 'e1', modName : 'm1', modVal : 'v1' })
                    .params.id
                        .should.be.equal('2');
            });

            it('should find first elem by elem class and boolean mod', function() {
                b1Block.findChildElem({ elem : B1E1Elem, modName : 'm1', modVal : true })
                    .params.id
                        .should.be.equal('4');
            });

            it('should find first elem by elem class and boolean mod without modVal', function() {
                b1Block.findChildElem({ elem : B1E1Elem, modName : 'm1' })
                    .params.id
                        .should.be.equal('4');
            });

            it('should find first elem inside elem', function() {
                b1Block
                    .findChildElem({ elem : B1E2Elem })
                    .findChildElem({ elem : B1E5Elem })
                    .params.id
                        .should.be.equal('9');
            });

            it('should find elem in strict mode', function() {
                b1Block.findChildElem(B1E6Elem, true)
                    .params.id
                        .should.be.equal('11');
            });
        });

        describe('findParentElems', function() {
            var leafEntity;

            beforeEach(function() {
                leafEntity = b1Block.findChildElem({ elem : B1E1Elem, modName : 'm1', modVal : true });
            });

            it('should return BEM-collection', function() {
                leafEntity.findParentElems(B1E1Elem).should.be.instanceOf(BemDomCollection);
            });

            it('should find all ancestor elems by elem class', function() {
                getEntityIds(leafEntity.findParentElems(B1E1Elem)).should.be.eql(['3', '1']);
            });

            it('should find all ancestor elems by elem class, modName and modVal', function() {
                getEntityIds(leafEntity.findParentElems({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' }))
                    .should.be.eql(['1']);
            });

            it('should find all ancestor elems by elem name, modName and modVal', function() {
                getEntityIds(leafEntity.findParentElems({ elem : 'e1', modName : 'm2', modVal : 'v1' }))
                    .should.be.eql(['1']);
            });

            it('should find all ancestor elems by elem class and boolean mod', function() {
                getEntityIds(leafEntity.findParentElems({ elem : B1E1Elem, modName : 'm2', modVal : true }))
                    .should.be.eql(['3']);
            });

            it('should find all ancestor elems by elem class and boolean mod without modVal', function() {
                getEntityIds(leafEntity.findParentElems({ elem : B1E1Elem, modName : 'm2' }))
                    .should.be.eql(['3']);
            });
        });

        describe('findParentElem', function() {
            var leafEntity;

            beforeEach(function() {
                leafEntity = b1Block.findChildElem({ elem : B1E1Elem, modName : 'm1', modVal : true });
            });

            it('should find first ancestor elem by elem class', function() {
                leafEntity.findParentElem(B1E1Elem)
                    .params.id
                        .should.be.equal('3');
            });

            it('should find first ancestor elem by elem class, modName and modVal', function() {
                leafEntity.findParentElem({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' })
                    .params.id
                        .should.be.equal('1');
            });

            it('should find first ancestor elem by elem name, modName and modVal', function() {
                leafEntity.findParentElem({ elem : 'e1', modName : 'm2', modVal : 'v1' })
                    .params.id
                        .should.be.equal('1');
            });

            it('should find first ancestor elem by elem class and boolean mod', function() {
                leafEntity.findParentElem({ elem : B1E1Elem, modName : 'm2', modVal : true })
                    .params.id
                        .should.be.equal('3');
            });

            it('should find first ancestor elem by elem class and boolean mod without modVal', function() {
                leafEntity.findParentElem({ elem : B1E1Elem, modName : 'm2' })
                    .params.id
                        .should.be.equal('3');
            });
        });

        describe('findMixedElems', function() {
            it('should return BEM-collection', function() {
                b1Block.findChildElem(B1E3Elem).findMixedElems(B1E4Elem)
                    .should.be.instanceOf(BemDomCollection);
            });

            it('should find all mixed elems by elem class', function() {
                getEntityIds(
                    b1Block.findChildElem(B1E3Elem).findMixedElems(B1E4Elem))
                        .should.be.eql(['6', '8']);
            });
        });

        describe('findMixedElem', function() {
            it('should find mixed elem by elem class', function() {
                b1Block.findChildElem(B1E3Elem)
                    .findMixedElem(B1E4Elem)
                        .params.id
                            .should.be.equal('6');
            });

            it('should find first mixed elem by elem name', function() {
                b1Block.findChildElem(B1E3Elem)
                    .findMixedElem('e4')
                        .params.id
                            .should.be.equal('6');
            });

            it('should find first mixed elem by elem class, modName and modVal', function() {
                b1Block.findChildElem(B1E3Elem)
                    .findMixedElem({ elem : B1E4Elem, modName : 'm2', modVal : 'v1' })
                        .params.id
                            .should.be.equal('8');
            });

            it('should find first mixed elem by elem class and boolean mod', function() {
                b1Block.findChildElem(B1E3Elem)
                    .findMixedElem({ elem : B1E1Elem, modName : 'm2', modVal : true })
                        .params.id
                            .should.be.equal('3');
            });

            it('should find first mixed elem by elem class and boolean mod without modVal', function() {
                b1Block.findChildElem(B1E3Elem)
                    .findMixedElem({ elem : B1E1Elem, modName : 'm2' })
                        .params.id
                            .should.be.equal('3');
            });
        });
    });

    describe('elem(s)', function() {
        var b1Block,
            B1E1Elem,
            B1E2Elem,
            B1E3Elem,
            B1E4Elem,
            spy;

        beforeEach(function() {
            var B1Block = bemDom.declBlock('b1');

            B1E1Elem = bemDom.declElem('b1', 'e1');
            B1E2Elem = bemDom.declElem('b1', 'e2');
            B1E3Elem = bemDom.declElem('b1', 'e3');
            B1E4Elem = bemDom.declElem('b1', 'e4');

            rootNode = createDomNode({
                block : 'b1',
                mix : { elem : 'e1', js : { id : 1 } },
                content : [
                    { elem : 'e1', elemMods : { m1 : 'v1' }, js : { id : 2 } },
                    {
                        elem : 'e2', js : { id : 3 },
                        content : [
                            {
                                elem : 'e1', js : { id : 4 },
                                elemMods : { inner : 'no' }
                            },
                            {
                                elem : 'e3', js : { id : 5 },
                                elemMods : { inner : 'no', bool : true }
                            }
                        ]
                    },
                    {
                        elem : 'e3', js : { id : 6 },
                        content : {
                            elem : 'e2', js : { id : 7 },
                            elemMods : { inner : 'yes', bool : true },
                            content : {
                                elem : 'e1', js : { id : 8 },
                                elemMods : { inner : 'yes', bool : true }
                            }
                        }
                    },
                    { elem : 'e2', js : { id : 9 }, elemMods : { bool : true } },
                    { elem : 'e4' }
                ]
            });

            b1Block = rootNode.bem(B1Block);
        });

        afterEach(function() {
            spy.restore();
        });

        describe('elems', function() {
            beforeEach(function() {
                spy = sinon.spy(b1Block, 'findChildElems');
            });

            it('should find all elems by elem class', function() {
                getEntityIds(b1Block._elems(B1E1Elem))
                    .should.be.eql([1, 2, 4, 8]);
            });

            it('should find all elems by elem class modName and modVal', function() {
                getEntityIds(b1Block._elems({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' }))
                    .should.be.eql([2]);
            });

            it('should cache found elems', function() {
                b1Block._elems(B1E1Elem).should.be.equal(b1Block._elems(B1E1Elem));
                spy.should.be.calledOnce;
            });

            it('should cache found elems with respect to mods', function() {
                b1Block._elems({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' });
                spy.should.be.calledOnce;

                b1Block._elems(B1E1Elem);
                spy.should.be.calledTwice;
            });

            it('should not drop elems cache in case elem mods change', function() {
                var elem = b1Block._elems(B1E1Elem).get(0);
                spy.should.be.calledOnce;

                elem.setMod('m2', 'v1');

                b1Block._elems(B1E1Elem);
                spy.should.be.calledOnce;
            });

            it('should drop elems cache in case mods change', function() {
                var elem = b1Block._elem(B1E1Elem);

                b1Block._elems({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledOnce;

                elem.setMod('m2', 'v1');
                b1Block._elems({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledTwice;

                elem.delMod('m2');
                b1Block._elems({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledThrice;
            });
        });

        describe('elem', function() {
            beforeEach(function() {
                spy = sinon.spy(b1Block, 'findMixedElem');
            });

            it('should find first elem by elem class', function() {
                b1Block._elem(B1E1Elem)
                    .params.id
                        .should.be.equal(1);
            });

            it('should find first elem by elem class modName and modVal', function() {
                b1Block._elem({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' })
                    .params.id
                        .should.be.equal(2);
            });

            it('should cache found elem', function() {
                b1Block._elem(B1E1Elem);
                b1Block._elem(B1E1Elem);
                spy.should.be.calledOnce;
            });

            it('should cache found elem with respect to mods', function() {
                b1Block._elem({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' });
                spy.should.be.calledOnce;

                b1Block._elem(B1E1Elem);
                spy.should.be.calledTwice;
            });

            it('should not drop elem cache in case elem mods change', function() {
                var elem = b1Block._elem(B1E1Elem);
                spy.should.be.calledOnce;

                elem.setMod('m2', 'v1');

                b1Block._elem(B1E1Elem);
                spy.should.be.calledOnce;
            });

            it('should drop elem cache in case mods change', function() {
                var elem = b1Block._elems(B1E1Elem).get(0);

                b1Block._elem({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledOnce;

                elem.setMod('m2', 'v1');
                b1Block._elem({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledTwice;

                elem.delMod('m2');
                b1Block._elem({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledThrice;
            });
        });

        describe('drop cache', function() {
            var b1e2DomElem;

            beforeEach(function() {
                b1e2DomElem = b1Block.findChildElem(B1E2Elem).domElem;
                spy = sinon.spy(b1Block, 'findChildElems');
            });

            describe('for affected elems', function() {
                it('should drop elems cache on DOM destruct', function() {
                    b1Block._elems(B1E1Elem);

                    bemDom.destruct(b1e2DomElem);

                    b1Block._elems(B1E1Elem);
                    spy.should.be.calledTwice;
                });

                it('should drop elems cache on DOM update', function() {
                    b1Block._elems(B1E1Elem);

                    bemDom.update(b1e2DomElem, BEMHTML.apply({
                        block : 'b1',
                        elem : 'e1'
                    }));

                    b1Block._elems(B1E1Elem);
                    spy.should.be.calledTwice;
                });

                it('should drop elems cache on DOM replace', function() {
                    b1Block._elems(B1E1Elem);

                    bemDom.replace(b1e2DomElem, BEMHTML.apply({
                        block : 'b1',
                        elem : 'e1'
                    }));

                    b1Block._elems(B1E1Elem);
                    spy.should.be.calledTwice;
                });

                it('should drop elems cache on DOM append', function() {
                    b1Block._elems(B1E1Elem);

                    bemDom.append(b1Block.domElem, BEMHTML.apply({
                        block : 'b1',
                        elem : 'e1',
                        js : true
                    }));

                    b1Block._elems(B1E1Elem);
                    spy.should.be.calledTwice;
                });

                // NOTE: does't work because of too complex elems cache maintaince in case of elems without js
                it.skip('should drop elems cache on DOM append of elems without js', function() {
                    b1Block._elems(B1E1Elem);

                    bemDom.append(b1Block.domElem, BEMHTML.apply({
                        block : 'b1',
                        elem : 'e1'
                    }));

                    b1Block._elems(B1E1Elem);
                    spy.should.be.calledTwice;
                });

                it('should drop elems cache on DOM update in case of elem without data-bem', function() {
                    b1Block._elems(B1E1Elem);

                    bemDom.append(b1Block.domElem, BEMHTML.apply({
                        block : 'b1',
                        elem : 'e2',
                        js : true,
                        mix : { block : 'b1', elem : 'e1', js : true }
                    }));

                    b1Block._elems(B1E1Elem);
                    spy.should.be.calledTwice;
                });
            });

            describe('for not affected elems', function() {
                it('should not drop elems cache on DOM destruct', function() {
                    b1Block._elems(B1E4Elem);

                    bemDom.destruct(b1e2DomElem);

                    b1Block._elems(B1E4Elem);
                    spy.should.be.callOnce;
                });

                it('should not drop elems cache on DOM update', function() {
                    b1Block._elems(B1E4Elem);

                    bemDom.update(b1e2DomElem, BEMHTML.apply({
                        block : 'b1',
                        elem : 'e1'
                    }));

                    b1Block._elems(B1E4Elem);
                    spy.should.be.callOnce;
                });

                it('should not drop elems cache on DOM replace', function() {
                    b1Block._elems(B1E4Elem);

                    bemDom.replace(b1e2DomElem, BEMHTML.apply({
                        block : 'b1',
                        elem : 'e1'
                    }));

                    b1Block._elems(B1E4Elem);
                    spy.should.be.callOnce;
                });
            });
        });
    });

    describe('bemDom.init', function() {
        var spy;
        beforeEach(function() {
            spy = sinon.spy();
        });

        it('should init block', function() {
            bemDom.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            rootNode = createDomNode({
                tag : 'div',
                content : { block : 'block', js : true }
            });

            spy.should.have.been.called;
        });

        it('should properly init block with multiple DOM nodes', function(done) {
            bemDom.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : function() {
                            this.domElem.length.should.be.equal(2);
                            done();
                        }
                    }
                }
            });

            rootNode = createDomNode({
                tag : 'div',
                content : [
                    { block : 'block', js : { id : 'id' } },
                    { block : 'block', js : { id : 'id' } }
                ]
            });
        });

        it('should properly init elem with multiple DOM nodes', function(done) {
            bemDom.declBlock('block');

            bemDom.declElem('block', 'e1', {
                onSetMod : {
                    js : {
                        inited : function() {
                            this.domElem.length.should.be.equal(2);
                            done();
                        }
                    }
                }
            });

            rootNode = createDomNode({
                block : 'block',
                content : [
                    { elem : 'e1', js : { id : 'id' } },
                    { elem : 'e1', js : { id : 'id' } }
                ]
            });
        });

        it('shouldn\'t init lazy block', function() {
            bemDom.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            }, {
                lazyInit : true
            });

            rootNode = initDom({
                tag : 'div',
                content : { block : 'block', js : true }
            });

            spy.should.not.have.been.called;
        });

        it('should allow to pass string', function() {
            bemDom.declBlock('block', {
                onSetMod : {
                    js : {
                        inited : spy
                    }
                }
            });

            rootNode = initDom({
                tag : 'div',
                content : { block : 'block', js : true }
            });

            spy.should.have.been.called;
        });
    });

    describe('bemDom.detach', function() {
        it('should detach block but leave DOM node', function() {
            var spy = sinon.spy();
            bemDom.declBlock('block1', {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            rootNode = createDomNode({
                tag : 'div',
                content : { block : 'block1', js : true }
            });

            bemDom.detach(rootNode.find('.block1'));

            spy.should.have.been.calledOnce;
            rootNode.find('.block1').length.should.be.equal(1);
        });
    });

    describe('bemDom.destruct', function() {
        var spy;
        beforeEach(function() {
            spy = sinon.spy();
        });

        it('should destruct block only if it has no dom nodes', function() {
            bemDom.declBlock('block', {
                onSetMod : {
                    js : {
                        '' : spy
                    }
                }
            });

            rootNode = createDomNode({
                tag : 'div',
                content : [
                    { block : 'block', js : { id : 'block' } },
                    { block : 'block', js : { id : 'block' } }
                ]
            });

            bemDom.destruct(rootNode.find('.block :eq(0)'));
            spy.should.not.have.been.called;

            bemDom.destruct(rootNode.find('.block'));
            spy.should.have.been.called;
        });

        it('should destruct implicitly inited block', function() {
            var Block = bemDom.declBlock('block', {
                    onSetMod : {
                        js : {
                            '' : spy
                        }
                    }
                });

            rootNode = createDomNode({
                tag : 'div',
                content : { block : 'block' }
            });

            var blockNode = rootNode.find('.block');
            blockNode.bem(Block);
            bemDom.destruct(blockNode);
            spy.should.have.been.called;
        });

        // see https://github.com/bem/bem-core/issues/1383
        it('should not re-initialize destructing entities during destruct', function() {
            var Block = bemDom.declBlock('block', {
                    __constructor : function() {
                        this.__base.apply(this, arguments);
                        spy();
                    }
                }, {
                    onInit : function() {
                        this._domEvents().on('blur', functions.noop);
                    }
                });

            rootNode = initDom({
                block : 'block',
                js : true,
                tag : 'input'
            });

            rootNode.focus();
            bemDom.destruct(rootNode);
            spy.should.have.been.calledOnce;
        });
    });

    describe('bemDom.update', function() {
        it('should properly update tree', function() {
            var spyBlock1Destructed = sinon.spy(),
                spyBlock2Inited = sinon.spy();

            bemDom.declBlock('block1', {
                onSetMod : {
                    js : {
                        '' : spyBlock1Destructed
                    }
                }
            });
            bemDom.declBlock('block2', {
                onSetMod : {
                    js : {
                        inited : spyBlock2Inited
                    }
                }
            });

            rootNode = createDomNode({
                tag : 'div',
                content : { block : 'block1', js : true }
            });

            bemDom.update(rootNode, BEMHTML.apply({ block : 'block2', js : true }))
                .should.be.equal(rootNode);

            spyBlock1Destructed.called.should.be.true;
            spyBlock2Inited.called.should.be.true;
        });

        it('should allow to pass simple string', function() {
            var domElem = $('<div/>');
            bemDom.update(domElem, 'simple string');
            domElem.html().should.be.equal('simple string');
        });
    });

    describe('bemDom.before', function() {
        it('should properly update tree', function() {
            var spyBlock2Inited = sinon.spy(),
                block2DomElem;

            bemDom.declBlock('block2', {
                onSetMod : {
                    js : {
                        inited : function() {
                            spyBlock2Inited();
                            block2DomElem = this.domElem;
                        }
                    }
                }
            });

            rootNode = createDomNode({
                tag : 'div',
                content : { block : 'block1', js : true }
            });

            var newCtx = bemDom.before(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            newCtx.is(block2DomElem).should.be.true;
            rootNode.children().eq(0).is(block2DomElem).should.be.true;
            spyBlock2Inited.called.should.be.true;
        });
    });

    describe('bemDom.replace', function() {
        it('should properly replace tree', function() {
            var spyBlock1Destructed = sinon.spy(),
                spyBlock2Inited = sinon.spy();

            bemDom.declBlock('block1', {
                onSetMod : {
                    js : {
                        '' : spyBlock1Destructed
                    }
                }
            });
            bemDom.declBlock('block2', {
                onSetMod : {
                    js : {
                        inited : spyBlock2Inited
                    }
                }
            });

            rootNode = initDom({
                tag : 'div',
                content : { block : 'block1', js : true }
            });

            bemDom.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledOnce;
            spyBlock2Inited.should.have.been.calledOnce;

            rootNode.html().should.be.equal('<div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div>');

            bemDom.destruct(rootNode);

            rootNode = createDomNode({
                    tag : 'div',
                    content : [{ tag : 'p' }, { block : 'block1', js : true }, { tag : 'p' }]
                });

            bemDom.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledTwice;
            spyBlock2Inited.should.have.been.calledTwice;

            rootNode.html().should.be.equal('<p></p><div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div><p></p>');
        });
    });

    // don't add specs for other DOM changing methods as they are implemented the same way

    describe('params', function() {
        it('should properly join params', function(done) {
            var Block = bemDom.declBlock('block', {
                    _getDefaultParams : function() {
                        return { p1 : 1 };
                    }
                });

            bemDom.declBlock('block2', {
                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            var params = this.findMixedBlock(Block).params;
                            params.p1.should.be.equal(1);
                            params.p2.should.be.equal(2);
                            params.p3.should.be.equal(3);

                            done();
                        }
                    }
                }
            });

            rootNode = createDomNode({
                tag : 'div',
                content : [
                    { block : 'block', js : { id : 'bla', p2 : 2 }, mix : { block : 'block2', js : true } },
                    { block : 'block', js : { id : 'bla', p3 : 3 } }
                ]
            });
        });
    });

    describe('containsEntity', function() {
        var domElem, block, block2;
        beforeEach(function() {
            var Block = bemDom.declBlock('block'),
                Block2 = bemDom.declBlock('block2');

            domElem = initDom([
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
            ]);

            block = domElem.filter('.block').bem(Block);
            block2 = domElem.filter('.block2').bem(Block2);
        });

        it('should properly checks for nested entities', function() {
            block.containsEntity(block._elem('e2-1')).should.be.true;
            block.containsEntity(block2).should.be.false;
        });
    });

    describe('onInit', function() {
        var spy, Block;

        beforeEach(function() {
            spy = sinon.spy();

            Block = bemDom.declBlock('block', {}, {
                onInit : spy
            });
        });

        it('should have been called once', function() {
            rootNode = initDom([{
                block : 'block',
                js : true
            }, {
                block : 'block',
                js : true
            }]);

            spy.should.have.been.calledOnce;
        });

        it('should have been properly called in case of additional declaration after first initialization', function() {
            rootNode = initDom({
                block : 'block',
                js : true
            });

            var spy2 = sinon.spy();

            bemDom.declBlock('block', {}, {
                onInit : spy2
            });

            spy.should.have.been.calledOnce;
            spy2.should.have.been.calledOnce;
        });
    });

    describe('lazy init', function() {
        var spy;

        it('should be possible to force initialization', function() {
            spy = sinon.spy();

            bemDom.declBlock('block', {
                onSetMod : {
                    'js' : {
                        'inited' : spy
                    }
                }
            }, {
                lazyInit : true
            });

            rootNode = initDom({
                block : 'block',
                js : { lazyInit : false }
            });

            spy.should.have.been.called;
        });

        it('should be possible to force lazy initialization', function() {
            spy = sinon.spy();

            bemDom.declBlock('block', {
                onSetMod : {
                    'js' : {
                        'inited' : spy
                    }
                }
            }, {
                lazyInit : false
            });

            rootNode = initDom({
                block : 'block',
                js : { lazyInit : true }
            });

            spy.should.have.not.been.called;
        });

        describe('on DOM events', function() {
            beforeEach(function() {
                spy = sinon.spy();

                bemDom.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : spy
                        }
                    }
                }, {
                    lazyInit : true,
                    onInit : function() {
                        this._domEvents().on('click', functions.noop);
                    }
                });

                rootNode = initDom({
                    block : 'block',
                    js : true
                });
            });

            it('should init block on DOM event', function() {
                spy.should.not.have.been.called;
                rootNode.trigger('click');
                spy.should.have.been.called;
            });
        });

        describe('on BEM events', function() {
            var block2;
            beforeEach(function() {
                spy = sinon.spy();

                bemDom.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : spy
                        }
                    }
                }, {
                    lazyInit : true,
                    onInit : function() {
                        this._events(Block2).on('click', functions.noop);
                    }
                });

                var Block2 = bemDom.declBlock('block2');

                block2 = initDom({
                        block : 'block',
                        js : true,
                        content : {
                            block : 'block2',
                            js : true
                        }
                    })
                    .find(Block2._buildSelector())
                    .bem(Block2);
            });

            it('should init block on BEM event', function() {
                spy.should.not.have.been.called;
                block2._emit('click');
                spy.should.have.been.called;
            });
        });
    });

    describe('modules.define patching', function() {
        it('should provide bemDom block', function(done) {
            var name = 'b' + Math.random(),
                spy = sinon.spy();

            modules.define(name, ['i-bem-dom'], function(provide, bemDom) {
                spy();
                provide(bemDom.declBlock(this.name, {}));
            });

            modules.define(name, function(provide, Prev) {
                spy();
                Prev.should.be.eql(bem.entities[this.name]);
                provide(bemDom.declBlock(this.name, {}));
            });

            modules.require([name], function(Block) {
                spy.should.have.been.calledTwice;
                Block.should.be.eql(bem.entities[name]);
                done();
            });
        });
    });
});

provide();

function createDomNode(bemjson) {
    return bemDom.init(BEMHTML.apply(bemjson));
}

function initDom(bemjson) {
    return createDomNode(bemjson).appendTo(bemDom.scope);
}

function getEntityIds(entities) {
    return entities.map(function(entity) {
        return entity.params.id;
    });
}

});
