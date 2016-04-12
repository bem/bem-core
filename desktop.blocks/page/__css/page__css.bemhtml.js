block('page').elem('css').match(function() {
    return this.ctx.hasOwnProperty('ie');
})(
    wrap()(function() {
        var ie = this.ctx.ie,
            hideRule = !ie?
                ['gt IE 9', '<!-->', '<!--'] :
                ie === '!IE'?
                    [ie, '<!-->', '<!--'] :
                    [ie, '', ''];

        return [
            '<!--[if ' + hideRule[0] + ']>' + hideRule[1],
            this.ctx,
            hideRule[2] + '<![endif]-->'
        ];
    }),
    def().match(function() { return this.ctx.ie === true; })(function() {
        var url = this.ctx.url;
        return applyCtx([6, 7, 8, 9].map(function(v) {
            return { elem : 'css', url : url + '.ie' + v + '.css', ie : 'IE ' + v };
        }));
    })
);
