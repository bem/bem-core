modules.define('spec', ['loader_type_js', 'sinon'], function(provide, loader, sinon) {

describe('loader_type_js', function() {
    it('should call success callback', function(done) {
        var spyError = sinon.spy();

        loader('data:text/javascript;charset=utf-8,;', function() {
            spyError.should.not.have.been.called;

            done();
        }, spyError);
    });

    it('should call error callback', function(done) {
        var spySuccess = sinon.spy();

        loader('about:error', spySuccess, function() {
            spySuccess.should.not.have.been.called;

            done();
        });
    });
});

provide();

});
