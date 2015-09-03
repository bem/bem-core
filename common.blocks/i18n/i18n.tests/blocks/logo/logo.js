modules.define('logo', ['i-bem__dom', 'i18n'], function(provide, BEMDOM, i18n) {

provide(BEMDOM.decl(this.name, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                var domElem = this.domElem,
                    params = this.params;

                this.bindTo('click', function () {
                    domElem.text(i18n('logo', 'yandex-service', params.service));
                });
            }
        }
    }
}));

});
