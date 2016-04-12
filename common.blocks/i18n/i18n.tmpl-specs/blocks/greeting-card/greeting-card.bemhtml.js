block('greeting-card').content()(function () {
    var i18n = this.require('i18n');

    return i18n('greeting-card', 'message');
});
