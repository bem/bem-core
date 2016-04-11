modules.define('spec', ['uri'], function(provide, uri) {

describe('uri', function() {
    describe('decodeURIComponent()', function() {
        it('should be able to decode cp1251 encoded params', function() {
            uri.decodeURIComponent('%F2%E0%E1%EB%EE').should.be.eql('табло');
        });

        it('should not fall on params encoded with unknown encoding', function() {
            uri.decodeURIComponent('%COCO%C0C0').should.be.eql('%COCO%C0C0');
        });
    });

    describe('decodeURI()', function() {
        it('should be able to decode url with cp1251 encoded params', function() {
            uri
                .decodeURI('http://test.com/ololo/trololo.html?text=%F2%E0%E1%EB%EE')
                .should.be.eql('http://test.com/ololo/trololo.html?text=табло');
        });

        it('should not fall on url with params encoded with unknown encoding', function() {
            uri
                .decodeURI('http://test.com/ololo/trololo.html?text=%COCO%C0C0')
                .should.be.eql('http://test.com/ololo/trololo.html?text=%COCO%C0C0');
        });
    });
});

provide();

});
