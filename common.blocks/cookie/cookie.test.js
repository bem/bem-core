modules.define('test', ['cookie', 'chai'], function(provide, cookie, chai) {

var expect = chai.expect;

describe('cookie', function() {
    it('should properly returns defined cookie', function() {
        document.cookie = 'name1=val1';
        document.cookie = 'name2=val2';
        cookie('name1').should.be.equal('val1');
        cookie('name2').should.be.equal('val2');
    });

    it('should returns null if get undefined cookie', function() {
        expect(cookie('name3')).to.be.null;
    });

    it('should properly sets cookie', function() {
        cookie('name', 'val');
        cookie('name').should.be.equal('val');
    });
});

provide();

});
