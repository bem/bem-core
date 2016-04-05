module.exports = function(bh) {
    bh.match('page', function(ctx, json) {
        ctx
            .mix({ block : 'ua', js : true })
            .tParam('zoom', json.zoom);
    });

    bh.match('page__head', function(ctx, json) {
        ctx
            .applyBase()
            .content([
                json.content,
                {
                    elem : 'meta',
                    attrs : {
                        name : 'viewport',
                        content : 'width=device-width,' +
                            (ctx.tParam('zoom')?
                                'initial-scale=1' :
                                'maximum-scale=1,initial-scale=1,user-scalable=no')
                    }
                },
                { elem : 'meta', attrs : { name : 'format-detection', content : 'telephone=no' } },
                { elem : 'link', attrs : { name : 'apple-mobile-web-app-capable', content : 'yes' } }
            ], true);
    });

};
