block('page').elem('css')(
    bem()(false),
    tag()('style'),
    match(function() { return this.ctx.url; })(
        tag()('link'),
        attrs()(function() {
            return this.extend(applyNext() || {}, { rel : 'stylesheet', href : this.ctx.url });
        })
    )
);
