modules.define('spec', ['sinon'], function(provide, sinon) {

describe('ecma__array', function() {
    describe('indexOf', function() {
        [
            { data : [1, 2, 3], args : [1], res : 0 },
            { data : [1, 2, 3], args : [4], res : -1 },
            { data : [1, 2, 3, 2], args : [2, 2], res : 3 },
            { data : [1, 2, 3, 2], args : [1, 2], res : -1 },
            { data : [1, 2, 3, 2], args : [2, -1], res : 3 },
            { data : [1, 2, 3, 2], args : [2, -10], res : 1 },
            { data : (function() { var res = [1, , , 2]; res[2] = undefined; return res; })(), args : [undefined], res : 2 }
        ].forEach(function(test) {
            it('should be correct result', function() {
                test.data.indexOf.apply(test.data, test.args).should.to.equal(test.res);
            });
        });
    });

    describe('forEach', function() {
        it('should be callback called on every item', function() {
            var data = [1, 2, 3, 4],
                spy = sinon.spy();

            data[4] = undefined;
            data.forEach(spy);
            spy.callCount.should.to.equal(5);
        });

        it('should be callback\'s arguments valid', function() {
            var data = [1];
            data.forEach(function(item, i, arr) {
                i.should.to.equal(0);
                item.should.to.equal(1);
                arr.should.to.equal(data);
            });
        });

        it('should be callback\'s context valid', function() {
            var ctx = {};
            [1].forEach(function() {
                this.should.to.equal(ctx);
            }, ctx);
            [1].forEach(function() {
                this.should.to.equal(window);
            });
        });
    });

    describe('map', function() {
        it('should be callback called on every item', function() {
            var data = [1, 2, 4, 5],
                spy = sinon.spy();
            data[5] = undefined;

            data.map(spy);
            spy.callCount.should.to.equal(5);
        });

        it('should be result valid', function() {
            [1, 2, 5, 10].map(function(item) {
                return item + 1;
            }).should.to.eql([2, 3, 6, 11]);
        });

        it('should be callback\'s arguments valid', function() {
            var data = [1];
            data.map(function(item, i, arr) {
                item.should.to.equal(1);
                i.should.to.equal(0);
                arr.should.to.equal(data);
            });
        });

        it('should be callback\'s context valid', function() {
            var ctx = {};
            [1].map(function() {
                this.should.to.equal(ctx);
            }, ctx);
            [1].map(function() {
                this.should.to.equal(window);
            });
        });
    });

    describe('filter', function() {
        it('should be callback called on every item', function() {
            var data = [1, 2, 4, 5],
                spy = sinon.spy();
            data[5] = undefined;

            data.filter(spy);
            spy.callCount.should.to.equal(5);
        });

        it('should be result valid', function() {
            [true, false, true].filter(function(item) {
                return item;
            }).should.to.eql([true, true]);
        });

        it('should be callback\'s arguments valid', function() {
            var data = [1];
            data.filter(function(item, i, arr) {
                i.should.to.equal(0);
                item.should.to.equal(1);
                arr.should.to.equal(data);
            });
        });

        it('should be callback\'s context valid', function() {
            var ctx = {};
            [1].filter(function() {
                this.should.to.equal(ctx);
            }, ctx);
            [1].filter(function() {
                this.should.to.equal(window);
            });
        });
    });

    describe('reduce', function() {
        it('should be callback called on every item if no initial value', function() {
            var data = [1, 2, 4, 5],
                spy = sinon.spy();
            data[5] = undefined;

            data.reduce(spy, 1);
            spy.callCount.should.to.equal(5);
        });

        it('shouldn\'t be callback called on every item if initial value', function() {
            var data = [1, 2, 4, 5],
                spy = sinon.spy();
            data[5] = undefined;

            data.reduce(spy);
            spy.callCount.should.to.equal(4);
        });

        var fn = function(acc, item) {
            return acc + item;
        };
        [
            { data : [1, 2, 3], args : [fn], res : 6 },
            { data : [1, 2, 3], args : [fn, 4], res : 10 },
            { data : [], args : [fn, 1], res : 1 },
            { data : (function() { var a = []; a[1] = 1; a[2] = 2; a[3] = 3; return a; })(), args : [fn], res : 6 }
        ].forEach(function(test) {
            it('should be correct result', function() {
                test.data.reduce.apply(test.data, test.args).should.to.equal(test.res);
            });
        });
    });

    describe('isArray', function() {
        it('should array\'s type to be Array', function() {
            Array.isArray([]).should.to.be.ok;
            /* jshint -W009 */
            Array.isArray(new Array()).should.to.be.ok;
        });

        it('shouldn\'t another types to be Array', function() {
            Array.isArray(undefined).should.to.not.be.ok;
            Array.isArray(1).should.to.not.be.ok;
            Array.isArray(true).should.to.not.be.ok;
            Array.isArray({}).should.to.not.be.ok;
            Array.isArray('test').should.to.not.be.ok;
            Array.isArray(null).should.to.not.be.ok;
        });
    });

    describe('some', function() {
        it('should be correct result', function() {
            [1].some(function() { return true; }).should.to.be.ok;
            [1].some(function() { return false; }).should.to.not.be.ok;
        });

        it('shouldn\'t call callback for every item if valid item present', function() {
            var data = [1, 2, 3, 4],
                spy = sinon.spy();
            data[5] = undefined;

            data.some(function() { spy(); return true; });

            spy.callCount.should.to.equal(1);
        });

        it('should call callback for every item if no valid item present', function() {
            var data = [1, 2, 3, 4],
                spy = sinon.spy();
            data[5] = undefined;

            data.some(function() { spy(); return false; });

            spy.callCount.should.to.equal(5);
        });

        it('should return false if there is not elements', function() {
            [].some(function() { return false; }).should.to.not.be.ok;
        });

        it('should be callback\'s arguments valid', function() {
            var data = ['1'],
                spy = sinon.spy();

            data.some(spy);

            spy.calledWith('1', 0, data).should.to.be.true;
        });
    });

    describe('every', function() {
        it('should be correct result', function() {
            [1, 2].every(function() { return true; }).should.to.be.true;
            [1, 2].every(function(item) { return item > 1; }).should.not.to.be.true;
        });

        it('should be callback for every item if all items are valid', function() {
            var data = [1, 2, 3, 4],
                spy = sinon.spy();

            data.every(function(item) {
                spy();
                return item > 0;
            }).should.to.be.true;

            spy.callCount.should.to.equal(4);
        });

        it('should\'t be callback for every item if invalid item present', function() {
            var data = [1, 2, 3, 4],
                spy = sinon.spy();

            data.every(function(item) {
                spy();
                return item < 1;
            }).should.not.to.be.true;

            spy.callCount.should.to.equal(1);
        });

        it('should return true if there is not elements', function() {
            [].every(function() { return true; }).should.to.be.true;
            [].every(function() { return false; }).should.to.be.true;
        });

        it('should be callback\'s arguments valid', function() {
            var data = ['1'],
                spy = sinon.spy();

            data.every(spy);

            spy.calledWith('1', 0, data).should.to.be.true;
        });
    });
});

provide();

});
