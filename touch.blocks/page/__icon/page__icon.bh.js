module.exports = function(bh) {
    bh.match('page__icon', function(ctx, json) {
        ctx.content([
            json.src16 && {
                elem : 'link',
                attrs : { rel : 'shortcut icon', href : json.src16 }
            },
            json.src114 && {
                elem : 'link',
                attrs : {
                    rel : 'apple-touch-icon-precomposed',
                    sizes : '114x114',
                    href : json.src114
                }
            },
            json.src72 && {
                elem : 'link',
                attrs : {
                    rel : 'apple-touch-icon-precomposed',
                    sizes : '72x72',
                    href : json.src72
                }
            },
            json.src57 && {
                elem : 'link',
                attrs : { rel : 'apple-touch-icon-precomposed', href : json.src57 }
            }
        ], true);
    });
};
