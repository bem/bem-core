modules.define('spec', ['inherit'], function(provide, inherit) {

describe('inherit', function() {
    describe('instance', function() {
        it('should be instance of class', function() {
            var Cls = inherit({}),
                instance = new Cls();

            instance.should.be.instanceOf(Cls);
        });

        it('should be instance of all classes in hierarchy', function() {
            var ClsA = inherit({}),
                ClsB = inherit(ClsA, {}),
                ClsC = inherit(ClsB, {}),
                instance = new ClsC();

            instance.should.be.instanceOf(ClsA);
            instance.should.be.instanceOf(ClsB);
            instance.should.be.instanceOf(ClsC);
        });

        it('should be instance of constructor return value', function() {
            var ClsA = inherit({}),
                ClsB = inherit({
                    __constructor : function() {
                        return new ClsA();
                    }
                }),
                instance = new ClsB();

            instance.should.be.instanceOf(ClsA);
            instance.should.not.be.instanceOf(ClsB);
        });

        it('instance should have properties from constructor', function() {
            var Cls = inherit({
                    __constructor : function() {
                        this._p1 = 'v1';
                        this._p2 = 'v2';
                    }
                }),
                instance = new Cls();

            instance._p1.should.be.equal('v1');
            instance._p2.should.be.equal('v2');
        });

        it('"__self" property should be pointed to class', function() {
            var Cls = inherit({}),
                instance = new Cls();

            instance.__self.should.be.equal(Cls);
        });

        it('should override methods of base class', function() {
            var ClsA = inherit({
                    method1 : function() {
                        return 'A1';
                    },
                    method2 : function() {
                        return 'A2';
                    }
                }),
                ClsB = inherit(ClsA, {
                    method1 : function() {
                        return 'B1';
                    }
                }),
                ClsC = inherit(ClsB, {
                    method2 : function() {
                        return 'C2';
                    }
                }),
                instance = new ClsC();

            instance.method1().should.be.equal('B1');
            instance.method2().should.be.equal('C2');
        });

        it('__base should call methods of base class', function() {
            var ClsA = inherit({
                    method1 : function() {
                        return 'A1';
                    },
                    method2 : function() {
                        return 'A2';
                    }
                }),
                ClsB = inherit(ClsA, {
                    method1 : function() {
                        return this.__base() + 'B1';
                    }
                }),
                ClsC = inherit(ClsB, {
                    method1 : function() {
                        return this.__base() + 'C1';
                    },

                    method2 : function() {
                        return this.__base() + 'C2';
                    }
                }),
                instance = new ClsC();

            instance.method1().should.be.equal('A1B1C1');
            instance.method2().should.be.equal('A2C2');
        });
    });

    describe('static', function() {
        it('properties should be assigned', function() {
            var Cls = inherit({}, {
                method : function() {
                    return 'method';
                },

                prop : 'val'
            });

            Cls.method().should.be.equal('method');
            Cls.prop.should.be.equal('val');
        });

        it('properties should override properties of base class', function() {
            var ClsA = inherit({}, {
                    method1 : function() {
                        return 'A1';
                    },
                    method2 : function() {
                        return 'A2';
                    }
                }),
                ClsB = inherit(ClsA, {}, {
                    method1 : function() {
                        return 'B1';
                    }
                }),
                ClsC = inherit(ClsB, {}, {
                    method2 : function() {
                        return 'C2';
                    }
                });

            ClsC.method1().should.be.equal('B1');
            ClsC.method2().should.be.equal('C2');
        });

        it('__base should call methods of base class', function() {
            var ClsA = inherit({}, {
                    method1 : function() {
                        return 'A1';
                    },
                    method2 : function() {
                        return 'A2';
                    }
                }),
                ClsB = inherit(ClsA, {}, {
                    method1 : function() {
                        return this.__base() + 'B1';
                    }
                }),
                ClsC = inherit(ClsB, {}, {
                    method1 : function() {
                        return this.__base() + 'C1';
                    },

                    method2 : function() {
                        return this.__base() + 'C2';
                    }
                });

            ClsC.method1().should.be.equal('A1B1C1');
            ClsC.method2().should.be.equal('A2C2');
        });
    });

    describe('mixin', function() {
        it('properties should be assigned', function() {
            var ClsA = inherit({
                    method : function() {
                        return 'method';
                    }
                }),
                Mix1 = inherit({
                    method1 : function() {
                        return 'mix1method';
                    }
                }),
                Mix2 = inherit({
                    method2 : function() {
                        return 'mix2method';
                    }
                }),
                ClsB = inherit([ClsA, Mix1, Mix2]),
                instance = new ClsB();

            instance.method().should.be.equal('method');
            instance.method1().should.be.equal('mix1method');
            instance.method2().should.be.equal('mix2method');
        });

        it('static properties should be assigned', function() {
            var ClsA = inherit({}, {
                    method : function() {
                        return 'method';
                    }
                }),
                Mix1 = inherit({}, {
                    method1 : function() {
                        return 'mix1method';
                    }
                }),
                Mix2 = inherit({}, {
                    method2 : function() {
                        return 'mix2method';
                    }
                }),
                ClsB = inherit([ClsA, Mix1, Mix2]);

            ClsB.method().should.be.equal('method');
            ClsB.method1().should.be.equal('mix1method');
            ClsB.method2().should.be.equal('mix2method');
        });

        it('__base should call methods of previous object', function() {
            var ClsA = inherit({
                    method : function() {
                        return 'methodA';
                    }
                }),
                Mix1 = inherit({
                    method : function() {
                        return this.__base() + '_mix1method';
                    }
                }),
                Mix2 = inherit({
                    method : function() {
                        return this.__base() + '_mix2method';
                    }
                }),
                ClsB = inherit([ClsA, Mix1, Mix2], {
                    method : function() {
                        return this.__base() + '_methodB';
                    }
                }),
                instance = new ClsB();

            instance.method().should.be.equal('methodA_mix1method_mix2method_methodB');
        });

        it('__base in static methods should call methods of previous object', function() {
            var ClsA = inherit(null, {
                    method : function() {
                        return 'methodA';
                    }
                }),
                Mix1 = inherit(null, {
                    method : function() {
                        return this.__base() + '_mix1method';
                    }
                }),
                Mix2 = inherit(null, {
                    method : function() {
                        return this.__base() + '_mix2method';
                    }
                }),
                ClsB = inherit([ClsA, Mix1, Mix2], null, {
                    method : function() {
                        return this.__base() + '_methodB';
                    }
                });

            ClsB.method().should.be.equal('methodA_mix1method_mix2method_methodB');
        });
    });
});

provide();

});
