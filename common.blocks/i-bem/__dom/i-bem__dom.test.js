modules.define(
    'test',
    ['i-bem__dom', 'jquery', 'sinon', 'BEMHTML'],
    function(provide, DOM, $, sinon, BEMHTML) {

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
                }
            ].forEach(function(data) {
                (rootNode = $('<div class="' + data.cls + '"/>')).bem('block').getMod('m1')
                    .should.be.equal(data.val);
                DOM.destruct(rootNode);
            });

            delete DOM.blocks['block'];
        });
    });

    describe('getMods', function() {
        it('should return properly extracted mods from html', function() {
            DOM.decl('block', {});

            var rootNode;
            [
                {
                    cls  : '',
                    mods : { js : 'inited' }
                },
                {
                    cls  : 'block_m1_v1',
                    mods : { js : 'inited', m1 : 'v1' }
                },
                {
                    cls  : 'block_m1_v1 block_m2_v2 bla-block_m4_v3 block_m4_v4',
                    mods : { js : 'inited', m1 : 'v1', m2 : 'v2', m4 : 'v4' }
                },
                {
                    cls  : 'bla-block_m1_v1 block_m2_v2 block_m3_v3 bla-block_m3_v4',
                    mods : { js : 'inited', m2 : 'v2', m3 : 'v3' }
                }
            ].forEach(function(data) {
                (rootNode = $('<div class="' + data.cls + '"/>')).bem('block').getMods()
                    .should.be.eql(data.mods);
                DOM.destruct(rootNode);
            });

            delete DOM.blocks['block'];
        });
    });

    describe('elemify', function() {
        var rootNode, instance;
        beforeEach(function() {
            DOM.decl('block', {});
            rootNode = DOM.init($(BEMHTML.apply({
                block : 'block',
                js : true,
                content : { elem : 'e1', mix : { elem : 'e2' }}})));
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
                    content : { block : 'block', js : true }})));

            spy.called.should.be.true;

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
                    content : { block : 'block', js : true }})));

            DOM.init(rootNode);
            spy.called.should.be.false;

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
                        { block : 'block', js : { id : 'block' }},
                        { block : 'block', js : { id : 'block' }}
                    ]})));

            DOM.destruct(rootNode.find('.block:eq(0)'));
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
                    content : { block : 'block1', js : true }})));

            DOM.update(rootNode, BEMHTML.apply({ block : 'block2', js : true }));

            spyBlock1Destructed.called.should.be.true;
            spyBlock2Inited.called.should.be.true;

            DOM.destruct(rootNode);
            delete DOM.blocks['block1'];
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
});

provide();

});
