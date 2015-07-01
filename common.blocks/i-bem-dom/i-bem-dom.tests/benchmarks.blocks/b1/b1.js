modules.define('b1', ['i-bem-dom', 'b2'], function(provide, bemDom, B2) {

provide(bemDom.declBlock(this.name, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._events(B2).on('click', this._onEvent);
            }
        }
    },

    _onEvent : function() { }
}));

});
