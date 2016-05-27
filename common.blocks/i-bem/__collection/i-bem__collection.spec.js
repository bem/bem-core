modules.define(
    'spec',
    ['i-bem', 'i-bem__collection', 'sinon', 'chai'],
    function(provide, bem, BemCollection, sinon, chai) {

var expect = chai.expect;

describe('BEM collections', function() {
    var Block = bem.declBlock('block');

    describe('constructor', function() {
        it('should create collection of unique entities', function() {
            var b1 = Block.create(),
                collection = new BemCollection([b1, b1]);
            collection.size().should.be.equal(1);
            collection.get(0).should.be.equal(b1);
        });

        it('should create collection via arguments', function() {
            var b1 = Block.create(),
                b2 = Block.create(),
                collection = new BemCollection(b1, b2);
            collection.size().should.be.equal(2);
            collection.get(0).should.be.equal(b1);
            collection.get(1).should.be.equal(b2);
        });
    });

    describe('common methods', function() {
        it('get', function() {
            var b1 = Block.create(),
                b2 = Block.create(),
                collection = new BemCollection([b1, b2]);
            collection.get(1).should.be.equal(b2);
        });

        it('has', function() {
            var b1 = Block.create(),
                b2 = Block.create(),
                collection = new BemCollection([b1]);
            collection.has(b1).should.be.true;
            collection.has(b2).should.be.false;
        });

        it('size', function() {
            new BemCollection([]).size().should.be.equal(0);

            var b1 = Block.create(),
                b2 = Block.create();
            new BemCollection([b1, b2]).size().should.be.equal(2);
        });

        it('toArray', function() {
            var b1 = Block.create(),
                b2 = Block.create(),
                collection = new BemCollection([b1, b2]);
            collection.toArray().should.be.eql([b1, b2]);
        });

        describe('forEach', function() {
            it('should call callback for every entity', function() {
                var collection = new BemCollection([Block.create(), Block.create()]),
                    spy = sinon.spy();

                collection.forEach(spy);
                spy.should.be.calledTwice;
            });

            it('should call callback with proper arguments', function() {
                var b1 = Block.create(),
                    collection = new BemCollection([b1]);

                collection.forEach(function(entity, i) {
                    entity.should.be.equal(b1);
                    i.should.be.equal(0);
                });
            });

            it('should call callback with proper context', function() {
                var collection = new BemCollection([Block.create()]),
                    spy = sinon.spy(),
                    ctx = {};

                collection.forEach(spy, ctx);
                spy.should.be.calledOn(ctx);
            });
        });

        describe('map', function() {
            it('should call callback for every entity', function() {
                var collection = new BemCollection([Block.create(), Block.create()]),
                    spy = sinon.spy();

                collection.map(spy);
                spy.should.be.calledTwice;
            });

            it('should call callback with proper arguments', function() {
                var b1 = Block.create(),
                    collection = new BemCollection([b1]);

                collection.map(function(entity, i) {
                    entity.should.be.equal(b1);
                    i.should.be.equal(0);
                });
            });

            it('should call callback with proper context', function() {
                var collection = new BemCollection([Block.create()]),
                    spy = sinon.spy(),
                    ctx = {};

                collection.map(spy, ctx);
                spy.should.be.calledOn(ctx);
            });

            it('should return proper result', function() {
                var b1 = Block.create({ m : 'v1' }),
                    b2 = Block.create({ m : 'v2' }),
                    collection = new BemCollection([b1, b2]);

                collection.map(function(entity) {
                    return entity.getMod('m');
                }).should.be.eql(['v1', 'v2']);
            });
        });

        describe('reduce', function() {
            it('should call callback for every entity if no initial passed', function() {
                var collection = new BemCollection([Block.create(), Block.create()]),
                    spy = sinon.spy();

                collection.reduce(spy);
                spy.should.be.calledOnce;
            });

            it('should call callback for every entity and initial value if it is passed', function() {
                var collection = new BemCollection([Block.create(), Block.create()]),
                    spy = sinon.spy();

                collection.reduce(spy, Block.create());
                spy.should.be.calledTwice;
            });

            it('should call callback with proper arguments', function() {
                var b1 = Block.create({ m : 'v1' }),
                    collection = new BemCollection([b1]);

                collection.reduce(function(res, entity) {
                    res.should.be.equal('');
                    entity.should.be.equal(b1);
                }, '');
            });

            it('should return proper result', function() {
                var b1 = Block.create({ m : 'v1' }),
                    b2 = Block.create({ m : 'v2' }),
                    collection = new BemCollection([b1, b2]);

                collection.reduce(function(res, entity) {
                    return res + entity.getMod('m');
                }, '').should.be.equal('v1v2');
            });
        });

        describe('reduceRight', function() {
            it('should call callback for every entity if no initial passed', function() {
                var collection = new BemCollection([Block.create(), Block.create()]),
                    spy = sinon.spy();

                collection.reduceRight(spy);
                spy.should.be.calledOnce;
            });

            it('should call callback for every entity and initial value if it is passed', function() {
                var collection = new BemCollection([Block.create(), Block.create()]),
                    spy = sinon.spy();

                collection.reduceRight(spy, Block.create());
                spy.should.be.calledTwice;
            });

            it('should call callback with proper arguments', function() {
                var b1 = Block.create({ m : 'v1' }),
                    collection = new BemCollection([b1]);

                collection.reduceRight(function(res, entity) {
                    res.should.be.equal('');
                    entity.should.be.equal(b1);
                }, '');
            });

            it('should return proper result', function() {
                var b1 = Block.create({ m : 'v1' }),
                    b2 = Block.create({ m : 'v2' }),
                    collection = new BemCollection([b1, b2]);

                collection.reduceRight(function(res, entity) {
                    return res + entity.getMod('m');
                }, '').should.be.equal('v2v1');
            });
        });

        describe('concat', function() {
            it('should return proper value', function() {
                var b1 = Block.create(),
                    b2 = Block.create(),
                    b3 = Block.create(),
                    b4 = Block.create(),
                    collection = new BemCollection([b1]).concat(b2, new BemCollection([b3]), [b4]);

                collection.get(0).should.be.equal(b1);
                collection.get(1).should.be.equal(b2);
                collection.get(2).should.be.equal(b3);
                collection.get(3).should.be.equal(b4);
            });
        });

        describe('filter', function() {
            it('should call callback for every entity', function() {
                var collection = new BemCollection([Block.create(), Block.create()]),
                    spy = sinon.spy();

                collection.filter(spy);
                spy.should.be.calledTwice;
            });

            it('should call callback with proper arguments', function() {
                var b1 = Block.create(),
                    collection = new BemCollection([b1]);

                collection.filter(function(entity, i) {
                    entity.should.be.equal(b1);
                    i.should.be.equal(0);
                });
            });

            it('should call callback with proper context', function() {
                var collection = new BemCollection([Block.create()]),
                    spy = sinon.spy(),
                    ctx = {};

                collection.filter(spy, ctx);
                spy.should.be.calledOn(ctx);
            });

            it('should return proper result', function() {
                var b1 = Block.create(),
                    b2 = Block.create({ m : 'v1' }),
                    b3 = Block.create(),
                    collection = new BemCollection([b1, b2, b3]),
                    res;

                res = collection.filter(function(entity) {
                    return entity.hasMod('m');
                });

                res.get(0).should.be.equal(b2);
            });
        });

        describe('some', function() {
            it('should return proper result', function() {
                var collection = new BemCollection([Block.create()]);

                collection.some(function() { return true; }).should.be.ok;
                collection.some(function() { return false; }).should.not.be.ok;

                new BemCollection([]).some(function() { return true; }).should.not.be.ok;
            });

            it('should not call callback for every item if valid item present', function() {
                var collection = new BemCollection([
                        Block.create(),
                        Block.create()
                    ]),
                    stub = sinon.stub().returns(true);

                collection.some(stub);
                stub.should.be.calledOnce;
            });

            it('should call callback for every item if no valid item present', function() {
                var collection = new BemCollection([
                        Block.create(),
                        Block.create()
                    ]),
                    stub = sinon.stub().returns(false);

                collection.some(stub);
                stub.should.be.calledTwice;
            });

            it('should call callback with proper arguments', function() {
                var b1 = Block.create(),
                    collection = new BemCollection([b1]);

                collection.some(function(entity, i) {
                    entity.should.be.equal(b1);
                    i.should.be.equal(0);
                });
            });
        });

        describe('every', function() {
            it('should return proper result', function() {
                var collection1 = new BemCollection([Block.create()]);
                collection1.every(function() { return true; }).should.be.ok;
                collection1.every(function() { return false; }).should.not.be.ok;

                var collection2 = new BemCollection([]);
                collection2.every(function() { return true; }).should.be.ok;
                collection2.every(function() { return false; }).should.be.ok;
            });

            it('should call callback for every item if all items valid', function() {
                var collection = new BemCollection([
                        Block.create(),
                        Block.create()
                    ]),
                    stub = sinon.stub().returns(true);

                collection.every(stub);
                stub.should.be.calledTwice;
            });

            it('should not call callback for every item if invalid item present', function() {
                var collection = new BemCollection([
                        Block.create(),
                        Block.create()
                    ]),
                    stub = sinon.stub().returns(true);

                stub.onFirstCall().returns(false);

                collection.every(stub);
                stub.should.be.calledOnce;
            });

            it('should call callback with proper arguments', function() {
                var b1 = Block.create(),
                    collection = new BemCollection([b1]);

                collection.every(function(entity, i) {
                    entity.should.be.equal(b1);
                    i.should.be.equal(0);
                });
            });
        });

        describe('find', function() {
            it('should return proper result', function() {
                var b1 = Block.create(),
                    collection = new BemCollection([b1]);

                collection.find(function() { return true; }).should.be.equal(b1);
                expect(collection.find(function() { return false; })).to.be.null;
            });

            it('should not call callback for every item if valid item present', function() {
                var collection = new BemCollection([
                        Block.create(),
                        Block.create()
                    ]),
                    stub = sinon.stub().returns(true);

                collection.find(stub);
                stub.should.be.calledOnce;
            });

            it('should call callback for every item if no valid item present', function() {
                var collection = new BemCollection([
                        Block.create(),
                        Block.create()
                    ]),
                    stub = sinon.stub().returns(false);

                collection.find(stub);
                stub.should.be.calledTwice;
            });

            it('should call callback with proper arguments', function() {
                var b1 = Block.create(),
                    collection = new BemCollection([b1]);

                collection.find(function(entity, i, thisCollection) {
                    entity.should.be.equal(b1);
                    i.should.be.equal(0);
                    thisCollection.should.be.equal(collection);
                });
            });
        });
    });

    describe('for each entity', function() {
        var entities, collection;

        beforeEach(function() {
            entities = [
                Block.create(),
                Block.create({ m1 : 'v1' }),
                Block.create({ m1 : 'v2' })
            ];
            collection = new BemCollection(entities);
        });

        it('setMod', function() {
            collection.setMod('m1', 'v3');
            entities.every(function(entity) {
                return entity.hasMod('m1', 'v3');
            }).should.be.true;
        });

        it('delMod', function() {
            collection.delMod('m1');
            entities.every(function(entity) {
                return !entity.hasMod('m1');
            }).should.be.true;
        });

        it('toggleMod', function() {
            collection.toggleMod('m1', 'v1', 'v2');
            entities[1].hasMod('m1', 'v2').should.be.true;
            entities[2].hasMod('m1', 'v1').should.be.true;
        });
    });

    describe('*HasMod', function() {
        var collection;

        beforeEach(function() {
            collection = new BemCollection([
                Block.create({ m1 : 'v1' }),
                Block.create({ m1 : 'v1', m2 : 'v2' })
            ]);
        });

        it('everyHasMod', function() {
            collection.everyHasMod('m1', 'v1').should.be.true;
            collection.everyHasMod('m2').should.be.false;
        });

        it('someHasMod', function() {
            collection.someHasMod('m2', 'v2').should.be.true;
            collection.someHasMod('m3').should.be.false;
        });
    });
});

provide();

});
