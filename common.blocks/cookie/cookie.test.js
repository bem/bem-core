modules.define('test', ['cookie', 'chai'], function(provide, cookie, chai) {

var expect = chai.expect;

describe('cookie', function() {
    it('should properly returns defined cookie', function() {
        document.cookie = 'name1=val1';
        document.cookie = 'name2=val2';
        cookie.get('name1').should.be.equal('val1');
        cookie.get('name2').should.be.equal('val2');
    });

    it('should returns null if get undefined cookie', function() {
        expect(cookie.get('name3')).to.be.null;
    });

    it('should properly sets cookie', function() {
        cookie.set('name', 'val');
        cookie.get('name').should.be.equal('val');
    });
});

provide();

});
