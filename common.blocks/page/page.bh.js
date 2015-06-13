module.exports = function(bh) {

    bh.match('page', function(ctx, json) {
        ctx
            .tag('body')
            .tParam('nonceCsp', json.nonce)
            .content([
                ctx.content(),
                json.scripts
            ], true);

        return [
            json.doctype || '<!DOCTYPE html>',
            {
                tag : 'html',
                cls : 'ua_js_no',
                content : [
                    {
                        elem : 'head',
                        content : [
                            { tag : 'meta', attrs : { charset : 'utf-8' } },
                            json.uaCompatible === false? '' : {
                                tag : 'meta',
                                attrs : {
                                    'http-equiv' : 'X-UA-Compatible',
                                    content : json.uaCompatible || 'IE=edge'
                                }
                            },
                            { tag : 'title', content : json.title },
                            { block : 'ua',  attrs : { nonce : json.nonce } },
                            json.head,
                            json.styles,
                            json.favicon? { elem : 'favicon', url : json.favicon } : '',
                        ]
                    },
                    json
                ]
            }
        ];
    });

    bh.match('page__head', function(ctx) {
        ctx.bem(false).tag('head');
    });

    bh.match('page__meta', function(ctx) {
        ctx.bem(false).tag('meta');
    });

    bh.match('page__link', function(ctx) {
        ctx.bem(false).tag('link');
    });

    bh.match('page__favicon', function(ctx, json) {
        ctx
            .bem(false)
            .tag('link')
            .attr('rel', 'shortcut icon')
            .attr('href', json.url);
    });

};
