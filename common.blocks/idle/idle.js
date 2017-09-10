/**
 * @module idle
 */

modules.define('idle', ['inherit', 'events'], function(provide, inherit, events) {

var IDLE_TIMEOUT = 3000,
    USER_EVENTS = ['mousemove', 'keydown', 'click'],
    /**
     * @class Idle
     * @augments events:Emitter
     */
    Idle = inherit(events.Emitter, /** @lends Idle.prototype */{
        /**
         * @constructs
         */
        __constructor : function() {
            this._timer = null;
            this._isStarted = false;
            this._isIdle = false;
            this._onUserAction = this._onUserAction.bind(this);
        },

        /**
         * Starts monitoring of idle state
         */
        start : function() {
            if(!this._isStarted) {
                this._isStarted = true;
                this._startTimer();
                USER_EVENTS.forEach(function(event) {
                    document.addEventListener(event, this._onUserAction);
                }, this);
            }
        },

        /**
         * Stops monitoring of idle state
         */
        stop : function() {
            if(this._isStarted) {
                this._isStarted = false;
                this._stopTimer();
                USER_EVENTS.forEach(function(event) {
                    document.removeEventListener(event, this._onUserAction);
                }, this);
            }
        },

        /**
         * Returns whether state is idle
         * @returns {Boolean}
         */
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
            var _this = this;
            this._timer = setTimeout(
                function() {
                    _this._onTimeout();
                },
                IDLE_TIMEOUT);
        },

        _stopTimer : function() {
            this._timer && clearTimeout(this._timer);
        },

        _onTimeout : function() {
            this._isIdle = true;
            this.emit('idle');
        }
    });

provide(
    /**
     * @exports
     * @type Idle
     */
    new Idle());

});
