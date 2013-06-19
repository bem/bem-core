modules.define('test', ['functions__debounce'], function(provide, throttle) {

describe('functions__debounce', function() {
    it('should properly debounce given function', function(done) {
        var res = [],
            debouncedFn = throttle(
                function(arg) {
                    res.push(arg);
                },
                10);

        debouncedFn(1);
        debouncedFn(2);
        debouncedFn(3);
        setTimeout(function() {
            debouncedFn(4);
            debouncedFn(5);
        }, 5);
        setTimeout(function() {
            debouncedFn(6);
            debouncedFn(7);
        }, 45);
        setTimeout(function() {
            res.should.be.eql([5, 7]);
            done();
        }, 80);
    });

    it('should properly debounce given function according "invokeAsap" param', function(done) {
        var res = [],
            debouncedFn = throttle(
                function(arg) {
                    res.push(arg);
                },
                10,
                true);

        debouncedFn(1);
        debouncedFn(2);
        debouncedFn(3);
        setTimeout(function() {
            debouncedFn(4);
            debouncedFn(5);
        }, 5);
        setTimeout(function() {
            debouncedFn(6);
            debouncedFn(7);
        }, 45);
        setTimeout(function() {
            res.should.be.eql([1, 6]);
            done();
        }, 80);
    });

    it('should call debounced function with given "ctx" param', function(done) {
        var ctx = {},
            debouncedFn = throttle(
                function() {
                    this.should.be.eql(ctx);
                    done();
                },
                20,
                ctx);

        debouncedFn();
    });
});

provide();

});