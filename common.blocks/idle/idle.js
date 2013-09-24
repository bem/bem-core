/**
 * @module idle
 */

modules.define('idle', ['inherit', 'events', 'jquery'], function(provide, inherit, events, $) {

var IDLE_TIMEOUT = 3000,
    USER_EVENTS = 'mousemove keydown click';

provide(new (inherit(events.Emitter, {
    __constructor : function() {
        this._timer = null;
        this._isStarted = false;
        this._isIdle = false;
    },

    start : function() {
        if(!this._isStarted) {
            this._isStarted = true;
            this._startTimer();
            $(document).on(USER_EVENTS, $.proxy(this._onUserAction, this));
        }
    },

    stop : function() {
        if(this._isStarted) {
            this._isStarted = false;
            this._stopTimer();
            $(document).off(USER_EVENTS, this._onUserAction);
        }
    },

    isIdle : function() {
        return this._isIdle;
    },

    _onUserAction : function() {
        if(this._isIdle) {
            this._isIdle = false;
            this.emit('wakeup');
        }

        this._stopTimer();
        this._startTimer();
    },

    _startTimer : function() {
        this._timer = setTimeout(this._onTimeout.bind(this), IDLE_TIMEOUT);
    },

    _stopTimer : function() {
        this._timer && clearTimeout(this._timer);
    },

    _onTimeout : function() {
        this._isIdle = true;
        this.emit('idle');
    }
}))());

});