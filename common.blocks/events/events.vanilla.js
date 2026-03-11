/**
 * @module events
 */

import identify from 'bem:identify'
import inherit from 'bem:inherit'
import functions from 'bem:functions'

const storageExpando = '__' + (+new Date) + 'storage'

/**
 * @class Event
 * @exports events:Event
 */
const Event = inherit(/** @lends Event.prototype */{
    /**
     * @constructor
     * @param {String} type
     * @param {Object} target
     */
    __constructor : function(type, target) {
        /**
         * Type
         * @member {String}
         */
        this.type = type

        /**
         * Target
         * @member {Object}
         */
        this.target = target

        /**
         * Data
         * @member {*}
         */
        this.data = undefined

        this._isDefaultPrevented = false
        this._isPropagationStopped = false
    },

    /**
     * Prevents default action
     */
    preventDefault : function() {
        this._isDefaultPrevented = true
    },

    /**
     * Returns whether is default action prevented
     * @returns {Boolean}
     */
    isDefaultPrevented : function() {
        return this._isDefaultPrevented
    },

    /**
     * Stops propagation
     */
    stopPropagation : function() {
        this._isPropagationStopped = true
    },

    /**
     * Returns whether is propagation stopped
     * @returns {Boolean}
     */
    isPropagationStopped : function() {
        return this._isPropagationStopped
    }
})

/**
 * @class Emitter
 * @exports events:Emitter
 */
const Emitter = inherit(/** @lends Emitter.prototype */{
    /**
     * Adds an event handler
     * @param {String} e Event type
     * @param {Object} [data] Additional data that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [ctx] Handler context
     * @returns {Emitter} this
     */
    on : function(e, data, fn, ctx, _special) {
        if(typeof e === 'string') {
            if(functions.isFunction(data)) {
                ctx = fn
                fn = data
                data = undefined
            }

            const id = identify(fn, ctx)
            const storage = this[storageExpando] || (this[storageExpando] = {})
            const eventTypes = e.split(' ')

            for(const eventType of eventTypes) {
                const eventStorage = storage[eventType] || (storage[eventType] = { ids : new Map(), list : {} })
                if(!eventStorage.ids.has(id)) {
                    const list = eventStorage.list
                    const item = { fn, data, ctx, special : _special }
                    if(list.last) {
                        list.last.next = item
                        item.prev = list.last
                    } else {
                        list.first = item
                    }
                    eventStorage.ids.set(id, item)
                    list.last = item
                }
            }
        } else {
            for(const [key, val] of Object.entries(e)) {
                this.on(key, val, data, _special)
            }
        }

        return this
    },

    /**
     * Adds a one time handler for the event.
     * Handler is executed only the next time the event is fired, after which it is removed.
     * @param {String} e Event type
     * @param {Object} [data] Additional data that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [ctx] Handler context
     * @returns {Emitter} this
     */
    once : function(e, data, fn, ctx) {
        return this.on(e, data, fn, ctx, { once : true })
    },

    /**
     * Removes event handler or handlers
     * @param {String} [e] Event type
     * @param {Function} [fn] Handler
     * @param {Object} [ctx] Handler context
     * @returns {Emitter} this
     */
    un : function(e, fn, ctx) {
        if(typeof e === 'string' || typeof e === 'undefined') {
            const storage = this[storageExpando]
            if(storage) {
                if(e) { // if event type was passed
                    const eventTypes = e.split(' ')
                    for(const eventType of eventTypes) {
                        const eventStorage = storage[eventType]
                        if(eventStorage) {
                            if(fn) {  // if specific handler was passed
                                const id = identify(fn, ctx)
                                const ids = eventStorage.ids
                                if(ids.has(id)) {
                                    const list = eventStorage.list
                                    const item = ids.get(id)
                                    const prev = item.prev
                                    const next = item.next

                                    if(prev) {
                                        prev.next = next
                                    } else if(item === list.first) {
                                        list.first = next
                                    }

                                    if(next) {
                                        next.prev = prev
                                    } else if(item === list.last) {
                                        list.last = prev
                                    }

                                    ids.delete(id)
                                }
                            } else {
                                delete this[storageExpando][eventType]
                            }
                        }
                    }
                } else {
                    delete this[storageExpando]
                }
            }
        } else {
            for(const [key, val] of Object.entries(e)) {
                this.un(key, val, fn)
            }
        }

        return this
    },

    /**
     * Fires event handlers
     * @param {String|events:Event} e Event
     * @param {Object} [data] Additional data
     * @returns {Emitter} this
     */
    emit : function(e, data) {
        const storage = this[storageExpando]
        let eventInstantiated = false

        if(storage) {
            const eventTypes = [typeof e === 'string'? e : e.type, '*']
            for(const eventType of eventTypes) {
                const eventStorage = storage[eventType]
                if(eventStorage) {
                    let item = eventStorage.list.first
                    const lastItem = eventStorage.list.last
                    while(item) {
                        if(!eventInstantiated) { // instantiate Event only on demand
                            eventInstantiated = true
                            typeof e === 'string' && (e = new Event(e))
                            e.target || (e.target = this)
                        }

                        e.data = item.data
                        const res = item.fn.call(item.ctx || this, e, data)
                        if(res === false) {
                            e.preventDefault()
                            e.stopPropagation()
                        }

                        item.special && item.special.once &&
                            this.un(e.type, item.fn, item.ctx)

                        if(item === lastItem) {
                            break
                        }

                        item = item.next
                    }
                }
            }
        }

        return this
    }
})

export default { Emitter, Event }
