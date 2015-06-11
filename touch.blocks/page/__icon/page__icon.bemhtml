block('page').elem('icon').def()(function() {
    var ctx = this.ctx;
    return applyCtx([
        ctx.src16 && {
            elem : 'link',
            attrs : { rel : 'shortcut icon', href : ctx.src16 }
        },
        ctx.src114 && {
            elem : 'link',
            attrs : {
                rel : 'apple-touch-icon-precomposed',
                sizes : '114x114',
                href : ctx.src114
            }
        },
        ctx.src72 && {
            elem : 'link',
            attrs : {
                rel : 'apple-touch-icon-precomposed',
                sizes : '72x72',
                href : ctx.src72
            }
        },
        ctx.src57 && {
            elem : 'link',
            attrs : { rel : 'apple-touch-icon-precomposed', href : ctx.src57 }
        }
    ]);
});
