modules.define('spec', ['identify', 'chai'], function(provide, identify, chai) {

var should = chai.should();

describe('identify', function() {
    it('should return different values for different objects', function() {
        var obj1 = {},
            obj2 = {};
        identify(obj1).should.not.be.equal(identify(obj2));
    });

    it('should return same values for same objects', function() {
        var obj1 = {},
            obj2 = {};
        identify(obj1).should.be.equal(identify(obj1));
        identify(obj2).should.be.equal(identify(obj2));
    });

    it('should use "uniqueID" property if exists', function() {
        var obj = { uniqueID : 'id007' };
        identify(obj).should.be.equal('id007');
    });

    it('should not return value if not been assigned before if "onlyGet" param passed', function() {
        should.not.exist(identify({}, true));
    });

    it('should return value if been assigned before if "onlyGet" param passed', function() {
        var obj = {},
            id = identify(obj);
        should.exist(identify(obj, true));
        identify(obj, true).should.be.equal(id);
    });

    it('should generate unique values for each calls if no params passed', function() {
        var id1 = identify(),
            id2 = identify(),
            id3 = identify();

        should.exist(id1);
        should.exist(id2);
        should.exist(id3);

        id1.should.not.be.equal(id2);
        id1.should.not.be.equal(id3);
        id2.should.not.be.equal(id3);
    });
});

provide();

});
