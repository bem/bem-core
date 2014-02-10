module.exports = function(bh) {

    bh.match('page__head', function(ctx, json) {
        ctx.content([
            json['x-ua-compatible'] === false?
                false :
                {
                    tag : 'meta',
                    attrs : {
                        'http-equiv' : 'X-UA-Compatible',
                        content : json['x-ua-compatible'] || 'IE=edge'
                    }
                },
            ctx.content()
        ], true);
    });

};
