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

    it('should accept several arguments', function() {
        var obj1 = {},
            obj2 = {};
        identify(obj1, obj2).should.be.equal(identify(obj1) + identify(obj2));
    });

    it('should not depend on order of several arguments', function() {
        var obj1 = {},
            obj2 = {};
        identify(obj1, obj2).should.be.equal(identify(obj2, obj1));
    });

    it('should properly process arguments', function() {
        var obj1 = {},
            obj2,
            obj3 = '123',
            obj4 = null,
            obj5 = function() {};

        [obj2, obj3, obj4].forEach(function(obj) {
            identify(obj).should.be.equal('');
        });

        identify(obj1, obj2, obj3, obj4, obj5).should.be.equal(identify(obj1, obj5));
    });
});

provide();

});
