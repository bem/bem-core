modules.define('spec', ['strings__escape'], function(provide, escape) {

describe('strings__escape', function() {
    it('should properly escape XML', function() {
        escape.xml('<x y="z">a & b</x>')
            .should.be.equal('&lt;x y="z"&gt;a &amp; b&lt;/x&gt;');
    });

    it('should properly escape HTML', function() {
        escape.html('<b class="bold">Bold & bold</b>')
            .should.be.equal('&lt;b class="bold"&gt;Bold &amp; bold&lt;/b&gt;');
    });

    it('should properly escape attributes', function() {
        escape.attr('some <> attr with different "quo" & \'tes\' inside')
            .should.be.equal('some &lt;&gt; attr with different &quot;quo&quot; &amp; &apos;tes&apos; inside');
    });
});

provide();

});
