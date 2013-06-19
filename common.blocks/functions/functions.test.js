modules.define('test', ['functions'], function(provide, functions) {

describe('isFunction', function() {
    it('should returns true only for function', function() {
        functions.isFunction({}).should.be.false;
        functions.isFunction(null).should.be.false;
        functions.isFunction(5).should.be.false;
        functions.isFunction().should.be.false;
        functions.isFunction('').should.be.false;
        functions.isFunction([]).should.be.false;
        functions.isFunction(new function() {}).should.be.false;

        functions.isFunction(function() {}).should.be.true;
    });
});

provide();

});