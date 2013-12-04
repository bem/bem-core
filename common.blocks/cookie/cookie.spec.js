modules.define('spec', ['cookie', 'chai'], function(provide, cookie, chai) {

var expect = chai.expect;

describe('cookie', function() {
    describe('get', function() {
        it('should return value of defined cookie', function() {
            document.cookie = 'name1=val1';
            document.cookie = 'name2=val2';
            cookie.get('name1').should.be.equal('val1');
            cookie.get('name2').should.be.equal('val2');
        });

        it('should return null if cookie is undefined', function() {
            expect(cookie.get('name3')).to.be.null;
        });
    });

    describe('set', function() {
        it('should properly set cookie', function() {
            cookie.set('name', 'val');
            cookie.get('name').should.be.equal('val');
        });

        it('should properly remove cookie', function() {
            cookie.set('name', 'val');
            cookie.set('name', null);
            expect(cookie.get('name')).to.be.null;
        });
    });
});

provide();

});
