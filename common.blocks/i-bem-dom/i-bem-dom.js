/**
 * @module i-bem-dom
 */

modules.define(
    'i-bem-dom',
    [
        'i-bem',
        'i-bem__internal',
        'i-bem-dom__collection',
        'i-bem-dom__events_type_dom',
        'i-bem-dom__events_type_bem',
        'inherit',
        'identify',
        'objects',
        'functions',
        'dom'
    ],
    function(
        provide,
        bem,
        bemInternal,
        BemDomCollection,
        domEvents,
        bemEvents,
        inherit,
        identify,
        objects,
        functions,
        dom) {

var undef,
    /**
     * Storage for DOM nodes by unique key
     * @type Object
     */
    uniqIdToDomNodes = {},

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
    domNodeToParams = {},

    /**
     * Storage for DOM nodes that are being destructed
     * @type Object
     */
    destructingDomNodes = {},

    entities = bem.entities,

    BEM_CLASS_NAME = 'i-bem',
    BEM_SELECTOR = '.' + BEM_CLASS_NAME,
    BEM_PARAMS_ATTR = 'data-bem',

    NAME_PATTERN = bemInternal.NAME_PATTERN,

    MOD_DELIM = bemInternal.MOD_DELIM,
    ELEM_DELIM = bemInternal.ELEM_DELIM,

    buildModPostfix = bemInternal.buildModPostfix,
    buildClassName = bemInternal.buildClassName,

    reverse = Array.prototype.reverse,
    slice = Array.prototype.slice,

    domEventManagerFactory = new domEvents.EventManagerFactory(getEntityCls, getEntity),
    bemEventManagerFactory = new bemEvents.EventManagerFactory(getEntityCls, getEntity),

    bemDom;

/**
 * Initializes entities on a DOM node
 * @param {Element} domNode DOM node
 * @param {String} uniqInitId ID of the "initialization wave"
 * @param {Object} [dropElemCacheQueue] queue of elems to be dropped from cache
 */
function initEntities(domNode, uniqInitId, dropElemCacheQueue) {
    var params = getParams(domNode),
        entityName,
        splitted,
        blockName,
        elemName;

    for(entityName in params) {
        splitted = entityName.split(ELEM_DELIM);
        blockName = splitted[0];
        elemName = splitted[1];
        elemName &&
            ((dropElemCacheQueue[blockName] ||
                (dropElemCacheQueue[blockName] = {}))[elemName] = true);

        initEntity(
            entityName,
            domNode,
            processParams(params[entityName], entityName, uniqInitId));
    }
}

/**
 * Initializes a specific entity on a DOM node, or returns the existing entity if it was already created
 * @param {String} entityName Entity name
 * @param {Element} domNode DOM node
 * @param {Object} [params] Initialization parameters
 * @param {Boolean} [ignoreLazyInit=false] Ignore lazy initialization
 * @param {Function} [callback] Handler to call after complete initialization
 */
function initEntity(entityName, domNode, params, ignoreLazyInit, callback) {
    if(destructingDomNodes[identify(domNode)]) return;

    params || (params = processParams(getEntityParams(domNode, entityName), entityName));

    var uniqId = params.uniqId,
        entity = uniqIdToEntity[uniqId];

    if(entity) {
         if(entity.domNodes.indexOf(domNode) < 0) {
             entity.domNodes.push(domNode);
             objects.extend(entity.params, params);
         }

        return entity;
    }

    uniqIdToDomNodes[uniqId]?
        uniqIdToDomNodes[uniqId].push(domNode) :
        (uniqIdToDomNodes[uniqId] = [domNode]);

    // TODO: add tests for
    // i-bem__dom: multiple live initialization on disconnected node add same node many times
    // var parentDomNode = domNode.parentNode;
    // if(!parentDomNode || parentDomNode.nodeType === 11) { // jquery doesn't unique disconnected node
    //     $.unique(uniqIdToDomNodes[uniqId]);
    // }

    var entityCls = getEntityCls(entityName);

    entityCls._processInit();

    if(!entityCls.lazyInit || ignoreLazyInit || params.lazyInit === false) {
        ignoreLazyInit && domNode.classList.add(BEM_CLASS_NAME); // add css class for preventing memory leaks in further destructing

        entity = new entityCls(uniqIdToDomNodes[uniqId], params, !!ignoreLazyInit);
        delete uniqIdToDomNodes[uniqId];
        callback && callback.apply(entity, slice.call(arguments, 4));
        return entity;
    }
}

function getEntityCls(entityName) {
    if(entities[entityName]) return entities[entityName];

    var splitted = entityName.split(ELEM_DELIM);
    return splitted[1]?
        bemDom.declElem(splitted[0], splitted[1], {}, { lazyInit : true }, true) :
        bemDom.declBlock(entityName, {}, { lazyInit : true }, true);
}

/**
 * Returns an entity on a DOM node or first entity of node list and initializes it if necessary
 * @param {Element|NodeList|HTMLCollection} domNode DOM node
 * @param {Function} BemDomEntity entity
 * @param {Object} [params] entity parameters
 * @returns {BemDomEntity|null}
 */
function getEntity(domNode, BemDomEntity, params) {
    domNode instanceof Element || (domNode = domNode[0]);
    var entity = initEntity(BemDomEntity.getEntityName(), domNode, params, true);
    return entity? entity._setInitedMod() : null;
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
 * Returns parameters of an entity's DOM element
 * @param {HTMLElement} domNode DOM node
 * @returns {Object}
 */
function getParams(domNode) {
    var uniqId = identify(domNode);
    return domNodeToParams[uniqId] ||
        (domNodeToParams[uniqId] = extractParams(domNode));
}

/**
 * Returns parameters of an entity extracted from DOM node
 * @param {HTMLElement} domNode DOM node
 * @param {String} entityName
 * @returns {Object}
 */

function getEntityParams(domNode, entityName) {
    var params = getParams(domNode);
    return params[entityName] || (params[entityName] = {});
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
    var domNodes = entity.domNodes;
    if(domNodes.length === 1) {
        entity._delInitedMod();
        delete uniqIdToEntity[entity._uniqId];
    } else {
        domNodes.splice(domNodes.indexOf(domNode), 1);
    }
}

/**
 * Stores DOM node's parent node to the storage
 * @param {Element} node list
 */
function storeDomNodeParent(domNode) {
    domNodesToParents[identify(domNode)] = domNode.parentNode;
}

/**
 * Stores DOM node's parent nodes to the storage
 * @param {Element|NodeList|HTMLCollection} node list
 */
function storeDomNodesParents(domNodes) {
    if(domNodes instanceof Element) {
        storeDomNodeParent(domNodes);
    } else {
        var i = 0, domNode;

        while(domNode = domNodes[i++]) storeDomNodeParent(domNode);
    }
}

/**
 * Clears the cache for elements in context
 * @param {Element|NodeList|HTMLCollection} ctx
 */
function dropElemCacheForCtx(ctx, dropElemCacheQueue) {
    var visited = {};


    var i = 0,
        isDomNode = ctx instanceof Element,
        domNode = ctx;

    // once when ctx is an element and cycle for ctx as NodeList|HTMLCollection
    while((isDomNode && !i++) || (domNode = ctx[i++])) {
        var domNodeId = identify(domNode);

        do {
            visited[domNodeId] = true;

            var params = domNodeToParams[domNodeId];

            params && objects.each(params, function(entityParams) {
                var entity = uniqIdToEntity[entityParams.uniqId];
                if(entity) {
                    var elemNames = dropElemCacheQueue[entity.__self._blockName];
                    elemNames && entity._dropElemCache(Object.keys(elemNames));
                }
            });
        } while((domNodeId = identify(domNode = domNode.parentElement)) && !visited[domNodeId]);
    }
}

/**
 * Build key for elem
 * @param {Function|String|Object} elem Element class or name or description elem, modName, modVal
 * @returns {Object}
 */
function buildElemKey(elem) {
    if(typeof elem === 'string') {
        elem = { elem : elem };
    } else if(functions.isFunction(elem)) {
        elem = { elem : elem.getName() };
    } else if(functions.isFunction(elem.elem)) {
        elem.elem = elem.elem.getName();
    }

    return {
        elem : elem.elem,
        mod : buildModPostfix(elem.modName, elem.modVal)
    };
}

// jscs:disable requireMultipleVarDecl

/**
 * Validates block to be class or specified description
 * @param {*} Block Any argument passed to find*Block as Block
 * @throws {Error} Will throw an error if the Block argument isn't correct
 */
function validateBlockParam(Block) {
    if(
        typeof Block === 'string' ||
        typeof Block === 'object' && typeof Block.block === 'string'
    ) {
        throw new Error('Block must be a class or description (block, modName, modVal) of the block to find');
    }
}

/**
 * @class BemDomEntity
 * @description Base mix for BEM entities that have DOM representation
 */
var BemDomEntity = inherit(/** @lends BemDomEntity.prototype */{
    /**
     * @constructs
     * @private
     * @param {Array[Element]} domNodes DOM elements that the entity is created on
     * @param {Object} params parameters
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(domNodes, params, initImmediately) {
        /**
         * DOM elements of entity
         * @member {Array[Element]}
         * @readonly
         */
        this.domNodes = domNodes;

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

        /**
         * References to parent entities which found current entity ever
         * @type {Array}
         * @private
         */
        this._findBackRefs = [];

        uniqIdToEntity[params.uniqId || identify(this)] = this;

        this.__base(null, params, initImmediately);
    },

    /**
     * @abstract
     * @protected
     * @returns {Block}
     */
    _block : function() {},

    /**
     * Lazy search for elements nested in a block (caches results)
     * @protected
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {BemDomCollection}
     */
    _elems : function(Elem) {
        var key = buildElemKey(Elem),
            elemsCache = this._elemsCache[key.elem];

        if(elemsCache && key.mod in elemsCache)
            return elemsCache[key.mod];

        var res = (elemsCache || (this._elemsCache[key.elem] = {}))[key.mod] =
            this.findMixedElems(Elem).concat(this.findChildElems(Elem));

        res.forEach(function(entity) {
            entity._findBackRefs.push(this);
        }, this);

        return res;
    },

    /**
     * Lazy search for the first element nested in a block (caches results)
     * @protected
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {Elem}
     */
    _elem : function(Elem) {
        var key = buildElemKey(Elem),
            elemCache = this._elemCache[key.elem];

        // NOTE: can use this._elemsCache but it's too rare case
        if(elemCache && key.mod in elemCache)
            return elemCache[key.mod];

        var res = (elemCache || (this._elemCache[key.elem] = {}))[key.mod] =
            this.findMixedElem(Elem) || this.findChildElem(Elem);

        res && res._findBackRefs.push(this);

        return res;
    },

    /**
     * Clears the cache for elements
     * @private
     * @param {?...(Function|String|Object)} elems Nested elements names or description elem, modName, modVal
     * @returns {BemDomEntity} this
     */
    _dropElemCache : function(elems) {
        if(!arguments.length) {
            this._elemsCache = {};
            this._elemCache = {};
            return this;
        }

        (Array.isArray(elems)? elems : slice.call(arguments)).forEach(function(elem) {
            var key = buildElemKey(elem);
            if(key.mod) {
                this._elemsCache[key.elem] && delete this._elemsCache[key.elem][key.mod];
                this._elemCache[key.elem] && delete this._elemCache[key.elem][key.mod];
            } else {
                delete this._elemsCache[key.elem];
                delete this._elemCache[key.elem];
            }
        }, this);

        return this;
    },

    /**
     * Finds the first child block
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {Block|null}
     */
    findChildBlock : function(Block) {
        validateBlockParam(Block);

        return this._findChildEntities(Block, true);
    },

    /**
     * Finds child blocks
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {BemDomCollection}
     */
    findChildBlocks : function(Block) {
        validateBlockParam(Block);

        return this._findChildEntities(Block);
    },

    /**
     * Finds the first parent block
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {Block|null}
     */
    findParentBlock : function(Block) {
        validateBlockParam(Block);

        return this._findParentEntities(Block, true);
    },

    /**
     * Finds parent blocks
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {BemDomCollection}
     */
    findParentBlocks : function(Block) {
        validateBlockParam(Block);

        return this._findParentEntities(Block);
    },

    /**
     * Finds first mixed block
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {Block|null}
     */
    findMixedBlock : function(Block) {
        validateBlockParam(Block);

        return this._findMixedEntities(Block, true);
    },

    /**
     * Finds mixed blocks
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {BemDomCollection}
     */
    findMixedBlocks : function(Block) {
        validateBlockParam(Block);

        return this._findMixedEntities(Block);
    },

    /**
     * Finds the first child element
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {Elem|null}
     */
    findChildElem : function(Elem, strictMode) {
        return strictMode?
            this._filterFindElemResults(this._findChildEntities(Elem)).get(0) :
            this._findChildEntities(Elem, true);
    },

    /**
     * Finds child elements
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {BemDomCollection}
     */
    findChildElems : function(Elem, strictMode) {
        var res = this._findChildEntities(Elem);

        return strictMode?
            this._filterFindElemResults(res) :
            res;
    },

    /**
     * Finds the first parent element
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {Elem|null}
     */
    findParentElem : function(Elem, strictMode) {
        return strictMode?
            this._filterFindElemResults(this._findParentEntities(Elem))[0] :
            this._findParentEntities(Elem, true);
    },

    /**
     * Finds parent elements
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {BemDomCollection}
     */
    findParentElems : function(Elem, strictMode) {
        var res = this._findParentEntities(Elem);
        return strictMode? this._filterFindElemResults(res) : res;
    },

    /**
     * Finds the first mixed element
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {Elem|null}
     */
    findMixedElem : function(Elem) {
        return this._findMixedEntities(Elem, true);
    },

    /**
     * Finds mixed elements.
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {BemDomCollection}
     */
    findMixedElems : function(Elem) {
        return this._findMixedEntities(Elem);
    },

    /**
     * Filters results of findElem helper execution in strict mode
     * @private
     * @param {BemDomCollection} res Elements
     * @returns {BemDomCollection}
     */
    _filterFindElemResults : function(res) {
        var block = this._block();
        return res.filter(function(elem) {
            return elem._block() === block;
        });
    },

    /**
     * Finds child entities
     * @private
     * @param {Function|String|Object} entity
     * @param {Boolean} [onlyFirst=false]
     * @returns {*}
     */
    _findChildEntities : function(entity, onlyFirst) {
        var entityName = this._buildEntityNameByEntity(entity),
            selector = '.' + this._buildClassNameByEntity(entity, entityName),
            res = [],
            uniqIds = {},
            domNodes = this.domNodes,
            i = 0,
            domNode;

        while(domNode = domNodes[i++]) {
            var childrenDomNodes = onlyFirst?
                    [domNode.querySelector(selector)] :
                    domNode.querySelectorAll(selector),
                j = 0,
                childDomNode;

            while(childDomNode = childrenDomNodes[j++]) {
                var resEntity = initEntity(entityName, childDomNode, undef, true)._setInitedMod();
                if(!uniqIds[resEntity._uniqId]) {
                    uniqIds[resEntity._uniqId] = true;
                    res.push(resEntity);
                }

                if(onlyFirst && resEntity) return resEntity;
            }
        }

        return onlyFirst? null : new BemDomCollection(res);
    },

    /**
     * Finds parent entities
     * @private
     * @param {Function|String|Object} entity
     * @param {Boolean} [onlyFirst=false]
     * @returns {*}
     */
    _findParentEntities : function(entity, onlyFirst) {
        var entityName = this._buildEntityNameByEntity(entity),
            className = this._buildClassNameByEntity(entity, entityName),
            res = [],
            uniqIds = {},
            domNodes = this.domNodes,
            i = 0,
            domNode;

        while(domNode = domNodes[i++]) {
            while(domNode = domNode.parentNode) {
                if(!domNode.classList.contains(className)) continue;

                var resEntity = initEntity(entityName, domNode, undef, true)._setInitedMod();
                if(!uniqIds[resEntity._uniqId]) {
                    uniqIds[resEntity._uniqId] = true;
                    res.push(resEntity);
                }

                if(onlyFirst && resEntity) return resEntity;
            }
        }

        return onlyFirst? null : new BemDomCollection(res);
    },

    /**
     * Finds mixed entities
     * @private
     * @param {Function|String|Object} entity
     * @param {Boolean} [onlyFirst=false]
     * @returns {*}
     */
    _findMixedEntities : function(entity, onlyFirst) {
        var entityName = this._buildEntityNameByEntity(entity),
            className = this._buildClassNameByEntity(entity, entityName),
            res = [],
            uniqIds = {},
            domNodes = this.domNodes,
            i = 0,
            domNode;

        while(domNode = domNodes[i++]) {
            if(!domNode.classList.contains(className)) continue;

            var resEntity = initEntity(entityName, domNode, undef, true)._setInitedMod();
            if(!uniqIds[resEntity._uniqId]) {
                uniqIds[resEntity._uniqId] = true;
                res.push(resEntity);
            }

            if(onlyFirst && resEntity) return resEntity;
        }

        return onlyFirst? null : new BemDomCollection(res);
    },

    _buildEntityNameByEntity : function(entity) {
        return functions.isFunction(entity)?
            entity.getEntityName() :
            typeof entity === 'object'?
                entity.block?
                    entity.block.getEntityName() :
                    typeof entity.elem === 'string'?
                        this.__self._blockName + ELEM_DELIM + entity.elem :
                        entity.elem.getEntityName() :
                this.__self._blockName + ELEM_DELIM + entity;
    },

    _buildClassNameByEntity : function(entity, entityName) {
        return typeof entity === 'object'?
            buildClassName(
                entityName,
                entity.modName,
                typeof entity.modVal === 'undefined'?
                    true :
                    entity.modVal) :
            entityName;
    },

    /**
     * Returns an manager to bind and unbind DOM events for particular context
     * @protected
     * @param {Function|String|Object|Elem|BemDomCollection|document|window} [ctx=this.domNodes] context to bind,
     *     can be BEM-element class, instance, collection of BEM-entities,
     *     element name or description (elem, modName, modVal), document or window
     * @returns {EventManager}
     */
    _domEvents : function(ctx) {
        return domEventManagerFactory.getEventManager(this, ctx, this.domNodes);
    },

    /**
     * Returns an manager to bind and unbind BEM events for particular context
     * @protected
     * @param {Function|String|BemDomEntity|BemDomCollection|Object} [ctx=this.domNodes] context to bind,
     *     can be BEM-entity class, instance, collection of BEM-entities,
     *     element name or description (elem, modName, modVal)
     * @returns {EventManager}
     */
    _events : function(ctx) {
        return bemEventManagerFactory.getEventManager(this, ctx, this.domNodes);
    },

    /**
     * Executes the BEM entity's event handlers and delegated handlers
     * @protected
     * @param {String|Object|events:Event} e Event name
     * @param {Object} [data] Additional information
     * @returns {BemEntity} this
     */
    _emit : function(e, data) {
        if((typeof e === 'object' && e.modName === 'js') || this.hasMod('js', 'inited')) {
            bemEvents.emit(this, e, data);
        }

        return this;
    },

    /** @override */
    _extractModVal : function(modName) {
        var matches;

        this.domNodes[0] &&
            (matches = this.domNodes[0].className
                .match(this.__self._buildModValRE(modName)));

        return matches? matches[2] || true : '';
    },

    /** @override */
    _onSetMod : function(modName, modVal, oldModVal) {
        var _self = this.__self,
            name = _self.getName();

        this._findBackRefs.forEach(function(ref) {
            oldModVal === '' || ref._dropElemCache({ elem : name, modName : modName, modVal : oldModVal });
            ref._dropElemCache(modVal === ''? name : { elem : name, modName : modName, modVal : modVal });
        });

        this.__base.apply(this, arguments);

        if(modName !== 'js' || modVal !== '') {
            var classNamePrefix = _self._buildModClassNamePrefix(modName),
                classNameRE = _self._buildModValRE(modName),
                needDel = modVal === '',
                modClassName = classNamePrefix;

            modVal !== true && (modClassName += MOD_DELIM + modVal);

            this.domNodes.forEach(function(domNode) {
                var className = domNode.className;

                (oldModVal === true?
                    classNameRE.test(className) :
                    (' ' + className).indexOf(' ' + classNamePrefix + MOD_DELIM) > -1)?
                        domNode.className = className.replace(
                            classNameRE,
                            (needDel? '' : '$1' + modClassName)) :
                        needDel || domNode.classList.add(modClassName);
            });
        }
    },

    /** @override */
    _afterSetMod : function(modName, modVal, oldModVal) {
        var eventData = { modName : modName, modVal : modVal, oldModVal : oldModVal };
        this
            ._emit({ modName : modName, modVal : '*' }, eventData)
            ._emit({ modName : modName, modVal : modVal }, eventData);
    },

    /**
     * Checks whether an entity is in the entity
     * @param {BemDomEntity} entity entity
     * @returns {Boolean}
     */
    containsEntity : function(entity) {
        // TODO: support multi node case and refactor `dom`
        return dom.contains(this.domNodes, entity.domNodes);
    }

}, /** @lends BemDomEntity */{
    /** @override */
    create : function() {
        throw Error('bemDom entities can not be created otherwise than from DOM');
    },

    /** @override */
    _processInit : function(heedInit) {
        /* jshint eqeqeq: false */
        if(this.onInit && this._inited == heedInit) {
            this.__base(heedInit);

            this.onInit();

            var name = this.getName(),
                origOnInit = this.onInit;

            // allow future calls of init only in case of inheritance in other block
            this.init = function() {
                this.getName() === name && origOnInit.apply(this, arguments);
            };
        }
    },

    /**
     * Returns an manager to bind and unbind events for particular context
     * @protected
     * @param {Function|String|Object} [ctx] context to bind,
     *     can be BEM-entity class, instance, element name or description (elem, modName, modVal)
     * @returns {EventManager}
     */
    _domEvents : function(ctx) {
        return domEventManagerFactory.getEventManager(this, ctx, bemDom.scope);
    },

    /**
     * Returns an manager to bind and unbind BEM events for particular context
     * @protected
     * @param {Function|String|Object} [ctx] context to bind,
     *     can be BEM-entity class, instance, element name or description (block or elem, modName, modVal)
     * @returns {EventManager}
     */
    _events : function(ctx) {
        return bemEventManagerFactory.getEventManager(this, ctx, bemDom.scope);
    },

    /**
     * Builds a prefix for the CSS class of a DOM element of the entity, based on modifier name
     * @private
     * @param {String} modName Modifier name
     * @returns {String}
     */
    _buildModClassNamePrefix : function(modName) {
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
            this._buildModClassNamePrefix(modName) +
            '(?:' + MOD_DELIM + '(' + NAME_PATTERN + '))?(?=\\s|$)');
    },

    /**
     * Builds a CSS class name corresponding to the entity and modifier
     * @protected
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    _buildClassName : function(modName, modVal) {
        return buildClassName(this.getEntityName(), modName, modVal);
    },

    /**
     * Builds a CSS selector corresponding to an entity and modifier
     * @protected
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    _buildSelector : function(modName, modVal) {
        return '.' + this._buildClassName(modName, modVal);
    }
});

/**
 * @class Block
 * @description Base class for creating BEM blocks that have DOM representation
 * @augments i-bem:Block
 * @exports i-bem-dom:Block
 */
var Block = inherit([bem.Block, BemDomEntity], /** @lends Block.prototype */{
    /** @override */
    _block : function() {
        return this;
    }
});

/**
 * @class Elem
 * @description Base class for creating BEM elements that have DOM representation
 * @augments i-bem:Elem
 * @exports i-bem-dom:Elem
 */
var Elem = inherit([bem.Elem, BemDomEntity], /** @lends Elem.prototype */{
    /** @override */
    _block : function() {
        return this._blockInstance || (this._blockInstance = this.findParentBlock(getEntityCls(this.__self._blockName)));
    }
});


(function(onDomReady) {
    document.readyState === 'loading'?
        document.addEventListener('DOMContentLoaded', onDomReady) :
        onDomReady();
})(function() {

bemDom = /** @exports */{
    /**
     * Scope
     * @type Element
     */
    scope : document.body,

    /**
     * Base bemDom block
     * @type Function
     */
    Block : Block,

    /**
     * Base bemDom element
     * @type Function
     */
    Elem : Elem,

    /**
     * @param {*} entity
     * @returns {Boolean}
     */
    isEntity : function(entity) {
        return entity instanceof Block || entity instanceof Elem;
    },

    /**
     * Returns an entity on a DOM node or first entity of node list and initializes it if necessary
     * @param {Element|NodeList|HTMLCollection} domNode DOM node
     * @param {Function} BemDomEntity entity
     * @param {Object} [params] entity parameters
     * @returns {BemDomEntity|null}
     */
    getEntity : getEntity,

    /**
     * Declares DOM-based block and creates block class
     * @param {String|Function} blockName Block name or block class
     * @param {Function|Array[Function]} [base] base block + mixes
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     * @returns {Function} Block class
     */
    declBlock : function(blockName, base, props, staticProps) {
        if(!base || (typeof base === 'object' && !Array.isArray(base))) {
            staticProps = props;
            props = base;
            base = typeof blockName === 'string'?
                entities[blockName] || Block :
                blockName;
        }

        return bem.declBlock(blockName, base, props, staticProps);
    },

    /**
     * Declares elem and creates elem class
     * @param {String} blockName Block name
     * @param {String} elemName Elem name
     * @param {Function|Array[Function]} [base] base elem + mixes
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     * @returns {Function} Elem class
     */
    declElem : function(blockName, elemName, base, props, staticProps) {
        if(!base || (typeof base === 'object' && !Array.isArray(base))) {
            staticProps = props;
            props = base;
            base = entities[blockName + ELEM_DELIM + elemName] || Elem;
        }

        return bem.declElem(blockName, elemName, base, props, staticProps);
    },

    declMixin : bem.declMixin,

    /**
     * Initializes blocks on a fragment of the DOM tree
     * @param {Element|NodeList|HTMLCollection|String} [ctx=scope] Root DOM node or HTML string
     * @returns {Element|NodeList} ctx Initialization context
     */
    init : function(ctx) {
        ctx = typeof ctx === 'string'?
            dom.fromString(ctx) :
            ctx || bemDom.scope;

        var dropElemCacheQueue = {},
            uniqInitId = identify(),
            i = 0,
            isDomNode = ctx instanceof Element,
            domNode = ctx;

        // once when ctx is an element and cycle for ctx as NodeList|HTMLCollection
        while((isDomNode && !i++) || (domNode = ctx[i++])) {
            domNode.classList.contains(BEM_CLASS_NAME) &&
                initEntities(domNode, uniqInitId, dropElemCacheQueue);

            var domNodes = domNode.querySelectorAll(BEM_SELECTOR),
                j = 0;

            // NOTE: we find only js-entities, so cached elems without js can't be dropped from cache
            while(domNode = domNodes[j++])
                initEntities(domNode, uniqInitId, dropElemCacheQueue);
        }

        bem._runInitFns();

        dropElemCacheForCtx(ctx, dropElemCacheQueue);

        return ctx;
    },

    /**
     * @param {Element} ctx Root DOM node
     * @param {Boolean} [excludeSelf=false] Exclude the main domNode
     * @param {Boolean} [destructDom=false] Remove DOM node during destruction
     * @private
     */
    _destruct : function(ctx, excludeSelf, destructDom) {
        var _ctx,
            currentDestructingDomNodes = [];

        if(!(ctx instanceof Element)) throw Error('destruct should be called on one DOM node');

        storeDomNodesParents(_ctx = excludeSelf? ctx.children : ctx);

        var i = _ctx.length || 1,
            isDomNode = _ctx instanceof Element,
            ctxDomNode = _ctx;

        // once when _ctx is an element and cycle for _ctx as NodeList|HTMLCollection
        while((isDomNode && i--) || (ctxDomNode = _ctx[--i])) {
            var domNodes = ctxDomNode.querySelectorAll(BEM_SELECTOR),
                j = domNodes.length,
                domNode;

            while((domNode = domNodes[--j]) || (domNode = ctxDomNode)) {
                var params = getParams(domNode),
                    domNodeId = identify(domNode);

                destructingDomNodes[domNodeId] = true;
                currentDestructingDomNodes.push(domNodeId);

                objects.each(params, function(entityParams) {
                    if(entityParams.uniqId) {
                        var entity = uniqIdToEntity[entityParams.uniqId];
                        entity?
                            removeDomNodeFromEntity(entity, domNode) :
                            delete uniqIdToDomNodes[entityParams.uniqId];
                    }
                });
                delete domNodeToParams[identify(domNode)];

                if(domNode === ctxDomNode) break;
            }
        }

        // NOTE: it was moved here as jquery events aren't triggered on detached DOM elements
        destructDom &&
            (excludeSelf?
                ctx.innerHTML = '' :
                ctx.parentNode && ctx.parentNode.removeChild(ctx));

        // flush parent nodes storage that has been filled above
        domNodesToParents = {};

        currentDestructingDomNodes.forEach(function(domNodeId) {
            delete destructingDomNodes[domNodeId];
        });
    },

    /**
     * Destroys blocks on a fragment of the DOM tree
     * @param {Element} ctx Root DOM node
     * @param {Boolean} [excludeSelf=false] Exclude the main DOM node
     */
    destruct : function(ctx, excludeSelf) {
        this._destruct(ctx, excludeSelf, true);
    },

    /**
     * Detaches blocks on a fragment of the DOM tree without DOM tree destruction
     * @param {Element} ctx Root DOM node
     * @param {Boolean} [excludeSelf=false] Exclude the main DOM node
     */
    detach : function(ctx, excludeSelf) {
        this._destruct(ctx, excludeSelf);
    },

    /**
     * Replaces a fragment of the DOM tree inside the context, destroying old blocks and initializing new ones
     * @param {Element} ctx Root DOM node
     * @param {Element|String} content New content
     * @returns {Element} Updated root DOM node
     */
    update : function(ctx, content) {
        this.destruct(ctx, true);

        typeof content === 'string' ?
            ctx.innerHTML = content :
            ctx.appendChild(content);

        return this.init(ctx);
    },

    /**
     * Changes a fragment of the DOM tree including the context and initializes blocks.
     * @param {Element} ctx Root DOM node
     * @param {Element|String} content Content to be added
     * @returns {Element} First DOM node of new content
     */
    replace : function(ctx, content) {
        var next = ctx.nextSibling,
            parent = ctx.parentNode;

        this.destruct(ctx);

        typeof content === 'string' &&
            (content = dom.fromString(content));

        var i = 0,
            isDomNode = content instanceof Element,
            domNode = content,
            firstInitedEntity = null;

        // once when content is an element and cycle for content as NodeList|HTMLCollection
        while((isDomNode && !i++) || (domNode = content[i++])) {
            next?
                parent.insertBefore(domNode, next) :
                parent.appendChild(domNode);

            var initedEntity = this.init(domNode);

            firstInitedEntity || (firstInitedEntity = initedEntity);
        }

        return firstInitedEntity;
    },

    /**
     * Adds a fragment of the DOM tree at the end of the context and initializes blocks
     * @param {Element} ctx Root DOM node
     * @param {Element|String} content Content to be added
     * @returns {Element} First DOM node of new content
     */
    append : function(ctx, content) {
        typeof content === 'string' &&
            (content = dom.fromString(content));

        var i = 0,
            isDomNode = content instanceof Element,
            domNode = content,
            firstInitedEntity = null;

        // once when content is an element and cycle for content as NodeList|HTMLCollection
        while((isDomNode && !i++) || (domNode = content[i++])) {
            ctx.appendChild(domNode);

            var initedEntity = this.init(domNode);

            firstInitedEntity || (firstInitedEntity = initedEntity);
        }

        return firstInitedEntity;
    },

    /**
     * Adds a fragment of the DOM tree at the beginning of the context and initializes blocks
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     * @returns {jQuery} First DOM node of new content
     */
    prepend : function(ctx, content) {
        typeof content === 'string' &&
            (content = dom.fromString(content));

        var firstChild = ctx.firstChild,
            i = 0,
            isDomNode = content instanceof Element,
            domNode = content,
            firstInitedEntity = null;

        // once when content is an element and cycle for content as NodeList|HTMLCollection
        while((isDomNode && !i++) || (domNode = content[i++])) {
            ctx.insertBefore(domNode, firstChild);

            var initedEntity = this.init(domNode);

            firstInitedEntity || (firstInitedEntity = initedEntity);
        }

        return firstInitedEntity;
    },

    /**
     * Adds a fragment of the DOM tree before the context and initializes blocks
     * @param {Element} ctx Contextual DOM node
     * @param {Element|String} content Content to be added
     * @returns {Element} First DOM node of new content
     */
    before : function(ctx, content) {
        typeof content === 'string' &&
            (content = dom.fromString(content));

        var parent = ctx.parentNode,
            i = 0,
            isDomNode = content instanceof Element,
            domNode = content,
            firstInitedEntity = null;

        // once when content is an element and cycle for content as NodeList|HTMLCollection
        while((isDomNode && !i++) || (domNode = content[i++])) {
            parent.insertBefore(domNode, ctx);

            var initedEntity = this.init(domNode);

            firstInitedEntity || (firstInitedEntity = initedEntity);
        }

        return firstInitedEntity;
    },

    /**
     * Adds a fragment of the DOM tree after the context and initializes blocks
     * @param {Element} ctx Contextual DOM node
     * @param {Element|String} content Content to be added
     * @returns {Element} First DOM node of new content
     */
    after : function(ctx, content) {
        typeof content === 'string' &&
            (content = dom.fromString(content));

        var next = ctx.nextSibling,
            parent = ctx.parentNode,
            i = 0,
            isDomNode = content instanceof Element,
            domNode = content,
            firstInitedEntity = null;

        // once when content is an element and cycle for content as NodeList|HTMLCollection
        while((isDomNode && !i++) || (domNode = content[i++])) {
            next?
                parent.insertBefore(domNode, next) :
                parent.appendChild(domNode);

            var initedEntity = this.init(domNode);

            firstInitedEntity || (firstInitedEntity = initedEntity);
        }

        return firstInitedEntity;
    }
};

provide(bemDom);

});

});

(function() {

var origDefine = modules.define,
    storedDeps = []; // NOTE: see https://github.com/bem/bem-core/issues/1446

modules.define = function(name, deps, decl) {
    origDefine.apply(modules, arguments);

    if(name !== 'i-bem-dom__init' && arguments.length > 2 && ~deps.indexOf('i-bem-dom')) {
        storedDeps.push(name);
        storedDeps.length === 1 && modules.define('i-bem-dom__init', storedDeps, function(provide) {
            provide(arguments[arguments.length - 1]);
            storedDeps = [];
        });
    }
};

})();
