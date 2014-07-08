modules.define(
    'spec',
    ['i-bem', 'i-bem-dom', 'objects', 'jquery', 'chai', 'sinon', 'BEMHTML'],
    function(provide, BEM, BEMDOM, objects, $, chai, sinon, BEMHTML) {

var undef,
    expect = chai.expect;

describe('i-bem-dom', function() {
    var rootNode;

    afterEach(function() {
        if(rootNode) {
            BEMDOM.destruct(rootNode);
            rootNode = null;
        }

        Object.keys(BEM.entities).forEach(function(entityName) {
            delete BEM.entities[entityName];
        });
    });

    describe('getMod', function() {
        it('should return properly extracted mod from html', function() {
            var Block = BEMDOM.declBlock('block');

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

                BEMDOM.destruct(rootNode);
            });
        });

        it('should return properly extracted elem mod from html', function() {
            var Block = BEMDOM.declBlock('block');

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
                })).bem(Block).elem('elem').getMod('m1')
                    .should.be.equal(data.val);

                BEMDOM.destruct(rootNode);
            });
        });
    });

    describe('setMod', function() {
        it('should properly set CSS classes', function() {
            var Block = BEMDOM.declBlock('block');

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
                }
            ].forEach(function(data) {
                var block = (rootNode = createDomNode({
                        block : 'block',
                        mods : data.beforeMods
                    })).bem(Block);

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        block.setMod(modName) :
                        block.setMod(modName, modVal);
                });

                block.domElem[0].className.should.be.equal(data.afterCls);

                BEMDOM.destruct(rootNode);
            });
        });

        it('should properly set elem CSS classes', function() {
            var Block = BEMDOM.declBlock('block'),
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
                    })).bem(Block).elem('elem');

                objects.each(data.mods, function(modVal, modName) {
                    modName === 'm3'?
                        elem.setMod(modName) :
                        elem.setMod(modName, modVal);
                });

                elem.domElem[0].className.should.be.equal(data.afterCls);

                BEMDOM.destruct(rootNode);
            });
        });
    });
    
    describe('find*Block(s)', function() {
        var rootBlock,
            B1Block, B3Block, B4Block, B5Block;
        
        beforeEach(function() {
            var RootBlock = BEMDOM.declBlock('root');
            B1Block = BEMDOM.declBlock('b1');
            B3Block = BEMDOM.declBlock('b3');
            B4Block = BEMDOM.declBlock('b4');
            B5Block = BEMDOM.declBlock('b5');

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
        });
        
        describe('findChildBlock', function() {
            it('should return instance of Block found by class', function() {
                rootBlock.findChildBlock(B1Block).should.be.instanceOf(B1Block);
            });

            it('should return null if nothing found', function() {
                var B99Block = BEMDOM.declBlock('b99');
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
        });
        
        describe('findParentBlocks', function() {
            var leafBlock;

            beforeEach(function() {
                leafBlock = rootBlock.findChildBlock({ block : B1Block, modName : 'm1', modVal : true });
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
        });

        describe('findParentBlock', function() {
            var leafBlock;

            beforeEach(function() {
                leafBlock = rootBlock.findChildBlock({ block : B1Block, modName : 'm1', modVal : true });
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
        });

        describe('findMixedBlocks', function() {
            it('should find all mixed blocks by block class', function() {
                getEntityIds(
                    rootBlock.findChildBlock({ block : B3Block })
                        .findMixedBlocks(B4Block)
                ).should.be.eql(['6', '8']);
            });
        });

        describe('findMixedBlock', function() {
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
        });
    });

    describe('find*Elem(s)', function() {
        var b1Block,
            B1E1Elem, B1E3Elem, B1E4Elem;

        beforeEach(function() {
            var B1Block = BEMDOM.declBlock('b1');

            B1E1Elem = BEMDOM.declElem('b1', 'e1');
            B1E3Elem = BEMDOM.declElem('b1', 'e3');
            B1E4Elem = BEMDOM.declElem('b1', 'e4');

            rootNode = createDomNode(
                {
                    block : 'b1',
                    content : [
                        { block : 'b2', content : { elem : 'e1' } },
                        { elem : 'e2' },
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
                                        content : {
                                            elem : 'e1',
                                            elemMods : { m1 : true },
                                            js : { id : '4' }
                                        }
                                    }
                                }
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
        });

        describe('findChildElem', function() {
            it('should return instance of Elem founded by class', function() {
                b1Block.findChildElem(B1E1Elem).should.be.instanceOf(B1E1Elem);
            });

            it('should return null if nothing found', function() {
                var B99Elem = BEMDOM.declElem('b1', 'e99');
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
        });

        describe('findParentElems', function() {
            var leafEntity;

            beforeEach(function() {
                leafEntity = b1Block.findChildElem({ elem : B1E1Elem, modName : 'm1', modVal : true });
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
        });

        describe('findMixedElems', function() {
            it('should find all mixed elems by elem class', function() {
                getEntityIds(
                    b1Block.findChildElem(B1E3Elem)
                        .findMixedElems(B1E4Elem)
                ).should.be.eql(['6', '8']);
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
        });
    });

    describe('elem(s)', function() {
        var b1Block,
            B1E1Elem,
            spy;

        beforeEach(function() {
            var B1Block = BEMDOM.declBlock('b1');

            B1E1Elem = BEMDOM.declElem('b1', 'e1');

            rootNode = createDomNode({
                block : 'b1',
                content : [
                    { elem : 'e1', js : { id : 1 } },
                    { elem : 'e1', elemMods : { m1 : 'v1' }, js : { id : 2 } }
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
                getEntityIds(b1Block.elems(B1E1Elem))
                    .should.be.eql([1, 2]);
            });

            it('should find all elems by elem class modName and modVal', function() {
                getEntityIds(b1Block.elems({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' }))
                    .should.be.eql([2]);
            });

            it('should cache found elems', function() {
                b1Block.elems(B1E1Elem).should.be.equal(b1Block.elems(B1E1Elem));
                spy.should.be.calledOnce;
            });

            it('should cache found elems with respect to mods', function() {
                b1Block.elems({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' });
                spy.should.be.calledOnce;

                b1Block.elems(B1E1Elem);
                spy.should.be.calledTwice;
            });

            it('should not drop elems cache in case elem mods change', function() {
                var elem = b1Block.elems(B1E1Elem)[0];
                spy.should.be.calledOnce;

                elem.setMod('m2', 'v1');

                b1Block.elems(B1E1Elem);
                spy.should.be.calledOnce;
            });

            it('should drop elems cache in case mods change', function() {
                var elem = b1Block.findChildElem(B1E1Elem);

                b1Block.elems({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledOnce;

                elem.setMod('m2', 'v1');
                b1Block.elems({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledTwice;

                elem.delMod('m2');
                b1Block.elems({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledThrice;
            });
        });

        describe('elem', function() {
            beforeEach(function() {
                spy = sinon.spy(b1Block, 'findChildElem');
            });

            it('should find first elem by elem class', function() {
                b1Block.elem(B1E1Elem)
                    .params.id
                        .should.be.equal(1);
            });

            it('should find first elem by elem class modName and modVal', function() {
                b1Block.elem({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' })
                    .params.id
                        .should.be.equal(2);
            });

            it('should cache found elem', function() {
                b1Block.elem(B1E1Elem);
                b1Block.elem(B1E1Elem);
                spy.should.be.calledOnce;
            });

            it('should cache found elem with respect to mods', function() {
                b1Block.elem({ elem : B1E1Elem, modName : 'm1', modVal : 'v1' });
                spy.should.be.calledOnce;

                b1Block.elem(B1E1Elem);
                spy.should.be.calledTwice;
            });

            it('should not drop elem cache in case elem mods change', function() {
                var elem = b1Block.elem(B1E1Elem);
                spy.should.be.calledOnce;

                elem.setMod('m2', 'v1');

                b1Block.elem(B1E1Elem);
                spy.should.be.calledOnce;
            });

            it('should drop elem cache in case mods change', function() {
                var elem = b1Block.findChildElems(B1E1Elem)[0];

                b1Block.elem({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledOnce;

                elem.setMod('m2', 'v1');
                b1Block.elem({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledTwice;

                elem.delMod('m2');
                b1Block.elem({ elem : B1E1Elem, modName : 'm2', modVal : 'v1' });
                spy.should.be.calledThrice;
            });
        });
    });

    describe('BEMDOM.init', function() {
        var spy;
        beforeEach(function() {
            spy = sinon.spy();
        });

        it('should init block', function() {
            BEMDOM.declBlock('block', {
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

            rootNode = createDomNode({
                tag : 'div',
                content : [
                    { block : 'block', js : { id : 'id' } },
                    { block : 'block', js : { id : 'id' } }
                ]
            });
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
        var spy;
        beforeEach(function() {
            spy = sinon.spy();
        });

        it('should destruct block only if it has no dom nodes', function() {
            BEMDOM.declBlock('block', {
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

            BEMDOM.destruct(rootNode.find('.block :eq(0)'));
            spy.should.not.have.been.called;

            BEMDOM.destruct(rootNode.find('.block'));
            spy.should.have.been.called;
        });

        it('should destruct implicitly inited block', function() {
            var Block = BEMDOM.declBlock('block', {
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

            rootNode = createDomNode({
                tag : 'div',
                content : { block : 'block1', js : true }
            });

            BEMDOM.update(rootNode, BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.called.should.be.true;
            spyBlock2Inited.called.should.be.true;
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

            rootNode = BEMDOM.init(BEMHTML.apply({
                tag : 'div',
                content : { block : 'block1', js : true }
            }));

            BEMDOM.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledOnce;
            spyBlock2Inited.should.have.been.calledOnce;

            rootNode.html().should.be.equal('<div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div>');

            BEMDOM.destruct(rootNode);

            rootNode = createDomNode({
                    tag : 'div',
                    content : [{ tag : 'p' }, { block : 'block1', js : true }, { tag : 'p' }]
                });

            BEMDOM.replace(rootNode.find('.block1'), BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.should.have.been.calledTwice;
            spyBlock2Inited.should.have.been.calledTwice;

            rootNode.html().should.be.equal('<p></p><div class="block2 i-bem block2_js_inited" data-bem="{&quot;block2&quot;:{}}"></div><p></p>');
        });
    });

    describe('params', function() {
        it('should properly join params', function(done) {
            var Block = BEMDOM.declBlock('block', {
                    getDefaultParams : function() {
                        return { p1 : 1 };
                    }
                });

            BEMDOM.declBlock('block2', {
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

    describe('emit', function() {
        it('should emit context event with target', function() {
            rootNode = $('<div/>');

            var Block = BEMDOM.declBlock('block', {
                    onSetMod : {
                        'js' : {
                            'inited' : function() {
                                this.emit('event');
                            }
                        }
                    }
                }),
                spy = sinon.spy();

            BEM.entities['block'].on(rootNode, 'event', spy);
            BEMDOM.update(rootNode, BEMHTML.apply({ block : 'block', js : true }));

            var block = rootNode.find('.block').bem(Block);

            spy.should.have.been.calledOnce;
            spy.args[0][0].target.should.be.equal(block);
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

        it('should properly checks for nested dom elem', function() {
            block.containsDomElem(block.elem('e2-1').domElem).should.be.true;
            block.containsDomElem(block2.domElem).should.be.false;
        });
    });

    describe.skip('DOM events', function() {
        var Block, block, spy1, spy2, spy3, spy4, spy5,
            data = { data : 'data' };

        beforeEach(function() {
            spy1 = sinon.spy();
            spy2 = sinon.spy();
            spy3 = sinon.spy();
            spy4 = sinon.spy();
            spy5 = sinon.spy();
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
                block = createDomNode({ block : 'block' }).bem(Block);
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
                block = createDomNode({ block : 'block', content : [{ elem : 'e1' }, { elem : 'e2' }] })
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
                block = createDomNode({ block : 'block', content : [{ elem : 'e1' }, { elem : 'e2' }] })
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
                block = createDomNode({ block : 'block' }).bem(Block);
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

    describe.skip('liveInitOnBlockInsideEvent', function() {
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
                    });

            rootNode = BEMDOM.init(BEMHTML.apply({
                block : 'block1',
                js : true,
                content : {
                    block : 'block2',
                    js : true
                }
            }));

            var block = rootNode.find('.block2').bem(Block2);

            spyInit.called.should.be.false;
            spyHandler.called.should.be.false;

            block.emit('event');

            spyInit.called.should.be.true;
            spyHandler.called.should.be.true;

            BEMDOM.destruct(rootNode);
            delete BEM.entities['block1'];
            delete BEM.entities['block2'];
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
                Prev.should.be.eql(BEM.entities[this.name]);
                provide(BEMDOM.declBlock(this.name, {}));
            });

            modules.require([name], function(Block) {
                spy.should.have.been.calledTwice;
                Block.should.be.eql(BEM.entities[name]);
                done();
            });
        });
    });

    describe.skip('mod change events', function() {
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
                block2 = block1.findChildBlock(Block2);

            BEMDOM.destruct(block2.domElem);

            spy.should.have.been.called;

            delete BEM.entities['block2'];
            delete BEM.entities['block1'];
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

                BEM.entities['block']
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

function createDomNode(bemjson) {
    return BEMDOM.init(BEMHTML.apply(bemjson));
}

function getEntityIds(entities) {
    return entities.map(function(entity) {
        return entity.params.id;
    });
}

});
