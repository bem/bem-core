/**
 * @module tick
 */

modules.define('tick', ['inherit', 'events'], function(provide, inherit, events) {

var TICK_INTERVAL = 50,
    global = this.global;

provide(new (inherit(events.Emitter, {
    __constructor : function() {
        this._timer = null;
        this._isStarted = false;
    },

    start : function() {
        if(!this._isStarted) {
            this._isStarted = true;
            this._scheduleTick();
        }
    },

    stop : function() {
        if(this._isStarted) {
            this._isStarted = false;
            global.clearTimeout(this._timer);
        }
    },

    _scheduleTick : function() {
        this._timer = global.setTimeout(this._onTick.bind(this), TICK_INTERVAL);
    },

    _onTick : function() {
        this
            .trigger('tick')
            ._scheduleTick();
    }
}))());

});