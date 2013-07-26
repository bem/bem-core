modules.define('test', ['i-bem', 'sinon'], function(provide, BEM, sinon) {

describe('i-bem', function() {
    describe('decl', function() {
        it('should return block', function() {
            var block = BEM.decl('block', {});
            block.should.be.equal(BEM.blocks['block']);
            delete BEM.blocks['block'];
        });

        it('with mod should apply method only if block has mod', function() {
            var baseMethodSpy = sinon.spy(),
                modsMethodSpy = sinon.spy();

            BEM.decl('block', {
                method : baseMethodSpy
            });
            BEM.decl({ block : 'block', modName : 'mod1', modVal : 'val1' }, {
                method : modsMethodSpy
            });

            var instance = BEM.create({ block : 'block', mods : { 'mod1' : 'val1' }});

            instance.method();
            baseMethodSpy.called.should.be.false;
            modsMethodSpy.called.should.be.true;

            instance.setMod('mod1', 'val2');
            instance.method();
            baseMethodSpy.called.should.be.true;
            modsMethodSpy.callCount.should.be.equal(1);

            delete BEM.blocks['block'];
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
            block = BEM.create({ block : 'block', mods : { mod1 : 'val1' }});
        });
        afterEach(function() {
            delete BEM.blocks['block'];
        });

        describe('getMod', function() {
            it('should return current mod\'s value', function() {
                block.getMod('mod1').should.be.equal('val1');
            });

            it('should return \'\' for undefined mod', function() {
                block.getMod('mod2').should.be.equal('');
            });
        });

        describe('setMod', function() {
            it('should update mod value', function() {
                block
                    .setMod('mod1', 'val2')
                    .getMod('mod1')
                        .should.be.equal('val2');
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

            it('in short form should return true for undefined mod', function() {
                block.hasMod('mod2').should.be.false;
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
                       '*'    : function() {
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

            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0', mod2 : 'val0' }});
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
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' }});
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
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' }});
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
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' }});
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
                       '*'    : function() {
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

            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0', mod2 : 'val0' }});
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
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' }});
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
            var block = BEM.create({ block : 'block', mods : { mod1 : 'val0' }});
            block.setMod('mod1', 'val1');
            spy.should.not.have.been.called;
        });
    });

    describe('nextTick', function() {
        var block;
        beforeEach(function() {
            BEM.decl('block', {});
            block = BEM.create({ block : 'block', mods : { mod1 : 'val1' }});
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
});

provide();

});
