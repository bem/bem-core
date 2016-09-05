block('page').elem('conditional-comment')(
    tag()(false),

    content()(function() {
        var ctx = this.ctx,
            cond = ctx.condition
                .replace('<', 'lt')
                .replace('>', 'gt')
                .replace('=', 'e'),
            hasNegation = cond.indexOf('!') > -1,
            includeOthers = ctx.msieOnly === false,
            hasNegationOrIncludeOthers = hasNegation || includeOthers;

        return [
            { html : '<!--[if ' + cond + ']>' },
            includeOthers? { html : '<!' } : '',
            hasNegationOrIncludeOthers? { html : '-->' } : '',
            applyNext(),
            hasNegationOrIncludeOthers? { html : '<!--' } : '',
            { html : '<![endif]-->' }
        ];
    })
);
