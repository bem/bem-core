block('page')(

    def()(function() {
        return applyNext({ _zoom : this.ctx.zoom });
    }),

    elem('head').content()(function() {
        return [
            applyNext(),
            {
                elem : 'meta',
                attrs : {
                    name : 'viewport',
                    content : 'width=device-width,' +
                        (this._zoom?
                            'initial-scale=1' :
                            'maximum-scale=1,initial-scale=1,user-scalable=no')
                }
            },
            { elem : 'meta', attrs : { name : 'format-detection', content : 'telephone=no' } },
            { elem : 'link', attrs : { name : 'apple-mobile-web-app-capable', content : 'yes' } }
        ];
    }),

    mix()(function() {
        var mix = applyNext(),
            uaMix = [{ block : 'ua', attrs : { nonce : this._nonceCsp }, js : true }];

        return mix? uaMix.concat(mix) : uaMix;
    })
);
