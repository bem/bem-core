block('page').elem('js')(
    bem()(false),
    tag()('script'),
    attrs()(function() {
        var attrs = {};
        if(this.ctx.url) {
            attrs.src = this.ctx.url;
        } else if(this._nonceCsp) {
            attrs.nonce = this._nonceCsp;
        }

        return attrs;
    })
);
