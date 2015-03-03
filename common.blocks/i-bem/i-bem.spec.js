modules.define('spec', ['i-bem', 'sinon'], function(provide, BEM, sinon) {

describe('i-bem', function() {
    describe('decl', function() {
        afterEach(function() {
            delete BEM.blocks['block'];
        });

        it('should return block', function() {
            var block = BEM.decl('block', {});
            block.should.be.equal(BEM.blocks['block']);
        });

        it('should allow inheritance', function() {
            var block = BEM.decl('block', {}),
                block2 = block.decl('block2', {});

            (new block2()).should.be.instanceOf(block);
            (new block2()).should.be.instanceOf(block2);

            delete BEM.blocks['block2'];
        });

        it('should allow inheritance from itself', function() {
            var block = BEM.decl('block', {}),
                block2 = block.decl({});

            block2.should.be.equal(block);
        });

        it('should allow to define only modName and modVal', function() {
            var block = BEM.decl('block', {}),
                block2 = block.decl({ modName : 'm1', modVal : 'v1' }, {});

            block2.should.be.equal(block);
            block2.getName().should.be.equal('block');
        });

        it('should allow use block class as baseBlock', function() {
            var block = BEM.decl('block', {}),
                block2 = block.decl({ block : 'block2', baseBlock : block }, {});

            (new block2()).should.be.instanceOf(block);
            (new block2()).should.be.instanceOf(block2);

            delete BEM.blocks['block2'];
        });

        it('should apply method only if block has mod', function() {
            var baseMethodSpy = sinon.spy(),
                modsMethodSpy = sinon.spy();

            BEM.decl('block', {
                method : baseMethodSpy
            });
            BEM.decl({ block : 'block', modName : 'mod1', modVal : 'val1' }, {
                method : modsMethodSpy
            });

            var instance = BEM.create({ block : 'block', mods : { 'mod1' : 'val1' } });

            instance.method();
            baseMethodSpy.called.should.be.false;
            modsMethodSpy.called.should.be.true;

            instance.setMod('mod1', 'val2');
            instance.method();
            baseMethodSpy.called.should.be.true;
            modsMethodSpy.callCount.should.be.equal(1);
        });

        it('should apply method only if block has boolean mod', function() {
            var baseMethodSpy = sinon.spy(),
                modsMethodSpy = sinon.spy();

            BEM.decl('block', {
                method : baseMethodSpy
            });

            BEM.decl({ block : 'block', modName : 'mod1', modVal : true }, {
                method : modsMethodSpy
            });

            var instance = BEM.create({ block : 'block', mods : { 'mod1' : true } });

            instance.method();
            baseMethodSpy.should.not.have.been.called;
            modsMethodSpy.should.have.been.calledOnce;

            instance.delMod('mod1');
            instance.method();
            baseMethodSpy.should.have.been.calledOnce;
            modsMethodSpy.should.have.been.calledOnce;
        });
    });

    describe('create', function() {
        it('should return instance of block', function() {
            var block = BEM.decl('block', {}),
                instance = BEM.create('block');

            instance.should.be.instanceOf(block);
            delete BEM.blocks['block'];
        });
    });

    describe('mods', function() {
        var block;
        beforeEach(function() {
            BEM.decl('block', {});
            block = BEM.create({ block : 'block', mods : { mod1 : 'val1', mod2 : true, mod3 : false } });
        });
        afterEach(function() {
            delete BEM.blocks['block'];
        });

        describe('getMod', function() {
            it('should return current mod\'s value', function() {
                block.getMod('mod1').should.be.equal('val1');
            });

            it('should return current boolean mod\'s value', function() {
                block.getMod('mod2').should.be.true;
                block.getMod('mod3').should.be.equal('');
            });

            it('should return \'\' for undefined mod', function() {
                block.getMod('mod4').should.be.equal('');
            });
        });

        describe('setMod', function() {
            it('should update mod value', function() {
                block
                    .setMod('mod1', 'val2')
                    .getMod('mod1')
                        .should.be.equal('val2');
            });

            it('should update boolean mod value', function() {
                block
                    .setMod('mod1', true)
                    .getMod('mod1').should.be.true;

                block
                    .setMod('mod1', false)
                    .getMod('mod1').should.be.equal('');

                block
                    .setMod('mod1')
                    .getMod('mod1').should.be.true;
            });

            it('should cast non-boolean mod value to string', function() {
                block
                    .setMod('mod1', 1)
                    .getMod('mod1').should.be.equal('1');
            });
        });

        describe('delMod', function() {
            it('should set mod\'s value to \'\'', function() {
                block
                    .delMod('mod1')
                    .getMod('mod1')
                        .should.be.equal('');
            });
        });

        describe('hasMod', function() {
            it('should return true for matching mod\'s value', function() {
                block.hasMod('mod1', 'val1').should.be.true;
            });

            it('should return false for non-matching mod\'s value', function() {
                block.hasMod('mod1', 'val2').should.be.false;
            });

            it('should return false for undefined mod\'s value', function() {
                block.hasMod('mod2', 'val2').should.be.false;
            });

            it('in short form should return true for non-empty mod\'s value', function() {
                block.hasMod('mod1').should.be.true;
            });

            it('in short form should return true for empty mod\'s value', function() {
                block
                    .setMod('mod1', '')
                    .hasMod('mod1')
                        .should.be.false;
            });

            it('should treat defined non-boolean mod value as a string', function() {
                block
                    .setMod('mod1', 1)
                    .hasMod('mod1', 1)
                        .should.be.true;

                block.hasMod('mod1', '1')
                    .should.be.true;

                block
                    .setMod('mod1', '2')
                    .hasMod('mod1', 2)
                        .should.be.true;
            });

            it('in short form should return true for undefined mod', function() {
                block.hasMod('mod4').should.be.false;
            });

            it('should return true for matching boolean mod\'s value', function() {
                block
                    .setMod('mod1', true)
                    .hasMod('mod1').should.be.true;

                block.hasMod('mod1', true).should.be.true;
            });
        });

        describe('toggleMod', function() {
            it('should switch mod\'s values', function() {
                block
                    .toggleMod('mod1', 'val1', 'val2')
                    .hasMod('mod1', 'val2')
                        .should.be.true;

                block
                    .toggleMod('mod1', 'val1', 'val2')
                    .hasMod('mod1', 'val1')
                        .should.be.true;
            });

            it('should switch mod\'s value if "modVal2" param omited', function() {
                block
                    .toggleMod('mod1', 'val1')
                    .hasMod('mod1')
                        .should.be.false;

                block
                    .toggleMod('mod1', 'val1')
                    .hasMod('mod1', 'val1')
                        .should.be.true;
            });

            it('should switch boolean mod\'s value', function() {
                block
                    .toggleMod('mod2')
                    .hasMod('mod2')
                        .should.be.false;

                block
                    .toggleMod('mod2')
                    .hasMod('mod2')
                        .should.be.true;
            });

            it('should switch mod\'s values according to "condition" param', function() {
                block
                    .toggleMod('mod1', 'val1', 'val2', true)
                    .hasMod('mod1', 'val1')
                        .should.be.true;

                block
                    .toggleMod('mod1', 'val1', 'val2', false)
                    .hasMod('mod1', 'val2')
                        .should.be.true;
            });

            it('should switch mod\'s value according to "condition" param if "modVal2" param omited', function() {
                block
                    .toggleMod('mod1', 'val1', true)
                    .hasMod('mod1', 'val1')
                        .should.be.true;

                block
                    .toggleMod('mod1', 'val1', false)
                    .hasMod('mod1')
                        .should.be.false;
            });
        });
    });

    describe('beforeSetMod', function() {
        afterEach(function() {
            delete BEM.blocks['block'];
        });

        it('should call properly matched callbacks by order', function() {
            var order = [],
                spyMod1Val2 = sinon.spy(),
                spyMod2Val1 = sinon.spy(),
                spyMod2Val2 = sinon.spy();

            BEM.decl('block', {
                beforeSetMod : {
                    'mod1' : {
                        'val1' : function() {
                            order.push(5);
                        }
                    }
                }
            });

            BEM.decl('block', {
                beforeSetMod : {
                    'mod1' : function() {
                        order.push(3);
                    },

                    '*' : function(modName) {
                        modName === 'mod1' && order.push(1);
                    }
                }
            });

            BEM.decl('block', {
                beforeSetMod : function(modName) {
                    this.__base.apply(this, arguments);
                    modName === 'mod1' && order.push(2);
                }
            });

            BEM.decl('block', {
                beforeSetMod : {
                   'mod1' : {
                       '*' : function() {
                           this.__base.apply(this, arguments);
                           order.push(4);
                       },
                       'val1' : function() {
                            this.__base.apply(this, arguments);
                           order.push(6);
                       },
                       'val2' : spyMod1Val2
                   },
                   'mod2' : {
                       'val1' : spyMod2Val1,
                       'val2' : spyMod2Val2
                   }
                }
            });

            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0', mod2 : 'val0' } });
            block.setMod('mod1', 'val1');

            order.should.be.eql([1, 2, 3, 4, 5, 6]);
            spyMod1Val2.should.not.have.been.called;
            spyMod2Val1.should.not.have.been.called;
            spyMod2Val2.should.not.have.been.called;
        });

        it('should call callbacks before set mod', function(done) {
            BEM.decl('block', {
                beforeSetMod : {
                   'mod1' : {
                       'val1' : function() {
                           this.hasMod('mod1', 'val1').should.be.false;
                           done();
                       }
                   }
                }
            });
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' } });
            block.setMod('mod1', 'val1');
        });

        it('should set mod after callbacks', function() {
             BEM.decl('block', {
                beforeSetMod : {
                   'mod1' : {
                       'val1' : function() {}
                   }
                }
            });
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' } });
            block.setMod('mod1', 'val1');
            block.hasMod('mod1', 'val1').should.be.true;
        });

        it('shouldn\'t set mod when callback returns false', function() {
            BEM.decl('block', {
                beforeSetMod : {
                   'mod1' : {
                       'val1' : function() {
                           return false;
                       }
                   }
                }
            });
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' } });
            block.setMod('mod1', 'val1');
            block.hasMod('mod1', 'val1').should.be.false;
        });
    });

    describe('onSetMod', function() {
        afterEach(function() {
            delete BEM.blocks['block'];
        });

        it('should call properly matched callbacks by order', function() {
            var order = [],
                spyMod1Val2 = sinon.spy(),
                spyMod2Val1 = sinon.spy(),
                spyMod2Val2 = sinon.spy();

            BEM.decl('block', {
                onSetMod : {
                    'mod1' : {
                        'val1' : function() {
                            order.push(5);
                        }
                    }
                }
            });

            BEM.decl('block', {
                onSetMod : {
                    'mod1' : function() {
                        order.push(3);
                    },

                    '*' : function(modName) {
                        modName === 'mod1' && order.push(1);
                    }
                }
            });

            BEM.decl('block', {
                onSetMod : function(modName) {
                    this.__base.apply(this, arguments);
                    modName === 'mod1' && order.push(2);
                }
            });

            BEM.decl('block', {
                onSetMod : {
                   'mod1' : {
                       '*' : function() {
                           this.__base.apply(this, arguments);
                           order.push(4);
                       },
                       'val1' : function() {
                            this.__base.apply(this, arguments);
                           order.push(6);
                       },
                       'val2' : spyMod1Val2
                   },
                   'mod2' : {
                       'val1' : spyMod2Val1,
                       'val2' : spyMod2Val2
                   }
                }
            });

            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0', mod2 : 'val0' } });
            block.setMod('mod1', 'val1');

            order.should.be.eql([1, 2, 3, 4, 5, 6]);
            spyMod1Val2.should.not.have.been.called;
            spyMod2Val1.should.not.have.been.called;
            spyMod2Val2.should.not.have.been.called;
        });

        it('should call callbacks after set mod', function(done) {
            BEM.decl('block', {
                onSetMod : {
                   'mod1' : {
                       'val1' : function() {
                           this.hasMod('mod1', 'val1').should.be.true;
                           done();
                       }
                   }
                }
            });
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' } });
            block.setMod('mod1', 'val1');
        });

        it('shouldn\'t call callbacks if beforeSetMod cancel set mod', function() {
            var spy = sinon.spy();
            BEM.decl('block', {
                beforeSetMod : {
                   'mod1' : {
                       'val1' : function() {
                           return false;
                       }
                   }
                },

                onSetMod : {
                   'mod1' : {
                       'val1' : spy
                   }
                }
            });
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' } });
            block.setMod('mod1', 'val1');
            spy.should.not.have.been.called;
        });
    });

    describe('beforeSetMod/onSetMod for boolean mods', function() {
        it('should call properly matched callbacks for boolean mods by order', function() {
            var order = [],
                spyMod1Val2 = sinon.spy(),
                spyMod2ValFalse = sinon.spy(),
                spyMod2Val2 = sinon.spy();

            BEM.decl('block', {
                beforeSetMod : {
                    'mod1' : {
                        'true' : function(modName, modVal, oldModVal) {
                            modVal.should.be.true;
                            oldModVal.should.be.equal('');
                            order.push(5);
                        }
                    }
                },

                onSetMod : {
                    'mod1' : {
                        'true' : function() {
                            order.push(11);
                        }
                    }
                }
            });

            BEM.decl('block', {
                beforeSetMod : {
                    'mod1' : function() {
                        order.push(3);
                    },

                    '*' : function(modName) {
                        modName === 'mod1' && order.push(1);
                    }
                },

                onSetMod : {
                    'mod1' : function() {
                        order.push(9);
                    },

                    '*' : function(modName) {
                        modName === 'mod1' && order.push(7);
                    }
                }
            });

            BEM.decl('block', {
                beforeSetMod : function(modName) {
                    this.__base.apply(this, arguments);
                    modName === 'mod1' && order.push(2);
                },

                onSetMod : function(modName) {
                    this.__base.apply(this, arguments);
                    modName === 'mod1' && order.push(8);
                }
            });

            BEM.decl('block', {
                beforeSetMod : {
                    'mod1' : {
                        '*' : function(modName, modVal, oldModVal) {
                           this.__base.apply(this, arguments);
                           order.push(4);
                        },

                        'true' : function() {
                            this.__base.apply(this, arguments);
                           order.push(6);

                        },
                        'val2' : function() {
                           spyMod1Val2();
                        }
                    },

                    'mod2' : {
                        '' : function(modName, modVal, oldModVal) {
                            modVal.should.be.equal('');
                            oldModVal.should.be.true;
                            spyMod2ValFalse();
                        },

                       'val2' : function() {
                            spyMod2Val2();
                       }
                   }
                },

                onSetMod : {
                    'mod1' : {
                       '*' : function() {
                           this.__base.apply(this, arguments);
                           order.push(10);
                       },

                       'true' : function() {
                            this.__base.apply(this, arguments);
                           order.push(12);
                       },

                       'val2' : spyMod1Val2
                    },

                    'mod2' : {
                        '' : spyMod2ValFalse,
                        'val2' : spyMod2Val2
                    }
                }
            });

            var block = BEM.create({ block : 'block', mods : { mod1 : false, mod2 : true } });
            block.setMod('mod1', true);

            spyMod1Val2.should.not.have.been.called;
            spyMod2ValFalse.should.not.have.been.called;
            spyMod2Val2.should.not.have.been.called;

            order.should.be.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

            block.setMod('mod2', false);
            spyMod2ValFalse.should.have.been.calledTwice;
        });
    });

    describe('nextTick', function() {
        var block;
        beforeEach(function() {
            BEM.decl('block', {});
            block = BEM.create({ block : 'block', mods : { mod1 : 'val1' } });
        });
        afterEach(function() {
            delete BEM.blocks['block'];
        });

        it('should call callback asynchronously', function(done) {
            var isAsync = false;
            block.nextTick(function() {
                isAsync.should.be.true;
                done();
            });
            isAsync = true;
        });

        it('should call callback with block\'s context', function(done) {
            block.nextTick(function() {
                this.should.be.equal(block);
                done();
            });
        });

        it('should not call callback if block destructed', function(done) {
            var spy = sinon.spy();
            block.nextTick(spy);
            block._destruct();
            setTimeout(function() {
                spy.called.should.be.false;
                done();
            }, 0);
        });
    });

    describe('mod change events', function() {
        var block;
        beforeEach(function() {
            BEM.decl('block', {
                beforeSetMod : {
                    'mod3' : function() {
                        return false;
                    }
                },

                onSetMod : {
                    'js' : {
                        'inited' : function() {
                            this.prop = 'val1';
                        }
                    },

                    'mod1' : {
                        'val2' : function() {
                            this.prop = 'val2';
                        }
                    }
                }
            });
            block = BEM.create({ block : 'block', mods : { mod1 : 'val1', mod2 : true } });
        });
        afterEach(function() {
            delete BEM.blocks['block'];
        });

        it('should emit event on mod change after all onSetMod callbacks', function(done) {
            block.prop.should.be.equal('val1');
            block
                .on(
                    { modName : 'mod1', modVal : 'val2' },
                    function() {
                        this.prop.should.be.equal('val2');
                        done();
                    })
                .setMod('mod1', 'val2');
        });

        it('should emit event on mod change with correct arguments', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                spy3 = sinon.spy();

            block
                .on(
                    { modName : 'mod1', modVal : '*' },
                    function(e) {
                        e.target.getMod('mod1').should.be.equal('val2');
                        spy1.apply(this, arguments);
                    })
                .on({ modName : 'mod1', modVal : 'val2' }, spy2)
                .on({ modName : 'mod1', modVal : 'val3' }, spy3)
                .setMod('mod1', 'val2');

            spy1.should.have.been.called.once;
            spy2.should.have.been.called.once;
            spy3.should.not.have.been.called;

            spy1.args[0][1].should.be.eql({ modName : 'mod1', modVal : 'val2', oldModVal : 'val1' });
        });

        it('should be able to subscribe on deleting mod', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy();

            block
                .on({ modName : 'mod2', modVal : '' }, spy1)
                .on({ modName : 'mod2', modVal : false }, spy2)
                .delMod('mod2');

            spy1.should.have.been.called.once;
            spy2.should.have.been.called.once;

            spy1.args[0][1].should.be.eql({ modName : 'mod2', modVal : '', oldModVal : true });
            spy2.args[0][1].should.be.eql({ modName : 'mod2', modVal : '', oldModVal : true });
        });

        it('should emit live event on mod change with correct arguments', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                spy3 = sinon.spy();

            BEM.blocks['block']
                .on(
                    { modName : 'mod1', modVal : '*' },
                    function(e) {
                        e.target.getMod('mod1').should.be.equal('val2');
                        spy1.apply(this, arguments);
                    })
                .on({ modName : 'mod1', modVal : 'val2' }, spy2)
                .on({ modName : 'mod1', modVal : 'val3' }, spy3);

            block.setMod('mod1', 'val2');

            spy1.should.have.been.called.once;
            spy2.should.have.been.called.once;
            spy3.should.not.have.been.called;

            spy1.args[0][1].should.be.eql({ modName : 'mod1', modVal : 'val2', oldModVal : 'val1' });
        });

        it('should emit events until block destruction', function() {
            var spy1 = sinon.spy();

            block
                .on({ modName : 'mod1', modVal : 'val2' }, spy1)
                .delMod('js')
                .setMod('mod1', 'val2');

            spy1.should.not.have.been.called;
        });

        it('should emit destruct event on block destruction', function() {
            var spy1 = sinon.spy();

            block
                .on({ modName : 'js', modVal : '' }, spy1)
                .delMod('js');

            spy1.should.have.been.called.once;
        });

        it('should not emit event if beforeSetMod prevents mod changing', function() {
            var spy = sinon.spy();

            block
                .on({ modName : 'mod3', modVal : '*' }, spy)
                .setMod('mod3', 'val');

            spy.should.not.have.been.called;
        });

        it('should properly unbind mod event handler', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                spy3 = sinon.spy();

            block
                .on({ modName : 'mod1', modVal : '*' }, spy1)
                .on({ modName : 'mod1', modVal : 'val2' }, spy2)
                .un({ modName : 'mod1', modVal : '*' }, spy1)
                .un({ modName : 'mod1', modVal : 'val2' }, spy2)
                .setMod('mod1', 'val2');

            spy1.should.not.have.been.called;
            spy2.should.not.have.been.called;
        });

        it('should properly unbind live mod event handler', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                spy3 = sinon.spy();

            BEM.blocks['block']
                .on({ modName : 'mod1', modVal : '*' }, spy1)
                .on({ modName : 'mod1', modVal : 'val2' }, spy2)
                .un({ modName : 'mod1', modVal : '*' }, spy1)
                .un({ modName : 'mod1', modVal : 'val2' }, spy2);

            block.setMod('mod1', 'val2');

            spy1.should.not.have.been.called;
            spy2.should.not.have.been.called;
        });
    });
});

provide();

});
