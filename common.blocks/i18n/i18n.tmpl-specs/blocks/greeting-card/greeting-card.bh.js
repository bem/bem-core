module.exports = function (bh) {
    bh.match('greeting-card', function (ctx) {
        var i18n = bh.lib.i18n,
            message = i18n('greeting-card', 'message');

        ctx.content(message);
    });
};
