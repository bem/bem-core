modules.define('spec', ['i-bem', 'sinon', 'objects'], function(provide, bem, sinon, objects) {

describe('i-bem', function() {
    afterEach(function() {
        objects.each(bem.entities, function(_, entityName) {
            delete bem.entities[entityName];
        });
    });

    describe('decl', function() {
        it('should enable to declare block', function() {
            var Block = bem.declBlock('block', {});

            Block.should.be.equal(bem.entities['block']);
            Block.getEntityName().should.be.equal('block');
            (new Block()).should.be.instanceOf(bem.Block);
        });

        it('should enable to declare element', function() {
            var Elem = bem.declElem('block', 'elem', {});

            Elem.should.be.equal(bem.entities['block__elem']);
            Elem.getEntityName().should.be.equal('block__elem');
            (new Elem()).should.be.instanceOf(bem.Elem);
        });

        it('should enable to inherit block', function() {
            var Block = bem.declBlock('block', {}),
                Block2 = bem.declBlock('block2', Block, {});

            (new Block2()).should.be.instanceOf(Block);
            (new Block2()).should.be.instanceOf(Block2);
        });

        it('should enable to inherit block to itself', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                Block = bem.declBlock('block', {
                    onSetMod : {
                        js : {
                            inited : spy1
                        }
                    }
                }),
                Block2 = bem.declBlock('block', {
                    onSetMod : {
                        js : {
                            inited : spy2
                        }
                    }
                });

            Block.create();

            Block2.should.be.equal(Block);
            spy1.should.not.have.been.called;
            spy2.should.have.been.called;
        });

        it('should enable to inherit block to itself using entity class', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                Block = bem.declBlock('block', {
                    onSetMod : {
                        js : {
                            inited : spy1
                        }
                    }
                }),
                Block2 = bem.declBlock(Block, {
                    onSetMod : {
                        js : {
                            inited : spy2
                        }
                    }
                });

            Block.create();

            Block2.should.be.equal(Block);
            spy1.should.not.have.been.called;
            spy2.should.have.been.called;
        });

        it('should enable to inherit elem to itself', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                Elem = bem.declElem('block', 'elem', {
                    onSetMod : {
                        js : {
                            inited : spy1
                        }
                    }
                }),
                Elem2 = bem.declElem('block', 'elem', {
                    onSetMod : {
                        js : {
                            inited : spy2
                        }
                    }
                });

            Elem.create();

            Elem2.should.be.equal(Elem);
            spy1.should.not.have.been.called;
            spy2.should.have.been.called;
        });

        it('should enable to inherit elem to itself using entity', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                Elem = bem.declElem('block', 'elem', {
                    onSetMod : {
                        js : {
                            inited : spy1
                        }
                    }
                }),
                Elem2 = bem.declElem(Elem, {
                    onSetMod : {
                        js : {
                            inited : spy2
                        }
                    }
                });

            Elem.create();

            Elem2.should.be.equal(Elem);
            spy1.should.not.have.been.called;
            spy2.should.have.been.called;
        });

        it('should enable to mix block', function() {
            var MixBlock = bem.declMixin({}),
                Block = bem.declBlock('block', MixBlock, {}),
                block = Block.create();

            (new Block()).should.be.instanceOf(bem.Block);
        });

        it('should enable to mix blocks', function() {
            var MixBlock1 = bem.declMixin({}),
                MixBlock2 = bem.declMixin({}),
                Block = bem.declBlock('block', [MixBlock1, MixBlock2], {});

            (new Block()).should.be.instanceOf(bem.Block);
        });

        it('should enable to inherit and mix blocks', function() {
            var MixBlock = bem.declMixin({}),
                BaseBlock = bem.declBlock('base-block', {}),
                Block = bem.declBlock('block', [BaseBlock, MixBlock], {});

            (new Block()).should.be.instanceOf(bem.Block);
        });

        it('should enable to declare modifier', function() {
            var Block = bem.declBlock('block', {}),
                Block2 = Block.declMod({ modName : 'm1', modVal : 'v1' }, {});

            Block2.should.be.equal(Block);
        });

        it('should apply method only if block has mod', function() {
            var baseMethodSpy = sinon.spy(),
                modsMethodSpy = sinon.spy(),
                Block = bem
                    .declBlock('block', { method : baseMethodSpy })
                    .declMod({ modName : 'mod1', modVal : 'val1' }, { method : modsMethodSpy }),
                instance = new Block({ mod1 : 'val1' });

            instance.method();

            baseMethodSpy.should.not.have.been.called;
            modsMethodSpy.should.have.been.calledOnce;

            instance.setMod('mod1', 'val2');
            instance.method();

            baseMethodSpy.should.have.been.calledOnce;
            modsMethodSpy.should.have.been.calledOnce;
        });

        it('should apply method only if block has boolean mod', function() {
            var baseMethodSpy = sinon.spy(),
                modsMethodSpy = sinon.spy(),
                Block = bem
                    .declBlock('block', { method : baseMethodSpy })
                    .declMod({ modName : 'mod1', modVal : true }, { method : modsMethodSpy }),
                instance = new Block({ mod1 : true });

            instance.method();

            baseMethodSpy.should.not.have.been.called;
            modsMethodSpy.should.have.been.calledOnce;

            instance.delMod('mod1');
            instance.method();

            baseMethodSpy.should.have.been.calledOnce;
            modsMethodSpy.should.have.been.calledOnce;
        });

        it('should apply method if block has any mod', function() {
            var baseMethodSpy = sinon.spy(),
                modsMethodSpy = sinon.spy(),
                Block = bem
                    .declBlock('block', { method : baseMethodSpy })
                    .declMod({ modName : 'mod1', modVal : '*' }, { method : modsMethodSpy }),
                instance = new Block({ mod1 : 'val1' });

            instance.method();

            baseMethodSpy.should.not.have.been.called;
            modsMethodSpy.should.have.been.calledOnce;

            instance.setMod('mod1', 'val2');
            instance.method();

            baseMethodSpy.should.not.have.been.called;
            modsMethodSpy.should.have.been.calledTwice;

            instance.delMod('mod1');
            instance.method();

            baseMethodSpy.should.have.been.calledOnce;
            modsMethodSpy.should.have.been.calledTwice;
        });
    });

    describe('create', function() {
        it('should return instance of block', function() {
            var Block = bem.declBlock('block', {}),
                instance = Block.create();

            instance.should.be.instanceOf(Block);
        });

        it('should return instance of element with proper block', function() {
            var Block = bem.declBlock('block', {}),
                block = Block.create(),
                Elem = bem.declElem('block', 'elem', {}),
                elem = Elem.create(block);

            elem.should.be.instanceOf(Elem);
            elem._block().should.be.instanceOf(Block);
        });
    });

    describe('mods', function() {
        var block;
        beforeEach(function() {
            block = bem
                .declBlock('block', {})
                .create({ mod1 : 'val1', mod2 : true, mod3 : false });
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
                    .getMod('mod1')
                        .should.be.true;

                block
                    .setMod('mod1', false)
                    .getMod('mod1')
                        .should.be.equal('');

                block
                    .setMod('mod1')
                    .getMod('mod1')
                        .should.be.true;
            });

            it('should cast non-boolean mod value to string', function() {
                block
                    .setMod('mod1', 0)
                    .getMod('mod1').should.be.equal('0');
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

            it('in short form should return false for empty mod\'s value', function() {
                block
                    .setMod('mod1', '')
                    .hasMod('mod1')
                        .should.be.false;
            });

            it('in short form should return false for undefined mod', function() {
                block.hasMod('mod4').should.be.false;
            });

            it('should return true for matching boolean mod\'s value', function() {
                block
                    .setMod('mod1', true)
                    .hasMod('mod1').should.be.true;

                block.hasMod('mod1', true).should.be.true;
            });

            it('should not treat passed but undefined mod value as a short form', function() {
                var modVal;
                block.hasMod('mod1', modVal).should.be.false;
            });

            it('should treat defined non-boolean mod value as a string', function() {
                block
                    .setMod('mod1', 0)
                    .hasMod('mod1', 0)
                        .should.be.true;

                block.hasMod('mod1', '0')
                    .should.be.true;

                block
                    .setMod('mod1', '1')
                    .hasMod('mod1', 1)
                        .should.be.true;
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
        it('should call properly matched callbacks by order', function() {
            var order = [],
                spyMod1Val2 = sinon.spy(),
                spyMod2Val1 = sinon.spy(),
                spyMod2Val2 = sinon.spy();

            bem.declBlock('block', {
                beforeSetMod : {
                    'mod1' : {
                        'val1' : function() {
                            order.push(5);
                        }
                    }
                }
            });

            bem.declBlock('block', {
                beforeSetMod : {
                    'mod1' : function() {
                        order.push(3);
                    },

                    '*' : function(modName) {
                        modName === 'mod1' && order.push(1);
                    }
                }
            });

            bem.declBlock('block', {
                beforeSetMod : function(modName) {
                    this.__base.apply(this, arguments);
                    modName === 'mod1' && order.push(2);
                }
            });

            bem.declBlock('block', {
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

            var block = bem.entities['block'].create({ mod1 : 'val0', mod2 : 'val0' });
            block.setMod('mod1', 'val1');

            order.should.be.eql([1, 2, 3, 4, 5, 6]);
            spyMod1Val2.should.not.have.been.called;
            spyMod2Val1.should.not.have.been.called;
            spyMod2Val2.should.not.have.been.called;
        });

        it('should properly call callbacks for special modifier value `!`-syntax', function() {
            var spyMod1ValStar = sinon.spy(),
                spyMod1NotVal1 = sinon.spy(),
                spyMod1NotVal2 = sinon.spy(),
                Block = bem.declBlock('block', {
                    beforeSetMod : {
                        'mod1' : {
                            '*' : spyMod1ValStar,
                            '!val1' : spyMod1NotVal1,
                            '!val2' : spyMod1NotVal2
                        }
                    }
                }),
                block = Block.create();

            block.setMod('mod1', 'val1');

            spyMod1ValStar.should.have.been.called;
            spyMod1NotVal1.should.not.have.been.called;
            spyMod1NotVal2.should.have.been.called;
        });

        it('should properly call callbacks for special modifier value `~`-syntax', function() {
            var spyMod1ValStar = sinon.spy(),
                spyMod1DelVal1 = sinon.spy(),
                spyMod1DelVal2 = sinon.spy(),
                Block = bem.declBlock('block', {
                    beforeSetMod : {
                        'mod1' : {
                            '*' : spyMod1ValStar,
                            '~val1' : spyMod1DelVal1,
                            '~val2' : spyMod1DelVal2
                        }
                    }
                }),
                block = Block.create();

            block.setMod('mod1', 'val1');

            spyMod1ValStar.should.have.been.called;
            spyMod1DelVal1.should.not.have.been.called;
            spyMod1DelVal2.should.not.have.been.called;

            block.setMod('mod1', 'val2');

            spyMod1ValStar.should.have.been.calledTwice;
            spyMod1DelVal1.should.have.been.called;
            spyMod1DelVal2.should.not.have.been.called;
        });

        it('should call callbacks before set mod', function(done) {
            bem
                .declBlock('block', {
                    beforeSetMod : {
                       'mod1' : {
                           'val1' : function() {
                               this.hasMod('mod1', 'val1').should.be.false;
                               done();
                           }
                       }
                    }
                })
                .create({ mod1 : 'val0' })
                .setMod('mod1', 'val1');
        });

        it('should set mod after callbacks', function() {
             bem
                 .declBlock('block', {
                    beforeSetMod : {
                       'mod1' : {
                           'val1' : function() {}
                       }
                    }
                })
                .create({ mod1 : 'val0' })
                .setMod('mod1', 'val1')
                .hasMod('mod1', 'val1')
                    .should.be.true;
        });

        it('shouldn\'t set mod when callback returns false', function() {
            bem
                .declBlock('block', {
                    beforeSetMod : {
                       'mod1' : {
                           'val1' : function() {
                               return false;
                           }
                       }
                    }
                })
                .create({ mod1 : 'val0' })
                .setMod('mod1', 'val1')
                .hasMod('mod1', 'val1')
                    .should.be.false;
        });

        it('shouldn\'t set mod when callback for special `!`-syntax value returns false', function() {
            var block = bem.declBlock('block', {
                    beforeSetMod : {
                       'mod1' : {
                           '*' : function() {
                               return false;
                           },
                           '!val1' : function() {
                               return false;
                           }
                       },
                       'mod2' : {
                           '*' : function() {
                               return false;
                           },
                           '!val1' : function() {}
                       },
                       'mod3' : {
                           '*' : function() {},
                           '!val1' : function() {
                               return false;
                           }
                       }
                    }
                }).create();

            block.setMod('mod1', 'val2').hasMod('mod1', 'val2')
                .should.be.false;

            block.setMod('mod2', 'val2').hasMod('mod2', 'val2')
                .should.be.false;

            block.setMod('mod3', 'val2').hasMod('mod3', 'val2')
                .should.be.false;

            block.setMod('mod3', 'val1').hasMod('mod3', 'val1')
                .should.be.true;
        });

        it('shouldn\'t set mod when callback for special `~`-syntax value returns false', function() {
            var block = bem.declBlock('block', {
                    beforeSetMod : {
                       'mod1' : {
                           '*' : function() {
                               return false;
                           },
                           '~val1' : function() {
                               return false;
                           }
                       },
                       'mod2' : {
                           '*' : function() {
                               return false;
                           },
                           '~val1' : function() {}
                       },
                       'mod3' : {
                           '*' : function() {},
                           '~val1' : function() {
                               return false;
                           }
                       }
                    }
                }).create({ mod1 : 'val1', mod2 : 'val1', mod3 : 'val1' });

            block.setMod('mod1', 'val2').hasMod('mod1', 'val2')
                .should.be.false;

            block.setMod('mod2', 'val2').hasMod('mod2', 'val2')
                .should.be.false;

            block.setMod('mod3', 'val2').hasMod('mod3', 'val2')
                .should.be.false;
        });
    });

    describe('onSetMod', function() {
        it('should call properly matched callbacks by order', function() {
            var order = [],
                spyMod1Val2 = sinon.spy(),
                spyMod2Val1 = sinon.spy(),
                spyMod2Val2 = sinon.spy();

            bem.declBlock('block', {
                onSetMod : {
                    'mod1' : {
                        'val1' : function() {
                            order.push(5);
                        }
                    }
                }
            });

            bem.declBlock('block', {
                onSetMod : {
                    'mod1' : function() {
                        order.push(3);
                    },

                    '*' : function(modName) {
                        modName === 'mod1' && order.push(1);
                    }
                }
            });

            bem.declBlock('block', {
                onSetMod : function(modName) {
                    this.__base.apply(this, arguments);
                    modName === 'mod1' && order.push(2);
                }
            });

            bem.declBlock('block', {
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

            bem.entities['block']
                .create({ mod1 : 'val0', mod2 : 'val0' })
                .setMod('mod1', 'val1');

            order.should.be.eql([1, 2, 3, 4, 5, 6]);
            spyMod1Val2.should.not.have.been.called;
            spyMod2Val1.should.not.have.been.called;
            spyMod2Val2.should.not.have.been.called;
        });

        it('should properly call callbacks for special modifier value `!`-syntax', function() {
            var spyMod1ValStar = sinon.spy(),
                spyMod1NotVal1 = sinon.spy(),
                spyMod1NotVal2 = sinon.spy(),
                Block = bem.declBlock('block', {
                    onSetMod : {
                        'mod1' : {
                            '*' : spyMod1ValStar,
                            '!val1' : spyMod1NotVal1,
                            '!val2' : spyMod1NotVal2
                        }
                    }
                }),
                block = Block.create();

            block.setMod('mod1', 'val1');

            spyMod1ValStar.should.have.been.called;
            spyMod1NotVal1.should.not.have.been.called;
            spyMod1NotVal2.should.have.been.called;
        });

        it('should properly call callbacks for special modifier value `~`-syntax', function() {
            var spyMod1ValStar = sinon.spy(),
                spyMod1DelVal1 = sinon.spy(),
                spyMod1DelVal2 = sinon.spy(),
                Block = bem.declBlock('block', {
                    onSetMod : {
                        'mod1' : {
                            '*' : spyMod1ValStar,
                            '~val1' : spyMod1DelVal1,
                            '~val2' : spyMod1DelVal2
                        }
                    }
                }),
                block = Block.create();

            block.setMod('mod1', 'val1');

            spyMod1ValStar.should.have.been.called;
            spyMod1DelVal1.should.not.have.been.called;
            spyMod1DelVal2.should.not.have.been.called;

            block.setMod('mod1', 'val2');

            spyMod1ValStar.should.have.been.calledTwice;
            spyMod1DelVal1.should.have.been.called;
            spyMod1DelVal2.should.not.have.been.called;
        });

        it('should call callbacks after set mod', function(done) {
            bem
                .declBlock('block', {
                    onSetMod : {
                       'mod1' : {
                           'val1' : function() {
                               this.hasMod('mod1', 'val1').should.be.true;
                               done();
                           }
                       }
                    }
                })
                .create({ mod1 : 'val0' })
                .setMod('mod1', 'val1');
        });

        it('shouldn\'t call callbacks if beforeSetMod cancel set mod', function() {
            var spy = sinon.spy();
            bem
                .declBlock('block', {
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
                })
                .create({ mod1 : 'val0' })
                .setMod('mod1', 'val1');

            spy.should.not.have.been.called;
        });

        it('should properly call callbacks for declaration with mod', function() {
            var spy1 = sinon.spy(),
                spy2 = sinon.spy(),
                spy3 = sinon.spy(),
                spy4 = sinon.spy(),
                Block = bem.declBlock('block');

            Block.declMod({ modName : 'm1', modVal : 'v1' }, {
                onSetMod : {
                    'm1' : {
                        'v1' : spy1,
                        'v2' : spy2
                    }
                }
            });
            Block.declMod({ modName : 'm1', modVal : 'v2' }, {
                onSetMod : {
                    'm1' : {
                        'v1' : function() {
                            this.__base.apply(this, arguments);
                            spy3.apply(this, arguments);
                        },

                        'v2' : function() {
                            this.__base.apply(this, arguments);
                            spy4.apply(this, arguments);
                        }
                    }
                }
            });

            var block = Block.create();

            block.setMod('m1', 'v1');
            spy1.should.have.been.called;
            spy2.should.not.have.been.called;
            spy3.should.not.have.been.called;
            spy4.should.not.have.been.called;

            block.setMod('m1', 'v2');
            spy1.should.have.been.calledOnce;
            spy2.should.have.been.called;
            spy3.should.not.have.been.called;
            spy4.should.have.been.called;

            block
                .setMod('m1', 'v3')
                .setMod('m1', 'v2');
            spy1.should.have.been.calledOnce;
            spy2.should.have.been.calledOnce;
            spy3.should.not.have.been.called;
            spy4.should.have.been.calledTwice;
        });
    });

    describe('beforeSetMod/onSetMod for boolean mods', function() {
        it('should call properly matched callbacks for boolean mods by order', function() {
            var order = [],
                spyMod1Val2 = sinon.spy(),
                spyMod2ValFalse = sinon.spy(),
                spyMod2Val2 = sinon.spy();

            bem.declBlock('block', {
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

            bem.declBlock('block', {
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

            bem.declBlock('block', {
                beforeSetMod : function(modName) {
                    this.__base.apply(this, arguments);
                    modName === 'mod1' && order.push(2);
                },

                onSetMod : function(modName) {
                    this.__base.apply(this, arguments);
                    modName === 'mod1' && order.push(8);
                }
            });

            bem.declBlock('block', {
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

            var block = bem.entities['block'].create({ mod1 : false, mod2 : true });
            block.setMod('mod1', true);

            spyMod1Val2.should.not.have.been.called;
            spyMod2ValFalse.should.not.have.been.called;
            spyMod2Val2.should.not.have.been.called;

            order.should.be.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

            block.setMod('mod2', false);
            spyMod2ValFalse.should.have.been.calledTwice;
        });
    });

    describe('_nextTick', function() {
        var block;
        beforeEach(function() {
            block = bem
                .declBlock('block', {})
                .create({ mod1 : 'val1' });
        });

        it('should call callback asynchronously', function(done) {
            var isAsync = false;
            block._nextTick(function() {
                isAsync.should.be.true;
                done();
            });
            isAsync = true;
        });

        it('should call callback with block\'s context', function(done) {
            block._nextTick(function() {
                this.should.be.equal(block);
                done();
            });
        });

        it('should not call callback if block destructed', function(done) {
            var spy = sinon.spy();
            block._nextTick(spy);
            block.delMod('js');
            setTimeout(function() {
                spy.called.should.be.false;
                done();
            }, 0);
        });
    });
});

provide();

});
