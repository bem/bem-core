modules.define('spec', ['i-bem', 'i-bem-dom', 'i-bem-dom__collection', 'objects', 'BEMHTML'], function(provide, bem, bemDom, BemDomCollection, objects, BEMHTML) {

describe('BEM collections', function() {
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

    describe('find', function() {
        var rootBlock, B1Block, B2Block, B3Block;

        beforeEach(function() {
            var RootBlock = bemDom.declBlock('root');
            B1Block = bemDom.declBlock('b1');
            B2Block = bemDom.declBlock('b2');
            B3Block = bemDom.declBlock('b3');

            rootNode = bemDom.init(BEMHTML.apply({
                block : 'root',
                content : [
                    {
                        block : 'b1',
                        js : { id : 'b1_1' },
                        mix : { block : 'b3', js : { id : 'b3_1' } },
                        content : [
                            {
                                block : 'b2',
                                js : { id : 'b2_1' }
                            },
                            {
                                block : 'b2',
                                js : { id : 'b2_2' }
                            },
                        ]
                    },
                    {
                        block : 'b1',
                        js : { id : 'b1_2' },
                        mix : { block : 'b3', js : { id : 'b3_2' } },
                        content : [
                            {
                                block : 'b2',
                                js : { id : 'b2_3' }
                            },
                            {
                                block : 'b2',
                                js : { id : 'b2_4' }
                            },
                        ]
                    }
                ]
            }));

            rootBlock = rootNode.bem(RootBlock);
        });

        describe('findChildBlock', function() {
            it('should find the first child block for every entities in collection', function() {
                var res = rootBlock.findChildBlocks(B1Block).findChildBlock(B2Block);

                res.should.be.instanceOf(BemDomCollection);
                getEntityIds(res).should.be.eql(['b2_1', 'b2_3']);
            });
        });

        describe('findChildBlocks', function() {
            it('should find child block for every entities in collection', function() {
                var res = rootBlock.findChildBlocks(B1Block).findChildBlocks(B2Block);

                res.should.be.instanceOf(BemDomCollection);
                getEntityIds(res).should.be.eql(['b2_1', 'b2_2', 'b2_3', 'b2_4']);
            });
        });

        describe('findParentBlock', function() {
            it('should find the first parent block for every entities in collection', function() {
                var res = rootBlock.findChildBlocks(B2Block).findParentBlock(B1Block);

                res.should.be.instanceOf(BemDomCollection);
                getEntityIds(res).should.be.eql(['b1_1', 'b1_2']);
            });
        });

        describe('findParentBlocks', function() {
            it('should find parent block for every entities in collection', function() {
                var res = rootBlock.findChildBlocks(B2Block).findParentBlocks(B1Block);

                res.should.be.instanceOf(BemDomCollection);
                getEntityIds(res).should.be.eql(['b1_1', 'b1_2']);
            });
        });

        describe('findMixedBlock', function() {
            it('should find the first parent block for every entities in collection', function() {
                var res = rootBlock.findChildBlocks(B1Block).findMixedBlock(B3Block);

                res.should.be.instanceOf(BemDomCollection);
                getEntityIds(res).should.be.eql(['b3_1', 'b3_2']);
            });
        });

        describe('findMixedBlocks', function() {
            it('should find parent block for every entities in collection', function() {
                var res = rootBlock.findChildBlocks(B1Block).findMixedBlocks(B3Block);

                res.should.be.instanceOf(BemDomCollection);
                getEntityIds(res).should.be.eql(['b3_1', 'b3_2']);
            });
        });
    });
});

function getEntityIds(entities) {
    return entities.map(function(entity) {
        return entity.params && entity.params.id;
    });
}

provide();

});
