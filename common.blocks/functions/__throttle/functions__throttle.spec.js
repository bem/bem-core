modules.define('spec', ['functions__throttle'], function(provide, throttle) {

describe('functions__throttle', function() {
    it('should properly throttle given function', function(done) {
        var res = [],
            throttledFn = throttle(
                function(arg) {
                    res.push(arg);
                },
                20);

        throttledFn(1);
        throttledFn(2);
        throttledFn(3);
        setTimeout(function() {
            throttledFn(4);
        }, 10);
        setTimeout(function() {
            throttledFn(5);
            res.should.be.eql([1, 4]);
            done();
        }, 30);
    });

    it('should properly throttle given function according "invokeAsap" param', function(done) {
        var res = [],
            throttledFn = throttle(
                function(arg) {
                    res.push(arg);
                },
                20,
                false);

        throttledFn(1);
        throttledFn(2);
        throttledFn(3);
        setTimeout(function() {
            throttledFn(4);
        }, 10);
        setTimeout(function() {
            throttledFn(5);
            setTimeout(function() {
                res.should.be.eql([4, 5]);
                done();
            }, 30);
        }, 30);
    });

    it('should call throttled function with given "ctx" param', function(done) {
        var ctx = {},
            throttledFn = throttle(
                function() {
                    this.should.be.eql(ctx);
                    done();
                },
                20,
                ctx);

        throttledFn();
    });
});

provide();

});
