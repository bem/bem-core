block('page')(

    def().match(function() { return !this._pageInit;})(function() {
        var ctx = this.ctx;
        this._nonceCsp = ctx.nonce;

        // TODO(indunty): remove local after bem/bem-xjst#50
        return local({ _pageInit : true })(function() {
            return applyCtx([
                ctx.doctype || '<!DOCTYPE html>',
                {
                    tag : 'html',
                    cls : 'ua_js_no',
                    content : [
                        {
                            elem : 'head',
                            content : [
                                { tag : 'meta', attrs : { charset : 'utf-8' } },
                                ctx.uaCompatible === false? '' : {
                                    tag : 'meta',
                                    attrs : {
                                        'http-equiv' : 'X-UA-Compatible',
                                        content : ctx.uaCompatible || 'IE=edge'
                                    }
                                },
                                { tag : 'title', content : ctx.title },
                                { block : 'ua', attrs : { nonce : ctx.nonce } },
                                ctx.head,
                                ctx.styles,
                                ctx.favicon? { elem : 'favicon', url : ctx.favicon } : ''
                            ]
                        },
                        ctx
                    ]
                }
            ]);
        });
    }),

    tag()('body'),

    content()(function() {
        return [
            applyNext(),
            this.ctx.scripts
        ];
    }),

    elem('head')(
        bem()(false),
        tag()('head')
    ),

    elem('meta')(
        bem()(false),
        tag()('meta')
    ),

    elem('link')(
        bem()(false),
        tag()('link')
    ),

    elem('favicon')(
        bem()(false),
        tag()('link'),
        attrs()(function() { return { rel : 'shortcut icon', href : this.ctx.url }; })
    )

);
