module.exports = function (bh) {
    bh.match('page__js', function (ctx, json) {
        var i18n = bh.lib.i18n;

        json.url = i18n('page', 'js');
    });
};
