modules.define('spec', ['chai', 'sinon'], function(provide, chai, sinon) {

var should = chai.should();

describe('ecma__array', function() {
    describe('find', function() {
        it('should return correct result', function() {
            var arr = [1, 2];
            arr.find(function(val) { return val === 2; }).should.be.equal(2);
            should.not.exist(arr.find(function(val) { return val === 7; }));
            should.not.exist([].find(function() { return true; }));
        });

        it('should throw TypeError if predicate is not a function', function() {
            should.throw(function() { [1].find(); }, TypeError);
        });

        it('should call predicate until valid value found', function() {
            var spy = sinon.spy(),
                arr = [1, 2, 3, 4];
            arr[5] = undefined;

            arr.find(function() { spy(); return true; });

            spy.callCount.should.be.equal(1);
        });

        it('should call predicate for every item if no valid value present', function() {
            var spy = sinon.spy(),
                arr = [1, 2, 3, 4];
            arr[5] = undefined;

            arr.find(function() { spy(); return false; });

            spy.callCount.should.be.equal(5);
        });

        it('should call predicate function with proper arguments', function() {
            var spy = sinon.spy(),
                arr = ['1'];

            arr.find(spy);

            spy.calledWith('1', 0, arr).should.be.true;
        });

        it('should call predicate function with proper context', function() {
            var ctx = {};
            [1].find(function() { this.should.be.equal(ctx); }, ctx);
        });
    });
});

provide();

});
