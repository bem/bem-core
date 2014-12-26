modules.define('spec', ['querystring__uri'], function(provide, qs) {

describe('querystring__uri', function() {
    describe('decodeURIComponent()', function() {

        it('should be able to decode cp1251 encoded params', function() {
            qs.decodeURIComponent('%F2%E0%E1%EB%EE').should.be.eql('табло');
        });

        it('should not fall on params encoded with unknown encoding', function() {
            qs.decodeURIComponent('%COCO%C0C0').should.be.eql('%COCO%C0C0');
        });

    });

    describe('decodeURI()', function() {

        it('should be able to decode url with cp1251 encoded params', function() {
            qs
                .decodeURI('http://test.com/ololo/trololo.html?text=%F2%E0%E1%EB%EE')
                .should.be.eql('http://test.com/ololo/trololo.html?text=табло');
        });

        it('should not fall on url with params encoded with unknown encoding', function() {
            qs
                .decodeURI('http://test.com/ololo/trololo.html?text=%COCO%C0C0')
                .should.be.eql('http://test.com/ololo/trololo.html?text=%COCO%C0C0');
        });

    });
});

provide();

});
