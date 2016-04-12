module.exports = function (bh) {
    bh.match('logo', function (ctx) {
        var i18n = bh.lib.i18n;

        ctx.content(i18n('logo', 'yandex'));
    });
};
