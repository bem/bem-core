/**
 * @module i-bem-dom
 */

modules.define(
    'i-bem-dom',
    [
        'i-bem',
        'i-bem__internal',
        'inherit',
        'identify',
        'objects',
        'functions',
        'jquery',
        'dom'
    ],
    function(
        provide,
        BEM,
        BEMINTERNAL,
        inherit,
        identify,
        objects,
        functions,
        $,
        dom) {

var undef,
    win = $(window),
    doc = $(document),

    /**
     * Storage for DOM elements by unique key
     * @type Object
     */
    uniqIdToDomElems = {},

    /**
     * Storage for blocks by unique key
     * @type Object
     */
    uniqIdToEntity = {},

    /**
    * Storage for DOM element's parent nodes
    * @type Object
    */
    domNodesToParents = {},

    /**
     * Storage for block parameters
     * @type Object
     */
    domElemToParams = {},

    /**
     * Storage for liveCtx event handlers
     * @type Object
     */
    liveEventCtxStorage = {},

    /**
     * Storage for liveClass event handlers
     * @type Object
     */
    liveClassEventStorage = {},

    entities = BEM.entities,

    BEM_CLASS = 'i-bem',
    BEM_SELECTOR = '.' + BEM_CLASS,
    BEM_PARAMS_ATTR = 'data-bem',

    NAME_PATTERN = BEMINTERNAL.NAME_PATTERN,

    MOD_DELIM = BEMINTERNAL.MOD_DELIM,
    ELEM_DELIM = BEMINTERNAL.ELEM_DELIM,

    EXTRACT_MODS_RE = RegExp(
        '[^' + MOD_DELIM + ']' + MOD_DELIM + '(' + NAME_PATTERN + ')' +
        '(?:' + MOD_DELIM + '(' + NAME_PATTERN + '))?$'),

    buildModPostfix = BEMINTERNAL.buildModPostfix,
    buildClass = BEMINTERNAL.buildClass,

    reverse = Array.prototype.reverse,
    slice = Array.prototype.slice,

    BEMDOM;

/**
 * Initializes entities on a DOM element
 * @param {jQuery} domElem DOM element
 * @param {String} uniqInitId ID of the "initialization wave"
 */
function initEntities(domElem, uniqInitId) {
    var domNode = domElem[0],
        params = getParams(domNode),
        entityName;

    for(entityName in params)
        initEntity(
            entityName,
            domElem,
            processParams(params[entityName], entityName, uniqInitId));
}

/**
 * Initializes a specific entity on a DOM element, or returns the existing entity if it was already created
 * @param {String} entityName Entity name
 * @param {jQuery} domElem DOM element
 * @param {Object} [params] Initialization parameters
 * @param {Boolean} [forceLive=false] Force live initialization
 * @param {Function} [callback] Handler to call after complete initialization
 */
function initEntity(entityName, domElem, params, forceLive, callback) {
    var domNode = domElem[0];

    params || (params = processParams(getEntityParams(domNode, entityName), entityName));

    var uniqId = params.uniqId,
        entity = uniqIdToEntity[uniqId];

    if(entity) {
        if(entity.domElem.index(domNode) < 0) {
            entity.domElem = entity.domElem.add(domElem);
            objects.extend(entity.params, params);
        }

        return entity;
    }

    uniqIdToDomElems[uniqId] = uniqIdToDomElems[uniqId]?
        uniqIdToDomElems[uniqId].add(domElem) :
        domElem;

    var parentDomNode = domNode.parentNode;
    if(!parentDomNode || parentDomNode.nodeType === 11) { // jquery doesn't unique disconnected node
        $.unique(uniqIdToDomElems[uniqId]);
    }

    var entityCls = getEntityCls(entityName);
    if(!(entityCls._liveInitable = !!entityCls._processLive()) || forceLive || params.live === false) {
        forceLive && domElem.addClass(BEM_CLASS); // add css class for preventing memory leaks in further destructing

        entity = new entityCls(uniqIdToDomElems[uniqId], params, !!forceLive);
        delete uniqIdToDomElems[uniqId];
        callback && callback.apply(entity, slice.call(arguments, 4));
        return entity;
    }
}

function getEntityCls(entityName) {
    if(entities[entityName]) return entities[entityName];

    var splitted = entityName.split(ELEM_DELIM);
    return splitted[1]?
        BEMDOM.declElem(splitted[0], splitted[1], {}, { live : true }, true) :
        BEMDOM.declBlock(entityName, {}, { live : true }, true);
}

/**
 * Processes and adds necessary entity parameters
 * @param {Object} params Initialization parameters
 * @param {String} entityName Entity name
 * @param {String} [uniqInitId] ID of the "initialization wave"
 */
function processParams(params, entityName, uniqInitId) {
    params.uniqId ||
        (params.uniqId = (params.id?
            entityName + '-id-' + params.id :
            identify()) + (uniqInitId || identify()));

    return params;
}

/**
 * Helper for searching for a DOM element using a selector inside the context, including the context itself
 * @param {jQuery} ctx Context
 * @param {String} selector CSS selector
 * @param {Boolean} [excludeSelf=false] Exclude context from search
 * @returns {jQuery}
 */
function findDomElem(ctx, selector, excludeSelf) {
    var res = ctx.find(selector);
    return excludeSelf?
       res :
       res.add(ctx.filter(selector));
}

/**
 * Returns parameters of an entity's DOM element
 * @param {HTMLElement} domNode DOM node
 * @returns {Object}
 */
function getParams(domNode) {
    var uniqId = identify(domNode);
    return domElemToParams[uniqId] ||
        (domElemToParams[uniqId] = extractParams(domNode));
}

/**
 * Returns parameters of an entity extracted from DOM node
 * @param {HTMLElement} domNode DOM node
 * @param {String} blockName
 * @returns {Object}
 */

function getEntityParams(domNode, blockName) {
    var params = getParams(domNode);
    return params[blockName] || (params[blockName] = {});
}

/**
 * Retrieves entity parameters from a DOM element
 * @param {HTMLElement} domNode DOM node
 * @returns {Object}
 */
function extractParams(domNode) {
    var attrVal = domNode.getAttribute(BEM_PARAMS_ATTR);
    return attrVal? JSON.parse(attrVal) : {};
}

/**
 * Uncouple DOM node from the entity. If this is the last node, then destroys the entity.
 * @param {BemDomEntity} entity entity
 * @param {HTMLElement} domNode DOM node
 */
function removeDomNodeFromEntity(entity, domNode) {
    if(entity.domElem.length === 1) {
        entity._destruct();
        delete uniqIdToEntity[entity._uniqId];
    } else {
        entity.domElem = entity.domElem.not(domNode);
    }
}

/**
 * Stores DOM node's parent nodes to the storage
 * @param {jQuery} domElem
 */
function storeDomNodeParents(domElem) {
    domElem.each(function() {
        domNodesToParents[identify(this)] = this.parentNode;
    });
}

/**
 * Build key for elem
 * @param {Function|String|Object} elem Element class or name or description elem, modName, modVal
 * @returns {String}
 */
function buildElemKey(elem) {
    if(typeof elem === 'string') {
        elem = { elem : elem };
    } else if(functions.isFunction(elem)) {
        elem = { elem : elem.getName() };
    } else if(functions.isFunction(elem.elem)) {
        elem.elem = elem.elem.getName();
    }

    return elem.elem + buildModPostfix(elem.modName, elem.modVal);
}

/**
 * @class BemDomEntity
 * @description Base mix for BEM entities that have DOM representation
 */
var BemDomEntity = inherit(/** @lends BemDomEntity.prototype */{
    /**
     * @constructor
     * @private
     * @param {jQuery} domElem DOM element that the entity is created on
     * @param {Object} params parameters
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(domElem, params, initImmediately) {
        /**
         * DOM elements of entity
         * @member {jQuery}
         * @readonly
         */
        this.domElem = domElem;

        /**
         * @member {String} Unique entity ID
         * @private
         */
        this._uniqId = params.uniqId;

        uniqIdToEntity[this._uniqId] = this;

        /**
         * @member {Boolean} Flag for whether it's necessary to unbind from the document and window when destroying the entity
         * @private
         */
        this._needSpecialUnbind = false;

        this.__base(null, params, initImmediately);
    },

    /**
     * @abstract
     * @returns {Block}
     */
    block : function() {},

    /**
     * Finds the first child block
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {Block}
     */
    findChildBlock : function(Block) {
        return this._findEntities('find', Block, true);
    },

    /**
     * Finds child blocks
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {Block[]}
     */
    findChildBlocks : function(Block) {
        return this._findEntities('find', Block);
    },

    /**
     * Finds the first parent block
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {Block}
     */
    findParentBlock : function(Block) {
        return this._findEntities('parents', Block, true);
    },

    /**
     * Finds parent blocks
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {Block[]}
     */
    findParentBlocks : function(Block) {
        return this._findEntities('parents', Block);
    },

    /**
     * Finds first mixed block
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {Block}
     */
    findMixedBlock : function(Block) {
        return this._findEntities('filter', Block, true);
    },

    /**
     * Finds mixed blocks
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {Block[]}
     */
    findMixedBlocks : function(Block) {
        return this._findEntities('filter', Block);
    },

    /**
     * Finds child elements
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {Elem[]}
     */
    findChildElems : function(Elem, strictMode) {
        var res = this._findEntities('find', Elem);
        return strictMode? this._filterFindElemResults(res) : res;
    },

    /**
     * Finds the first child element
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {Elem}
     */
    findChildElem : function(Elem, strictMode) {
        return strictMode?
            this._filterFindElemResults(this._findEntities('find', Elem))[0] :
            this._findEntities('find', Elem, true);
    },

    /**
     * Finds parent elements
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {Elem[]}
     */
    findParentElems : function(Elem, strictMode) {
        var res = this._findEntities('parents', Elem);
        return strictMode? this._filterFindElemResults(res) : res;
    },

    /**
     * Finds the first parent element
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {Elem}
     */
    findParentElem : function(Elem, strictMode) {
        return strictMode?
            this._filterFindElemResults(this._findEntities('parents', Elem))[0] :
            this._findEntities('parents', Elem, true);
    },

    /**
     * Finds mixed elements
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {Elem[]}
     */
    findMixedElems : function(Elem) {
        return this._findEntities('filter', Elem);
    },

    /**
     * Finds the first mixed element
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {Elem}
     */
    findMixedElem : function(Elem) {
        return this._findEntities('filter', Elem, true);
    },

    /**
     * Filters results of findElem helper execution in strict mode
     * @param {Elem[]} res Elements
     * @returns {Elem[]}
     */
    _filterFindElemResults : function(res) {
        var block = this.block();
        return res.filter(function(elem) {
            return elem.block() === block;
        });
    },

    /**
     * Finds entities
     * @param {String} select
     * @param {Function|String|Object} entity
     * @param {Boolean} [onlyFirst=false]
     * @returns {*}
     */
    _findEntities : function(select, entity, onlyFirst) {
        var entityName = functions.isFunction(entity)?
                entity.getEntityName() :
                typeof entity === 'object'?
                    entity.block?
                        entity.block.getEntityName() :
                        typeof entity.elem === 'string'?
                            this.__self._blockName + ELEM_DELIM + entity.elem :
                            entity.elem.getEntityName() :
                    this.__self._blockName + ELEM_DELIM + entity,
            selector = '.' +
                (typeof entity === 'object'?
                    buildClass(entityName, entity.modName, entity.modVal) :
                    buildClass(entityName)) +
                (onlyFirst? ':first' : ''),
            domElems = this.domElem[select](selector);

        if(onlyFirst) return domElems[0]?
            initEntity(entityName, domElems.eq(0), undef, true)._init() :
            null;

        var res = [],
            uniqIds = {};

        domElems.each(function(i, domElem) {
            var block = initEntity(entityName, $(domElem), undef, true)._init();
            if(!uniqIds[block._uniqId]) {
                uniqIds[block._uniqId] = true;
                res.push(block);
            }
        });

        return res;
    },

    /**
     * Adds an event handler for any DOM element
     * @protected
     * @param {jQuery} domElem DOM element where the event will be listened for
     * @param {String|Object} event Event name or event object
     * @param {Object} [data] Additional event data
     * @param {Function} fn Handler function, which will be executed in the entity's context
     * @returns {BemDomEntity} this
     */
    bindToDomElem : function(domElem, event, data, fn) {
        if(functions.isFunction(data)) {
            fn = data;
            data = undef;
        }

        fn?
            domElem.bind(
                this._buildDomEventName(event),
                data,
                $.proxy(fn, this)) :
            objects.each(event, function(fn, event) {
                this.bindToDomElem(domElem, event, data, fn);
            }, this);

        return this;
    },

    /**
     * Adds an event handler to the document
     * @protected
     * @param {String|Object} event Event name or event object
     * @param {Object} [data] Additional event data
     * @param {Function} fn Handler function, which will be executed in the entity's context
     * @returns {BemDomEntity} this
     */
    bindToDoc : function(event, data, fn) {
        this._needSpecialUnbind = true;
        return this.bindToDomElem(doc, event, data, fn);
    },

    /**
     * Adds an event handler to the window
     * @protected
     * @param {String|Object} event Event name or event object
     * @param {Object} [data] Additional event data
     * @param {Function} fn Handler function, which will be executed in the entity's context
     * @returns {BemDomEntity} this
     */
    bindToWin : function(event, data, fn) {
        this._needSpecialUnbind = true;
        return this.bindToDomElem(win, event, data, fn);
    },

    /**
     * Adds an event handler to the main DOM elements of entity
     * @protected
     * @param {String|Object} event Event name or event object
     * @param {Object} [data] Additional event data
     * @param {Function} fn Handler function, which will be executed in the entity's context
     * @returns {BemDomEntity} this
     */
    bindTo : function(event, data, fn) {
        if(functions.isFunction(data)) {
            fn = data;
            data = undef;
        }

        return this.bindToDomElem(this.domElem, event, data, fn);
    },

    /**
    * Removes event handlers from any DOM element
    * @protected
    * @param {jQuery} domElem DOM element where the event was being listened for
    * @param {String|Object} event Event name or event object
    * @param {Function} [fn] Handler function
    * @returns {BemDomEntity} this
    */
    unbindFromDomElem : function(domElem, event, fn) {
        if(typeof event === 'string') {
            event = this._buildDomEventName(event);
            fn?
                domElem.unbind(event, fn) :
                domElem.unbind(event);
        } else {
            objects.each(event, function(fn, event) {
                this.unbindFromDomElem(domElem, event, fn);
            }, this);
        }

        return this;
    },

    /**
    * Removes event handler from document
    * @protected
    * @param {String|Object} event Event name or event object
    * @param {Function} [fn] Handler function
    * @returns {BemDomEntity} this
    */
    unbindFromDoc : function(event, fn) {
        return this.unbindFromDomElem(doc, event, fn);
    },

    /**
    * Removes event handler from window
    * @protected
    * @param {String|Object} event Event name or event object
    * @param {Function} [fn] Handler function
    * @returns {BemDomEntity} this
    */
    unbindFromWin : function(event, fn) {
        return this.unbindFromDomElem(win, event, fn);
    },

    /**
    * Removes event handlers from the main DOM elements of entity
    * @protected
    * @param {String|Object} [event] Event name or event object
    * @param {Function} [fn] Handler function
    * @returns {BemDomEntity} this
    */
    unbindFrom : function(event, fn) {
        return this.unbindFromDomElem(this.domElem, event, fn);
    },

    /**
     * Builds a full name for an event
     * @private
     * @param {String} event Event name
     * @returns {String}
     */
    _buildDomEventName : function(event) {
        var uniq = '.' + this._uniqId;
        return event.indexOf(' ') > 1?
            event.split(' ').map(function(e) {
                return e + uniq;
            }, this).join(' ') :
            event + uniq;
    },

    _ctxEmit : function(e, data) {
        this.__base.apply(this, arguments);

        var _this = this,
            storage = liveEventCtxStorage[_this.__self._buildCtxEventName(e.type)],
            ctxIds = {};

        storage && _this.domElem.each(function(_, ctx) {
            var counter = storage.counter;
            while(ctx && counter) {
                var ctxId = identify(ctx, true);
                if(ctxId) {
                    if(ctxIds[ctxId]) break;
                    var storageCtx = storage.ctxs[ctxId];
                    if(storageCtx) {
                        objects.each(storageCtx, function(handler) {
                            handler.fn.call(
                                handler.ctx || _this,
                                e,
                                data);
                        });
                        counter--;
                    }
                    ctxIds[ctxId] = true;
                }
                ctx = ctx.parentNode || domNodesToParents[ctxId];
            }
        });
    },

    /**
     * Retrieves modifier value from the DOM node's CSS class
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery} [elem] Nested element
     * @param {String} [elemName] Name of the nested element
     * @returns {String} Modifier value
     */
    _extractModVal : function(modName) {
        var domNode = this.domElem[0],
            matches;

        domNode &&
            (matches = domNode.className
                .match(this.__self._buildModValRE(modName)));

        return matches? matches[2] || true : '';
    },

    /**
     * @override
     */
    _onSetMod : function(modName, modVal, oldModVal) {
        this.__base.apply(this, arguments);

        if(modName !== 'js' || modVal !== '') {
            var _self = this.__self,
                classPrefix = _self._buildModClassPrefix(modName),
                classRE = _self._buildModValRE(modName),
                needDel = modVal === '';

            this.domElem.each(function() {
                var className = this.className,
                    modClassName = classPrefix;

                modVal !== true && (modClassName += MOD_DELIM + modVal);

                (oldModVal === true?
                    classRE.test(className) :
                    className.indexOf(classPrefix + MOD_DELIM) > -1)?
                        this.className = className.replace(
                            classRE,
                            (needDel? '' : '$1' + modClassName)) :
                        needDel || $(this).addClass(modClassName);
            });
        }
    },

    /**
     * Checks whether a DOM element is in a block
     * @protected
     * @param {jQuery} domElem DOM element
     * @returns {Boolean}
     */
    containsDomElem : function(domElem) {
        return dom.contains(this.domElem, domElem);
    },

    /**
     * Builds a CSS selector corresponding to an entity and modifier
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildSelector : function(modName, modVal) {
        return this.__self.buildSelector(modName, modVal);
    },

    /**
     * Destructs a block
     * @private
     */
    _destruct : function() {
        if(this._needSpecialUnbind) {
            var eventNs = '.' + this._uniqId;
            doc.off(eventNs);
            win.off(eventNs);
        }

        this.__base();

        this.un();
    }

}, /** @lends Block */{
    /**
     * @override
     */
    create : function() {
        throw Error('BEMDOM blocks can not be created otherwise than from DOM');
    },

    /**
     * Processes live properties of entity
     * @private
     * @param {Boolean} [heedLive=false] Whether to take into account that the entity already processed its live properties
     * @returns {Boolean} Whether the entity is a live
     */
    _processLive : function(heedLive) {
        var res = this._liveInitable;

        if('live' in this) {
            var noLive = typeof res === 'undefined';

            if(noLive ^ heedLive) {
                res = this.live() !== false;
                this.live = functions.noop;
            }
        }

        return res;
    },

    /**
     * Builds a full name for a live event
     * @private
     * @param {String} e Event name
     * @returns {String}
     */
    _buildCtxEventName : function(e) {
        return this.getEntityName() + ':' + e;
    },

    _liveClassBind : function(className, e, callback, invokeOnInit) {
        if(e.indexOf(' ') > -1) {
            e.split(' ').forEach(function(e) {
                this._liveClassBind(className, e, callback, invokeOnInit);
            }, this);
        } else {
            var storage = liveClassEventStorage[e],
                uniqId = identify(callback);

            if(!storage) {
                storage = liveClassEventStorage[e] = {};
                BEMDOM.scope.on(e, $.proxy(this._liveClassTrigger, this));
            }

            storage = storage[className] || (storage[className] = { uniqIds : {}, fns : [] });

            if(!(uniqId in storage.uniqIds)) {
                storage.fns.push({ uniqId : uniqId, fn : this._buildLiveEventFn(callback, invokeOnInit) });
                storage.uniqIds[uniqId] = storage.fns.length - 1;
            }
        }

        return this;
    },

    _liveClassUnbind : function(className, e, callback) {
        var storage = liveClassEventStorage[e];
        if(storage) {
            if(callback) {
                if(storage = storage[className]) {
                    var uniqId = identify(callback);
                    if(uniqId in storage.uniqIds) {
                        var i = storage.uniqIds[uniqId],
                            len = storage.fns.length - 1;
                        storage.fns.splice(i, 1);
                        while(i < len) storage.uniqIds[storage.fns[i++].uniqId] = i - 1;
                        delete storage.uniqIds[uniqId];
                    }
                }
            } else {
                delete storage[className];
            }
        }

        return this;
    },

    _liveClassTrigger : function(e) {
        var storage = liveClassEventStorage[e.type];
        if(storage) {
            var node = e.target, classNames = [];
            for(var className in storage) {
                classNames.push(className);
            }
            do {
                var nodeClassName = ' ' + node.className + ' ', i = 0;
                while(className = classNames[i++]) {
                    if(nodeClassName.indexOf(' ' + className + ' ') > -1) {
                        var j = 0, fns = storage[className].fns, fn, stopPropagationAndPreventDefault = false;
                        while(fn = fns[j++])
                            if(fn.fn.call($(node), e) === false) stopPropagationAndPreventDefault = true;

                        stopPropagationAndPreventDefault && e.preventDefault();
                        if(stopPropagationAndPreventDefault || e.isPropagationStopped()) return;

                        classNames.splice(--i, 1);
                    }
                }
            } while(classNames.length && (node = node.parentNode));
        }
    },

    _buildLiveEventFn : function(callback, invokeOnInit) {
        var _this = this;
        return function(e) {
            e.currentTarget = this;
            var args = [
                    _this.getEntityName(),
                    $(this).closest(_this.buildSelector()),
                    undef,
                    true
                ],
                entity = initEntity.apply(null, invokeOnInit? args.concat([callback, e]) : args);

            if(entity && !invokeOnInit && callback)
                return callback.apply(entity, arguments);
        };
    },

    /**
     * Helper for live initialization for an event on DOM elements of a block or its elements
     * @protected
     * @param {Function|String|Object} elem Element class or name or description elem, modName, modVal
     * @param {String} event Event name
     * @param {Function} [callback] Handler to call after successful initialization
     */
    liveInitOnEvent : function(elem, event, callback) {
        return this.liveBindTo(elem, event, callback, true);
    },

    /**
     * Helper for subscribing to live events on DOM elements of a block or its elements
     * @protected
     * @param {Function|String|Object} [to] Element class or name or description elem, modName, modVal or entity description (modName, modVal)
     * @param {String} event Event name
     * @param {Function} [callback] Handler
     * @returns {Function} this
     */
    liveBindTo : function(to, event, callback, invokeOnInit) {
        if(!event || functions.isFunction(event)) {
            callback = event;
            event = to;
            to = undef;
        }

        if(!to || typeof to !== 'object') {
            to = { elem : typeof to === 'string' ? to : to.getName() };
        }

        return this._liveClassBind(
            buildClass(this._blockName, to.elem, to.modName, to.modVal),
            event,
            callback,
            invokeOnInit);
    },

    /**
     * Helper for unsubscribing from live events on DOM elements of an entity
     * @protected
     * @param {Function|String|Object} [from] Element class or name or description elem, modName, modVal or entity description (modName, modVal)
     * @param {String} event Event name
     * @param {Function} [callback] Handler
     * @returns {Function} this
     */
    liveUnbindFrom : function(from, event, callback) {
        if(!event || functions.isFunction(event)) {
            callback = event;
            event = from;
            from = undef;
        }

        if(!from || typeof from !== 'object') {
            from = { elem : typeof from === 'string' ? from : from.getName() };
        }

        return this._liveClassUnbind(
            buildClass(this._blockName, from.elem, from.modName, from.modVal),
            event,
            callback);
    },

    /**
     * Helper for live initialization when a different entity is initialized
     * @private
     * @param {String} event Event name
     * @param {Function} entityCls Class of entity that should emit a reaction when initialized
     * @param {Function} callback Handler to be called after successful initialization in the new entity's context
     * @param {String} findFnName Name of the method for searching
     */
    _liveInitOnEntityEvent : function(event, entityCls, callback, findFnName) {
        entityCls.on(
            event,
            function(e) {
                var args = arguments,
                    entity = e.target[findFnName](this);

                callback && entity.forEach(function(entity) {
                    callback.apply(entity, args);
                });
            },
            this);

        return this;
    },

    /**
     * Helper for live initialization for a different entity's event on the current entity's DOM element
     * @protected
     * @param {String} event Event name
     * @param {Function} entityCls Class of entity that should emit a reaction when initialized
     * @param {Function} callback Handler to be called after successful initialization in the new entity's context
     * @returns {Function} this
     */
    liveInitOnEntityEvent : function(event, entityCls, callback) {
        return this._liveInitOnEntityEvent(event, entityCls, callback, 'findEntitysOn');
    },

    /**
     * Helper for live initialization for a different entity's event inside the current entity
     * @protected
     * @param {String} event Event name
     * @param {Function} entityCls Class of entity that should emit a reaction when initialized
     * @param {Function} [callback] Handler to be called after successful initialization in the new block's context
     * @returns {Function} this
     */
    liveInitOnEntityInsideEvent : function(event, entityCls, callback) {
        return this._liveInitOnEntityEvent(event, entityCls, callback, 'findEntitysOutside');
    },

    /**
     * Adds a live event handler to an entity, based on a specified element where the event will be listened for
     * @param {jQuery} [ctx] The element in which the event will be listened for
     * @param {String} e Event name
     * @param {Object} [data] Additional information that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Handler's context
     * @returns {Function} this
     */
    on : function(ctx, e, data, fn, fnCtx) {
        return typeof ctx === 'object' && ctx.jquery?
            this._liveCtxBind(ctx, e, data, fn, fnCtx) :
            this.__base(ctx, e, data, fn);
    },

    /**
     * Removes the live event handler from an entity, based on a specified element where the event was being listened for
     * @param {jQuery} [ctx] The element in which the event was being listened for
     * @param {String} e Event name
     * @param {Function} [fn] Handler
     * @param {Object} [fnCtx] Handler context
     * @returns {Function} this
     */
    un : function(ctx, e, fn, fnCtx) {
        return typeof ctx === 'object' && ctx.jquery?
            this._liveCtxUnbind(ctx, e, fn, fnCtx) :
            this.__base(ctx, e, fn);
    },

    /**
     * Adds a live event handler to an entity, based on a specified element where the event will be listened for
     * @private
     * @param {jQuery} ctx The element in which the event will be listened for
     * @param {String} e  Event name
     * @param {Object} [data] Additional information that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Handler context
     * @returns {Function} this
     */
    _liveCtxBind : function(ctx, e, data, fn, fnCtx) {
        if(typeof e === 'object') {
            if(functions.isFunction(data) || functions.isFunction(fn)) { // mod change event
                e = this._buildModEventName(e);
            } else {
                objects.each(e, function(fn, e) {
                    this._liveCtxBind(ctx, e, fn, data);
                }, this);
                return this;
            }
        }

        if(functions.isFunction(data)) {
            fnCtx = fn;
            fn = data;
            data = undef;
        }

        if(e.indexOf(' ') > -1) {
            e.split(' ').forEach(function(e) {
                this._liveCtxBind(ctx, e, data, fn, fnCtx);
            }, this);
        } else {
            var ctxE = this._buildCtxEventName(e),
                storage = liveEventCtxStorage[ctxE] ||
                    (liveEventCtxStorage[ctxE] = { counter : 0, ctxs : {} });

            ctx.each(function() {
                var ctxId = identify(this),
                    ctxStorage = storage.ctxs[ctxId];
                if(!ctxStorage) {
                    ctxStorage = storage.ctxs[ctxId] = {};
                    ++storage.counter;
                }
                ctxStorage[identify(fn) + (fnCtx? identify(fnCtx) : '')] = {
                    fn : fn,
                    data : data,
                    ctx : fnCtx
                };
            });
        }

        return this;
    },

    /**
     * Removes a live event handler from an entity, based on a specified element where the event was being listened for
     * @private
     * @param {jQuery} ctx The element in which the event was being listened for
     * @param {String|Object} e Event name
     * @param {Function} [fn] Handler
     * @param {Object} [fnCtx] Handler context
     * @returns {Function} this
     */
    _liveCtxUnbind : function(ctx, e, fn, fnCtx) {
        if(typeof e === 'object' && functions.isFunction(fn)) { // mod change event
            e = this._buildModEventName(e);
        }

        var storage = liveEventCtxStorage[e = this._buildCtxEventName(e)];

        if(storage) {
            ctx.each(function() {
                var ctxId = identify(this, true),
                    ctxStorage;
                if(ctxId && (ctxStorage = storage.ctxs[ctxId])) {
                    fn && delete ctxStorage[identify(fn) + (fnCtx? identify(fnCtx) : '')];
                    if(!fn || objects.isEmpty(ctxStorage)) {
                        storage.counter--;
                        delete storage.ctxs[ctxId];
                    }
                }
            });
            storage.counter || delete liveEventCtxStorage[e];
        }

        return this;
    },

    /**
     * Builds a prefix for the CSS class of a DOM element of the entity, based on modifier name
     * @private
     * @param {String} modName Modifier name
     * @returns {String}
     */
    _buildModClassPrefix : function(modName) {
        return this.getEntityName() + MOD_DELIM + modName;
    },

    /**
     * Builds a regular expression for extracting modifier values from a DOM element of an entity
     * @private
     * @param {String} modName Modifier name
     * @returns {RegExp}
     */
    _buildModValRE : function(modName) {
        return new RegExp(
            '(\\s|^)' +
            this._buildModClassPrefix(modName) +
            '(?:' + MOD_DELIM + '(' + NAME_PATTERN + '))?(?=\\s|$)');
    },

    /**
     * Builds a CSS class corresponding to the entity and modifier
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildClass : function(modName, modVal) {
        return buildClass(this.getEntityName(), modName, modVal);
    },

    /**
     * Builds a CSS selector corresponding to an entity and modifier
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildSelector : function(modName, modVal) {
        return '.' + this.buildClass(modName, modVal);
    }
});

/**
 * @class Block
 * @description Base class for creating BEM blocks that have DOM representation
 * @augments i-bem:Block
 * @exports
 */
var Block = inherit([BEM.Block, BemDomEntity], /** @lends Block.prototype */{
    /**
     * @override
     */
    __constructor : function() {
        /**
         * Cache for elements collections
         * @member {Object}
         * @private
         */
        this._elemsCache = {};

        /**
         * Cache for elements
         * @member {Object}
         * @private
         */
        this._elemCache = {};

        this.__base.apply(this, arguments);
    },

    /**
     * @override
     */
    block : function() {
        return this;
    },

    /**
     * Lazy search for elements nested in a block (caches results)
     * @private
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {Elem[]}
     */
    elems : function(Elem) {
        var key = buildElemKey(Elem);
        return key in this._elemsCache?
            this._elemsCache[key] :
            this._elemsCache[key] = this.findChildElems(Elem);
    },

    /**
     * Lazy search for the first element nested in a block (caches results)
     * @private
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {Elem}
     */
    elem : function(Elem) {
        var key = buildElemKey(Elem);
        // NOTE: can use this._elemsCache but it's too rare case
        return key in this._elemCache?
            this._elemCache[key] :
            this._elemCache[key] = this.findChildElem(Elem);
    },

    /**
     * Clearing the cache for elements
     * @protected
     * @param {Function|String|Object} [...elems] Nested elements names or description elem, modName, modVal
     * @returns {BemDomEntity} this
     */
    dropElemCache : function(elems) {
        if(!arguments.length) {
            this._elemsCache = {};
            this._elemCache = {};
            return this;
        }

        (Array.isArray(elems)? elems : slice.call(arguments)).forEach(function(elem) {
            var key = buildElemKey(elem);
            delete this._elemsCache[key];
            delete this._elemCache[key];
        }, this);

        return this;
    }
}, /** @lends Block */{
});

/**
 * @class Elem
 * @description Base class for creating BEM elements that have DOM representation
 * @augments i-bem:Elem
 * @exports
 */
var Elem = inherit([BEM.Elem, BemDomEntity], /** @lends Elem.prototype */{
    /**
     * @override
     */
    block : function() {
        return this._block || (this._block = this.findParentBlock(getEntityCls(this.__self._blockName)));
    },

    /**
     * @override
     */
    _onSetMod : function(modName, modVal, oldModVal) {
        var name = this.__self.getName(),
            block = this.block();

        oldModVal === '' || block.dropElemCache({ elem : name, modName : modName, modVal : oldModVal });
        modVal === '' || block.dropElemCache({ elem : name, modName : modName, modVal : modVal });

        this.__base.apply(this, arguments);
    }
}, /** @lends Elem */{
});

/**
 * Returns a block on a DOM element and initializes it if necessary
 * @param {Function} Block Block
 * @param {Object} params Block parameters
 * @returns {BEMDOM}
 */
$.fn.bem = function(Block, params) {
    return initEntity(Block.getName(), this, params, true)._init();
};

$(function() {

BEMDOM = /** @exports */{

    /**
     * Scope
     * @type jQuery
     */
    scope : $('body'),

    /**
     * Document shortcut
     * @type jQuery
     */
    doc : doc,

    /**
     * Window shortcut
     * @type jQuery
     */
    win : win,

    /**
     * Base BEMDOM block
     * @type Function
     */
    Block : Block,

    /**
     * Declares DOM-based block and creates block class
     * @param {String} blockName Block name
     * @param {Function|Array[Function]} [baseBlocks] base block + mixes
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     * @returns {Function} Block class
     */
    declBlock : function(blockName, baseBlocks, props, staticProps) {
        if(!baseBlocks || (typeof baseBlocks === 'object' && !Array.isArray(baseBlocks))) {
            staticProps = props;
            props = baseBlocks;
            baseBlocks = Block;
        }

        return BEM.declBlock(blockName, baseBlocks, props, staticProps);
    },

    /**
     * Declares elem and creates elem class
     * @param {String} blockName Block name
     * @param {String} elemName Elem name
     * @param {Function|Array[Function]} [baseElems] base elem + mixes
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     * @returns {Function} Elem class
     */
    declElem : function(blockName, elemName, baseElems, props, staticProps) {
        if(!baseElems || (typeof baseElems === 'object' && !Array.isArray(baseElems))) {
            staticProps = props;
            props = baseElems;
            baseElems = Elem;
        }

        return BEM.declElem(blockName, elemName, baseElems, props, staticProps);
    },

    declMix : BEM.declMix,

    /**
     * Initializes blocks on a fragment of the DOM tree
     * @param {jQuery|String} [ctx=scope] Root DOM node
     * @returns {jQuery} ctx Initialization context
     */
    init : function(ctx) {
        ctx = typeof ctx === 'string'?
            $(ctx) :
            ctx || BEMDOM.scope;

        var uniqInitId = identify();
        findDomElem(ctx, BEM_SELECTOR).each(function() {
            initEntities($(this), uniqInitId);
        });

        BEM._runInitFns();

        return ctx;
    },

    /**
     * Destroys blocks on a fragment of the DOM tree
     * @param {jQuery} ctx Root DOM node
     * @param {Boolean} [excludeSelf=false] Exclude the main domElem
     */
    destruct : function(ctx, excludeSelf) {
        var _ctx;
        if(excludeSelf) {
            storeDomNodeParents(_ctx = ctx.children());
            ctx.empty();
        } else {
            storeDomNodeParents(_ctx = ctx);
            ctx.remove();
        }

        reverse.call(findDomElem(_ctx, BEM_SELECTOR)).each(function(_, domNode) {
            var params = getParams(domNode);
            objects.each(params, function(blockParams) {
                if(blockParams.uniqId) {
                    var block = uniqIdToEntity[blockParams.uniqId];
                    block?
                        removeDomNodeFromEntity(block, domNode) :
                        delete uniqIdToDomElems[blockParams.uniqId];
                }
            });
            delete domElemToParams[identify(domNode)];
        });

        // flush parent nodes storage that has been filled above
        domNodesToParents = {};
    },

    /**
     * Replaces a fragment of the DOM tree inside the context, destroying old blocks and intializing new ones
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content New content
     * @returns {jQuery} Updated root DOM node
     */
    update : function(ctx, content) {
        this.destruct(ctx, true);
        return this.init(ctx.html(content));
    },

    /**
     * Changes a fragment of the DOM tree including the context and initializes blocks.
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     * @returns {jQuery} New content
     */
    replace : function(ctx, content) {
        var prev = ctx.prev(),
            parent = ctx.parent();

        this.destruct(ctx);

        return this.init(prev.length?
            $(content).insertAfter(prev) :
            $(content).prependTo(parent));
    },

    /**
     * Adds a fragment of the DOM tree at the end of the context and initializes blocks
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     * @returns {jQuery} New content
     */
    append : function(ctx, content) {
        return this.init($(content).appendTo(ctx));
    },

    /**
     * Adds a fragment of the DOM tree at the beginning of the context and initializes blocks
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     * @returns {jQuery} New content
     */
    prepend : function(ctx, content) {
        return this.init($(content).prependTo(ctx));
    },

    /**
     * Adds a fragment of the DOM tree before the context and initializes blocks
     * @param {jQuery} ctx Contextual DOM node
     * @param {jQuery|String} content Content to be added
     * @returns {jQuery} New content
     */
    before : function(ctx, content) {
        return this.init($(content).insertBefore(ctx));
    },

    /**
     * Adds a fragment of the DOM tree after the context and initializes blocks
     * @param {jQuery} ctx Contextual DOM node
     * @param {jQuery|String} content Content to be added
     * @returns {jQuery} New content
     */
    after : function(ctx, content) {
        return this.init($(content).insertAfter(ctx));
    }
};

provide(BEMDOM);

});

});

(function() {

var origDefine = modules.define;

modules.define = function(name, deps, decl) {
    origDefine.apply(modules, arguments);

    name !== 'i-bem-dom__init' && arguments.length > 2 && ~deps.indexOf('i-bem-dom') &&
        modules.define('i-bem-dom__init', [name], function(provide, _, prev) {
            provide(prev);
        });
};

})();
