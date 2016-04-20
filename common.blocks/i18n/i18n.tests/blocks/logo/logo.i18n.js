module.exports = {
    'logo' : {
        'yandex-service' : function(serviceName, i18n) {
            return i18n('logo', 'yandex') + '.' + i18n('yandex-service', serviceName);
        }
    }
};
