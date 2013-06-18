modules.define('test', ['objects'], function(provide, objects) {

describe('isEmpty', function() {
    it('should returns true for object with no properties', function() {
        objects.isEmpty({}).should.be.true;
    });

    it('should returns false for object with properties', function() {
        objects.isEmpty({ prop : '' }).should.be.false;
    });

    it('should properly checks object with "hasOwnProperty" property', function() {
        objects.isEmpty({ hasOwnProperty : true }).should.be.false;
    });
});

provide();

});