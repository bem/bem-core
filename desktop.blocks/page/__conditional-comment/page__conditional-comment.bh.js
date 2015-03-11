module.exports = function(bh) {

    bh.match('page__conditional-comment', function(ctx, json) {
        ctx.tag(false);

        var cond = json.condition
                .replace('<', 'lt')
                .replace('>', 'gt')
                .replace('=', 'e'),
            hasNegation = cond.indexOf('!') > -1,
            includeOthers = json.msieOnly === false,
            hasNegationOrIncludeOthers = hasNegation || includeOthers;

        return [
            '<!--[if ' + cond + ']>',
            includeOthers? '<!' : '',
            hasNegationOrIncludeOthers? '-->' : '',
            json,
            hasNegationOrIncludeOthers? '<!--' : '',
            '<![endif]-->'
        ];
    });

};
