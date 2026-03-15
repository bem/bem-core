/**
 * @module i-bem-dom__events
 */
import bemInternal from 'bem:i-bem__internal'
import BemDomCollection from 'bem:i-bem-dom__collection'
import inherit from 'bem:inherit'
import identify from 'bem:identify'
import $ from 'bem:jquery'
import functions from 'bem:functions'

const winNode = window
const docNode = document
const eventStorage = new Map()

/**
 * @class EventManager
 */
const EventManager = inherit(/** @lends EventManager.prototype */{
    /**
     * @constructor
     * @param {Object} params EventManager parameters
     * @param {Function} fnWrapper Wrapper function to build event handler
     * @param {Function} eventBuilder Function to build event
     */
    __constructor(params, fnWrapper, eventBuilder) {
        this._params = params
        this._fnWrapper = fnWrapper
        this._eventBuilder = eventBuilder
        this._storage = new Map()
    },

    /**
     * Adds an event handler
     * @param {String|Object|events:Event} e Event type
     * @param {*} [data] Additional data that the handler gets as e.data
     * @param {Function} fn Handler
     * @returns {EventManager} this
     */
    on(e, data, fn, _fnCtx, _isOnce) {
        const params = this._params
        const event = this._eventBuilder(e, params)

        if(functions.isFunction(data)) {
            _isOnce = _fnCtx
            _fnCtx = fn
            fn = data
            data = undefined
        }

        const events = typeof event === 'string' ? event.split(/\s+/) : [event]
        events.forEach(singleEvent => {
            this._bindSingle(singleEvent, e, data, fn, _fnCtx, _isOnce, params)
        })

        return this
    },

    _bindSingle(event, origEvent, data, fn, _fnCtx, _isOnce, params) {
        let fnStorage = this._storage.get(event)
        if(!fnStorage) {
            fnStorage = new Map()
            this._storage.set(event, fnStorage)
        }
        const fnId = identify(fn, _fnCtx)

        if(!fnStorage.get(fnId)) {
            const bindDomElem = params.bindDomElem
            const bindSelector = params.bindSelector
            const _this = this
            const handler = this._fnWrapper(
                _isOnce?
                    function() {
                        _this.un(origEvent, fn, _fnCtx)
                        fn.apply(this, arguments)
                    } :
                    fn,
                _fnCtx,
                fnId)
            fnStorage.set(fnId, handler)

            bindDomElem.on(event, bindSelector, data, handler)
            bindSelector && bindDomElem.is(bindSelector) && bindDomElem.on(event, data, handler)
            // FIXME: "once" won't properly work in case of nested and mixed elem with the same name
        }
    },

    /**
     * Adds an event handler
     * @param {String} e Event type
     * @param {*} [data] Additional data that the handler gets as e.data
     * @param {Function} fn Handler
     * @returns {EventManager} this
     */
    once(e, data, fn, _fnCtx) {
        if(functions.isFunction(data)) {
            _fnCtx = fn
            fn = data
            data = undefined
        }

        return this.on(e, data, fn, _fnCtx, true)
    },

    /**
     * Removes event handler or handlers
     * @param {String|Object|events:Event} [e] Event type
     * @param {Function} [fn] Handler
     * @returns {EventManager} this
     */
    un(e, fn, _fnCtx) {
        const argsLen = arguments.length
        if(argsLen) {
            const params = this._params
            const event = this._eventBuilder(e, params)
            const events = typeof event === 'string' ? event.split(/\s+/) : [event]

            events.forEach(singleEvent => {
                if(argsLen === 1) {
                    this._unbindByEvent(this._storage.get(singleEvent), singleEvent)
                } else {
                    const fnId = identify(fn, _fnCtx)
                    const fnStorage = this._storage.get(singleEvent)
                    const bindDomElem = params.bindDomElem
                    const bindSelector = params.bindSelector

                    let wrappedFn
                    if(wrappedFn = fnStorage && fnStorage.get(fnId))
                        fnStorage.delete(fnId)

                    const handler = wrappedFn || fn

                    bindDomElem.off(singleEvent, params.bindSelector, handler)
                    bindSelector && bindDomElem.is(bindSelector) && bindDomElem.off(singleEvent, handler)
                }
            })
        } else {
            this._storage.forEach((fnStorage, e) => this._unbindByEvent(fnStorage, e))
        }

        return this
    },

    _unbindByEvent(fnStorage, e) {
        const params = this._params
        const bindDomElem = params.bindDomElem
        const bindSelector = params.bindSelector
        const unbindWithoutSelector = bindSelector && bindDomElem.is(bindSelector)

        fnStorage && fnStorage.forEach((fn) => {
            bindDomElem.off(e, bindSelector, fn)
            unbindWithoutSelector && bindDomElem.off(e, fn)
        })
        this._storage.set(e, null)
    }
})

const buildForEachEventManagerProxyFn = (methodName) => {
    return function() {
        const args = arguments

        this._eventManagers.forEach((eventManager) => {
            eventManager[methodName].apply(eventManager, args)
        })

        return this
    }
}

/**
 * @class CollectionEventManager
 */
const CollectionEventManager = inherit(/** @lends CollectionEventManager.prototype */{
    /**
     * @constructor
     * @param {Array} eventManagers Array of event managers
     */
    __constructor(eventManagers) {
        this._eventManagers = eventManagers
    },

    /**
     * Adds an event handler
     * @param {String|Object|events:Event} e Event type
     * @param {Object} [data] Additional data that the handler gets as e.data
     * @param {Function} fn Handler
     * @returns {CollectionEventManager} this
     */
    on : buildForEachEventManagerProxyFn('on'),

    /**
     * Adds an event handler
     * @param {String} e Event type
     * @param {Object} [data] Additional data that the handler gets as e.data
     * @param {Function} fn Handler
     * @returns {CollectionEventManager} this
     */
    once : buildForEachEventManagerProxyFn('once'),

    /**
     * Removes event handler or handlers
     * @param {String|Object|events:Event} [e] Event type
     * @param {Function} [fn] Handler
     * @returns {CollectionEventManager} this
     */
    un : buildForEachEventManagerProxyFn('un')
})

/**
 * @class EventManagerFactory
 * @exports i-bem-dom__events:EventManagerFactory
 */
const EventManagerFactory = inherit(/** @lends EventManagerFactory.prototype */{
    __constructor(getEntityCls) {
        this._storageSuffix = identify()
        this._getEntityCls = getEntityCls
        this._eventManagerCls = EventManager
    },

    /**
     * Instantiates event manager
     * @param {Function|i-bem-dom:BemDomEntity} ctx BemDomEntity class or instance
     * @param {*} bindCtx context to bind
     * @param {jQuery} bindScope bind scope
     * @returns {EventManager}
     */
    getEventManager(ctx, bindCtx, bindScope) {
        if(bindCtx instanceof BemDomCollection) {
            return new CollectionEventManager(bindCtx.map((entity) => {
                return this.getEventManager(ctx, entity, bindScope)
            }, this))
        }

        const ctxId = identify(ctx)
        let ctxStorage = eventStorage.get(ctxId)
        const storageSuffix = this._storageSuffix
        const isBindToInstance = typeof ctx !== 'function'
        let ctxCls
        let selector = ''

        if(isBindToInstance) {
            ctxCls = ctx.__self
        } else {
            ctxCls = ctx
            selector = ctx._buildSelector()
        }

        const params = this._buildEventManagerParams(bindCtx, bindScope, selector, ctxCls)
        const storageKey = params.key + storageSuffix

        if(!ctxStorage) {
            ctxStorage = {}
            eventStorage.set(ctxId, ctxStorage)
            if(isBindToInstance) {
                ctx._events().on({ modName : 'js', modVal : '' }, () => {
                    params.bindToArbitraryDomElem && ctxStorage[storageKey] &&
                        ctxStorage[storageKey].un()
                    eventStorage.delete(ctxId)
                })
            }
        }

        return ctxStorage[storageKey] ||
            (ctxStorage[storageKey] = this._createEventManager(ctx, params, isBindToInstance))
    },

    _buildEventManagerParams(bindCtx, bindScope, ctxSelector, ctxCls) {
        const res = {
            bindEntityCls : null,
            bindDomElem : bindScope,
            bindToArbitraryDomElem : false,
            bindSelector : ctxSelector,
            ctxSelector : ctxSelector,
            key : ''
        }

        if(bindCtx) {
            const typeOfCtx = typeof bindCtx

            if(bindCtx.jquery) {
                res.bindDomElem = bindCtx
                res.key = identify.apply(null, bindCtx.get())
                res.bindToArbitraryDomElem = true
            } else if(bindCtx === winNode || bindCtx === docNode || (typeOfCtx === 'object' && bindCtx.nodeType === 1)) { // NOTE: duck-typing check for "is-DOM-element"
                res.bindDomElem = $(bindCtx)
                res.key = identify(bindCtx)
                res.bindToArbitraryDomElem = true
            } else if(typeOfCtx === 'object' && bindCtx.__self) { // bem entity instance
                res.bindDomElem = bindCtx.domElem
                res.key = bindCtx._uniqId
                res.bindEntityCls = bindCtx.__self
            } else if(typeOfCtx === 'string' || typeOfCtx === 'object' || typeOfCtx === 'function') {
                let blockName, elemName, modName, modVal
                if(typeOfCtx === 'string') { // elem name
                    blockName = ctxCls._blockName
                    elemName = bindCtx
                } else if(typeOfCtx === 'object') { // bem entity with optional mod val
                    blockName = bindCtx.block?
                        bindCtx.block.getName() :
                        ctxCls._blockName
                    elemName = typeof bindCtx.elem === 'function'?
                        bindCtx.elem.getName() :
                        bindCtx.elem
                    modName = bindCtx.modName
                    modVal = bindCtx.modVal
                } else if(bindCtx.getName() === bindCtx.getEntityName()) { // block class
                    blockName = bindCtx.getName()
                } else { // elem class
                    blockName = ctxCls._blockName
                    elemName = bindCtx.getName()
                }

                const entityName = bemInternal.buildClassName(blockName, elemName)
                res.bindEntityCls = this._getEntityCls(entityName)
                res.bindSelector = '.' + (res.key = entityName + bemInternal.buildModPostfix(modName, modVal))
            }
        } else {
            res.bindEntityCls = ctxCls
        }

        return res
    },

    _createEventManager(ctx, params, isInstance) {
        throw new Error('not implemented')
    }
})

export default { EventManagerFactory }
