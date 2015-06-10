/**
 * @module i-bem-dom__events
 */
modules.define(
    'i-bem-dom__events',
    [
        'i-bem__internal',
        'inherit',
        'identify',
        'objects',
        'jquery',
        'functions'
    ],
    function(
        provide,
        BEMINTERNAL,
        inherit,
        identify,
        objects,
        $,
        functions) {

var undef,
    winNode = window,
    docNode = document,
    winId = identify(winNode),
    docId = identify(docNode),
    eventStorage = {},

    /**
     * @class EventManager
     */
    EventManager = inherit(/** @lends EventManager.prototype */{
        /**
         * @constructor
         * @param {Object} params EventManager parameters
         * @param {Function} fnWrapper Wrapper function to build event handler
         * @param {Function} eventNameBuilder Function to build event name
         */
        __constructor : function(params, fnWrapper, eventNameBuilder) {
            this._params = params;
            this._fnWrapper = fnWrapper;
            this._eventNameBuilder = eventNameBuilder;
            this._storage = {};
        },

        /**
         * Adds an event handler
         * @param {String|Object|events:Event} e Event type
         * @param {Object} [data] Additional data that the handler gets as e.data
         * @param {Function} fn Handler
         * @returns {EventManager} this
         */
        on : function(e, data, fn, _fnCtx, _isOnce) {
            var params = this._params;

            e = this._eventNameBuilder(e, params);

            if(functions.isFunction(data)) {
                _isOnce = _fnCtx;
                _fnCtx = fn;
                fn = data;
                data = undef;
            }

            var fnStorage = this._storage[e] || (this._storage[e] = {}),
                fnId = identify(fn, _fnCtx);

            fnStorage[fnId] || params.bindDomElem[_isOnce? 'one' : 'on'](
                e,
                params.bindSelector,
                data,
                fnStorage[fnId] = params.bindEntityCls?
                    this._fnWrapper(fn, _fnCtx, fnId) :
                    fn);

            return this;
        },

        /**
         * Adds an event handler
         * @param {String} e Event type
         * @param {Object} [data] Additional data that the handler gets as e.data
         * @param {Function} fn Handler
         * @returns {EventManager} this
         */
        once : function(e, data, fn, _fnCtx) {
            if(functions.isFunction(data)) {
                _fnCtx = fn;
                fn = data;
                data = undef;
            }

            return this.on(e, data, fn, _fnCtx, true);
        },

        /**
         * Removes event handler or handlers
         * @param {String|Object|events:Event} [e] Event type
         * @param {Function} [fn] Handler
         * @returns {EventManager} this
         */
        un : function(e, fn, _fnCtx) {
            var argsLen = arguments.length;
            if(argsLen) {
                var params = this._params;

                e = this._eventNameBuilder(e, params);

                if(argsLen === 1) {
                    this._unbindByEvent(this._storage[e], e);
                } else {
                    var wrappedFn;
                    if(params.bindEntityCls) {
                        var fnId = identify(fn, _fnCtx),
                            fnStorage = this._storage[e];
                        if(wrappedFn = fnStorage && fnStorage[fnId])
                            delete fnStorage[fnId];
                    }
                    params.bindDomElem.off(e, params.bindSelector, wrappedFn || fn);
                }
            } else {
                objects.each(this._storage, this._unbindByEvent, this);
            }

            return this;
        },

        _unbindByEvent : function(fnStorage, e) {
            var params = this._params;
            fnStorage && objects.each(fnStorage, function(fn) {
                params.bindDomElem.off(e, params.bindSelector, fn);
            });
            this._storage[e] = null;
        }
    }),
    /**
     * @class EventManagerFactory
     * @exports i-bem-dom__events:EventManagerFactory
     */
    EventManagerFactory = inherit(/** @lends EventManagerFactory.prototype */{
        __constructor : function(getEntityCls) {
            this._storageSuffix = identify();
            this._getEntityCls = getEntityCls;
            this._eventManagerCls = EventManager;
        },

        /**
         * Instantiates event manager
         * @param {Function|i-bem-dom:BemDomEntity} ctx BemDomEntity class or instance
         * @param {*} bindCtx context to bind
         * @param {jQuery} bindScope bind scope
         * @returns {EventManager}
         */
        getEventManager : function(ctx, bindCtx, bindScope) {
            var ctxId = identify(ctx),
                ctxStorage = eventStorage[ctxId],
                storageSuffix = this._storageSuffix,
                isBindToInstance = typeof ctx !== 'function';

            if(!ctxStorage) {
                ctxStorage = eventStorage[ctxId] = {};
                if(isBindToInstance) {
                    ctx._events().on({ modName : 'js', modVal : '' }, function() {
                        var storageKey;
                        ctxStorage[storageKey = docId + storageSuffix] && ctxStorage[storageKey].un();
                        ctxStorage[storageKey = winId + storageSuffix] && ctxStorage[storageKey].un();
                        delete ctxStorage[ctxId];
                    });
                }
            }

            var ctxCls, selector = '';
            if(isBindToInstance) {
                ctxCls = ctx.__self;
            } else {
                ctxCls = ctx;
                selector = ctx._buildSelector();
            }

            var params = this._buildEventManagerParams(bindCtx, bindScope, selector, ctxCls),
                storageKey = params.key + storageSuffix;

            return ctxStorage[storageKey] ||
                (ctxStorage[storageKey] = this._createEventManager(ctx, params, isBindToInstance));
        },

        _buildEventManagerParams : function(bindCtx, bindScope, ctxSelector, ctxCls) {
            var res = {
                bindEntityCls : null,
                bindDomElem : bindScope,
                bindSelector : ctxSelector,
                ctxSelector : ctxSelector,
                key : ''
            };

            if(bindCtx) {
                var typeOfCtx = typeof bindCtx;

                if(bindCtx.jquery && bindCtx.length === 1) {
                    if(bindCtx[0] !== winNode && bindCtx[0] !== docNode)
                        throw Error('DOM-events: jQuery-chain can contain only document or window');
                    res.bindDomElem = bindCtx;
                    res.key = identify(bindCtx[0]);
                } else if(bindCtx === winNode || bindCtx === docNode) {
                    res.bindDomElem = $(bindCtx);
                    res.key = identify(bindCtx);
                } else if(typeOfCtx === 'object' && bindCtx.__self) { // bem entity instance
                    res.bindDomElem = bindCtx.domElem;
                    res.key = bindCtx._uniqId;
                    res.bindEntityCls = bindCtx.__self;
                } else if(typeOfCtx === 'string' || typeOfCtx === 'object' || typeOfCtx === 'function') {
                    var blockName, elemName, modName, modVal;
                    if(typeOfCtx === 'string') { // elem name
                        blockName = ctxCls._blockName;
                        elemName = bindCtx;
                    } else if(typeOfCtx === 'object') { // bem entity with optional mod val
                        blockName = bindCtx.block?
                            bindCtx.block.getName() :
                            ctxCls._blockName;
                        elemName = typeof bindCtx.elem === 'function'?
                            bindCtx.elem.getName() :
                            bindCtx.elem;
                        modName = bindCtx.modName;
                        modVal = bindCtx.modVal;
                    } else if(bindCtx.getName() === bindCtx.getEntityName()) { // block class
                        blockName = bindCtx.getName();
                    } else { // elem class
                        blockName = ctxCls._blockName;
                        elemName = bindCtx.getName();
                    }

                    var entityName = BEMINTERNAL.buildClass(blockName, elemName);
                    res.bindEntityCls = this._getEntityCls(entityName);
                    res.bindSelector = '.' + (res.key = entityName + BEMINTERNAL.buildModPostfix(modName, modVal));
                }
            } else {
                res.bindEntityCls = ctxCls;
            }

            return res;
        },

        _createEventManager : function(ctx, params, isInstance) {
            throw new Error('not implemented');
        }
    });

provide({ EventManagerFactory : EventManagerFactory });

});
