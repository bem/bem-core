/**
 * @module events__observable
 */

modules.define(
    'events__observable',
    ['inherit'],
    function(provide, inherit) {

/**
 * @class Observable
 */
var Observable = inherit(/** @lends Observable.prototype */{
    /**
     * @constructor
     * @param {Object} emitter
     */
    __constructor : function(emitter) {
        this._emitter = emitter;
    },

    /**
     * Adds an event handler
     * @param {String} e Event type
     * @param {Object} [data] Additional data that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Context
     * @returns {Observable} this
     */
    on : function(e, data, fn, fnCtx) {
        this._emitter.on.apply(this._emitter, arguments);
        return this;
    },

    /**
     * Adds an event handler
     * @param {String} e Event type
     * @param {Object} [data] Additional data that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Context
     * @returns {Observable} this
     */
    once : function(e, data, fn, fnCtx) {
        this._emitter.once.apply(this._emitter, arguments);
        return this;
    },

    /**
     * Removes event handler
     * @param {String} [e] Event type
     * @param {Function} [fn] Handler
     * @param {Object} [fnCtx] Context
     * @returns {Observable} this
     */
    un : function(e, fn, fnCtx) {
        this._emitter.un.apply(this._emitter, arguments);
        return this;
    }
});

provide(
    /**
     * Creates new observable
     * @exports
     * @param {events:Emitter} emitter
     * @returns {Observable}
     */
    function(emitter) {
        return new Observable(emitter);
    }
);

});
