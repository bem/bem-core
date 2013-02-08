/** @requires jquery.inherit */
/** @requires jquery.isEmptyObject */
/** @requires jquery.identify */
/** @requires jquery.observable */

(function($, undefined) {

/**
 * Storage for deferred functions
 * @private
 * @type Array
 */
var afterCurrentEventFns = [],

/**
 * Storage for block declarations (hash by block name)
 * @private
 * @type Object
 */
    blocks = {},

/**
 * Communication channels
 * @static
 * @private
 * @type Object
 */
    channels = {};

/**
 * Builds the name of the handler method for setting a modifier
 * @static
 * @private
 * @param {String} elemName Element name
 * @param {String} modName Modifier name
 * @param {String} modVal Modifier value
 * @returns {String}
 */
function buildModFnName(elemName, modName, modVal) {

    return (elemName? '__elem_' + elemName : '') +
           '__mod' +
           (modName? '_' + modName : '') +
           (modVal? '_' + modVal : '');

}

/**
 * Transforms a hash of modifier handlers to methods
 * @static
 * @private
 * @param {Object} modFns
 * @param {Object} props
 * @param {String} [elemName]
 */
function modFnsToProps(modFns, props, elemName) {

    $.isFunction(modFns)?
        (props[buildModFnName(elemName, '*', '*')] = modFns) :
        $.each(modFns, function(modName, modFn) {
            $.isFunction(modFn)?
                (props[buildModFnName(elemName, modName, '*')] = modFn) :
                $.each(modFn, function(modVal, modFn) {
                    props[buildModFnName(elemName, modName, modVal)] = modFn;
                });
        });

}

function buildCheckMod(modName, modVal) {

    return modVal?
        Array.isArray(modVal)?
            function(block) {
                var i = 0, len = modVal.length;
                while(i < len)
                    if(block.hasMod(modName, modVal[i++]))
                        return true;
                return false;
            } :
            function(block) {
                return block.hasMod(modName, modVal);
            } :
        function(block) {
            return block.hasMod(modName);
        };

}

/** @namespace */
this.BEM = $.inherit($.observable, /** @lends BEM.prototype */ {

    /**
     * @class Base block for creating BEM blocks
     * @constructs
     * @private
     * @param {Object} mods Block modifiers
     * @param {Object} params Block parameters
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(mods, params, initImmediately) {

        var _this = this;

        /**
         * Cache of block modifiers
         * @private
         * @type Object
         */
        _this._modCache = mods || {};

        /**
         * Current modifiers in the stack
         * @private
         * @type Object
         */
        _this._processingMods = {};

        /**
         * The block's parameters, taking into account the defaults
         * @protected
         * @type Object
         */
        _this._params = params; // это нужно для правильной сборки параметров у блока из нескольких нод
        _this.params = null;

        initImmediately !== false?
            _this._init() :
            _this.afterCurrentEvent(function() {
                _this._init();
            });

    },

    /**
     * Initializes the block
     * @private
     */
    _init : function() {

        if(!this._initing && !this.hasMod('js', 'inited')) {
            this._initing = true;

            if(!this.params) {
                this.params = $.extend(this.getDefaultParams(), this._params);
                delete this._params;
            }

            this.setMod('js', 'inited');
            delete this._initing;
            this.hasMod('js', 'inited') && this.trigger('init');
        }

        return this;

    },

    /**
     * Changes the context of the function being passed
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx=this] Context
     * @returns {Function} Function with a modified context
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Executes the function in the context of the block, after the "current event"
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx] Context
     */
    afterCurrentEvent : function(fn, ctx) {

        this.__self.afterCurrentEvent(this.changeThis(fn, ctx));

    },

    /**
     * Executes the block's event handlers and live event handlers
     * @protected
     * @param {String} e Event name
     * @param {Object} [data] Additional information
     * @returns {BEM}
     */
    trigger : function(e, data) {

        this
            .__base(e = this.buildEvent(e), data)
            .__self.trigger(e, data);

        return this;

    },

    buildEvent : function(e) {

        typeof e == 'string' && (e = $.Event(e));
        e.block = this;

        return e;

    },

    /**
     * Checks whether a block or nested element has a modifier
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {Boolean}
     */
    hasMod : function(elem, modName, modVal) {

        var len = arguments.length,
            invert = false;

        if(len == 1) {
            modVal = '';
            modName = elem;
            elem = undefined;
            invert = true;
        }
        else if(len == 2) {
            if(typeof elem == 'string') {
                modVal = modName;
                modName = elem;
                elem = undefined;
            }
            else {
                modVal = '';
                invert = true;
            }
        }

        var res = this.getMod(elem, modName) === modVal;
        return invert? !res : res;

    },

    /**
     * Returns the value of the modifier of the block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {String} Modifier value
     */
    getMod : function(elem, modName) {

        var type = typeof elem;
        if(type === 'string' || type === 'undefined') { // elem either omitted or undefined
            modName = elem || modName;
            var modCache = this._modCache;
            return modName in modCache?
                modCache[modName] :
                modCache[modName] = this._extractModVal(modName);
        }

        return this._getElemMod(modName, elem);

    },

    /**
     * Returns the value of the modifier of the nested element
     * @private
     * @param {String} modName Modifier name
     * @param {Object} elem Nested element
     * @param {Object} [elem] Nested element name
     * @returns {String} Modifier value
     */
    _getElemMod : function(modName, elem, elemName) {

        return this._extractModVal(modName, elem, elemName);

    },

    /**
     * Returns values of modifiers of the block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} [modName1, ..., modNameN] Modifier names
     * @returns {Object} Hash of modifier values
     */
    getMods : function(elem) {

        var hasElem = elem && typeof elem != 'string',
            _this = this,
            modNames = [].slice.call(arguments, hasElem? 1 : 0),
            res = _this._extractMods(modNames, hasElem? elem : undefined);

        if(!hasElem) { // caching
            modNames.length?
                modNames.forEach(function(name) {
                    _this._modCache[name] = res[name];
                }):
                _this._modCache = res;
        }

        return res;

    },

    /**
     * Sets the modifier for a block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @returns {BEM}
     */
    setMod : function(elem, modName, modVal) {

        if(typeof modVal == 'undefined') {
            modVal = modName;
            modName = elem;
            elem = undefined;
        }

        var _this = this;

        if(!elem || elem[0]) {

            var modId = (elem && elem[0]? $.identify(elem[0]) : '') + '_' + modName;

            if(this._processingMods[modId]) return _this;

            var elemName,
                curModVal = elem?
                    _this._getElemMod(modName, elem, elemName = _this.__self._extractElemNameFrom(elem)) :
                    _this.getMod(modName);

            if(curModVal === modVal) return _this;

            this._processingMods[modId] = true;

            var needSetMod = true,
                modFnParams = [modName, modVal, curModVal];

            elem && modFnParams.unshift(elem);

            [['*', '*'], [modName, '*'], [modName, modVal]].forEach(function(mod) {
                needSetMod = _this._callModFn(elemName, mod[0], mod[1], modFnParams) !== false && needSetMod;
            });

            !elem && needSetMod && (_this._modCache[modName] = modVal);

            needSetMod && _this._afterSetMod(modName, modVal, curModVal, elem, elemName);

            delete this._processingMods[modId];
        }

        return _this;

    },

    /**
     * Function after successfully changing the modifier of the block/nested element
     * @protected
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {String} oldModVal Old modifier value
     * @param {Object} [elem] Nested element
     * @param {String} [elemName] Element name
     */
    _afterSetMod : function(modName, modVal, oldModVal, elem, elemName) {},

    /**
     * Sets a modifier for a block/nested element, depending on conditions.
     * If the condition parameter is passed: when true, modVal1 is set; when false, modVal2 is set.
     * If the condition parameter is not passed: modVal1 is set if modVal2 was set, or vice versa.
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal1 First modifier value
     * @param {String} [modVal2] Second modifier value
     * @param {Boolean} [condition] Condition
     * @returns {BEM}
     */
    toggleMod : function(elem, modName, modVal1, modVal2, condition) {

        if(typeof elem == 'string') { // if this is a block
            condition = modVal2;
            modVal2 = modVal1;
            modVal1 = modName;
            modName = elem;
            elem = undefined;
        }
        if(typeof modVal2 == 'undefined') {
            modVal2 = '';
        } else if(typeof modVal2 == 'boolean') {
            condition = modVal2;
            modVal2 = '';
        }

        var modVal = this.getMod(elem, modName);
        (modVal == modVal1 || modVal == modVal2) &&
            this.setMod(
                elem,
                modName,
                typeof condition === 'boolean'?
                    (condition? modVal1 : modVal2) :
                    this.hasMod(elem, modName, modVal1)? modVal2 : modVal1);

        return this;

    },

    /**
     * Removes a modifier from a block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {BEM}
     */
    delMod : function(elem, modName) {

        if(!modName) {
            modName = elem;
            elem = undefined;
        }

        return this.setMod(elem, modName, '');

    },

    /**
     * Executes handlers for setting modifiers
     * @private
     * @param {String} elemName Element name
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {Array} modFnParams Handler parameters
     */
    _callModFn : function(elemName, modName, modVal, modFnParams) {

        var modFnName = buildModFnName(elemName, modName, modVal);
        return this[modFnName]?
           this[modFnName].apply(this, modFnParams) :
           undefined;

    },

    /**
     * Retrieves the value of the modifier
     * @private
     * @param {String} modName Modifier name
     * @param {Object} [elem] Element
     * @returns {String} Modifier value
     */
    _extractModVal : function(modName, elem) {

        return '';

    },

    /**
     * Retrieves name/value for a list of modifiers
     * @private
     * @param {Array} modNames Names of modifiers
     * @param {Object} [elem] Element
     * @returns {Object} Hash of modifier values by name
     */
    _extractMods : function(modNames, elem) {

        return {};

    },

    /**
     * Returns a named communication channel
     * @param {String} [id='default'] Channel ID
     * @param {Boolean} [drop=false] Destroy the channel
     * @returns {$.observable|undefined} Communication channel
     */
    channel : function(id, drop) {

        return this.__self.channel(id, drop);

    },

    /**
     * Returns a block's default parameters
     * @returns {Object}
     */
    getDefaultParams : function() {

        return {};

    },

    /**
     * Helper for cleaning up block properties
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var args = [].slice.call(arguments);
        typeof obj == 'string' && args.unshift(this);
        this.__self.del.apply(this.__self, args);
        return this;

	},

    /**
     * Deletes a block
     */
    destruct : function() {}

}, /** @lends BEM */{

    _name : 'i-bem',

    /**
     * Storage for block declarations (hash by block name)
     * @static
     * @protected
     * @type Object
     */
    blocks : blocks,

    /**
     * Declares blocks and creates a block class
     * @static
     * @protected
     * @param {String|Object} decl Block name (simple syntax) or description
     * @param {String} decl.block|decl.name Block name
     * @param {String} [decl.baseBlock] Name of the parent block
     * @param {String} [decl.modName] Modifier name
     * @param {String} [decl.modVal] Modifier value
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     */
    decl : function(decl, props, staticProps) {

        if(typeof decl == 'string')
            decl = { block : decl };
        else if(decl.name) {
            decl.block = decl.name;
        }

        if(decl.baseBlock && !blocks[decl.baseBlock])
            throw('baseBlock "' + decl.baseBlock + '" for "' + decl.block + '" is undefined');

        props || (props = {});

        if(props.onSetMod) {
            modFnsToProps(props.onSetMod, props);
            delete props.onSetMod;
        }

        if(props.onElemSetMod) {
            $.each(props.onElemSetMod, function(elemName, modFns) {
                modFnsToProps(modFns, props, elemName);
            });
            delete props.onElemSetMod;
        }

        var baseBlock = blocks[decl.baseBlock || decl.block] || this;

        if(decl.modName) {
            var checkMod = buildCheckMod(decl.modName, decl.modVal);
            $.each(props, function(name, prop) {
                $.isFunction(prop) &&
                    (props[name] = function() {
                        var method;
                        if(checkMod(this)) {
                            method = prop;
                        } else {
                            var baseMethod = baseBlock.prototype[name];
                            baseMethod && baseMethod !== props[name] &&
                                (method = this.__base);
                        }
                        return method?
                            method.apply(this, arguments) :
                            undefined;
                    });
            });
        }

        if(staticProps && typeof staticProps.live === 'boolean') {
            var live = staticProps.live;
            staticProps.live = function() {
                return live;
            };
        }

        var block;
        decl.block == baseBlock._name?
            // makes a new "live" if the old one was already executed
            (block = $.inheritSelf(baseBlock, props, staticProps))._processLive(true) :
            (block = blocks[decl.block] = $.inherit(baseBlock, props, staticProps))._name = decl.block;

        return block;

    },

    /**
     * Processes a block's live properties
     * @private
     * @param {Boolean} [heedLive=false] Whether to take into account that the block already processed its live properties
     * @returns {Boolean} Whether the block is a live block
     */
    _processLive : function(heedLive) {

        return false;

    },

    /**
     * Factory method for creating an instance of the block named
     * @static
     * @param {String|Object} block Block name or description
     * @param {Object} [params] Block parameters
     * @returns {BEM}
     */
    create : function(block, params) {

        typeof block == 'string' && (block = { block : block });

        return new blocks[block.block](block.mods, params);

    },

    /**
     * Returns the name of the current block
     * @static
     * @protected
     * @returns {String}
     */
    getName : function() {

        return this._name;

    },

    /**
     * Retrieves the name of an element nested in a block
     * @static
     * @private
     * @param {Object} elem Nested element
     * @returns {String|undefined}
     */
    _extractElemNameFrom : function(elem) {},

    /**
     * Adds a function to the queue for executing after the "current event"
     * @static
     * @protected
     * @param {Function} fn
     * @param {Object} ctx
     */
    afterCurrentEvent : function(fn, ctx) {

        afterCurrentEventFns.push({ fn : fn, ctx : ctx }) == 1 &&
            setTimeout(this._runAfterCurrentEventFns, 0);

    },

    /**
     * Executes the queue
     * @private
     */
    _runAfterCurrentEventFns : function() {

        var fnsLen = afterCurrentEventFns.length;
        if(fnsLen) {
            var fnObj,
                fnsCopy = afterCurrentEventFns.splice(0, fnsLen);

            while(fnObj = fnsCopy.shift()) fnObj.fn.call(fnObj.ctx || this);
        }

    },

    /**
     * Changes the context of the function being passed
     * @protected
     * @param {Function} fn
     * @param {Object} ctx Context
     * @returns {Function} Function with a modified context
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Helper for cleaning out properties
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var delInThis = typeof obj == 'string',
            i = delInThis? 0 : 1,
            len = arguments.length;
        delInThis && (obj = this);

        while(i < len) delete obj[arguments[i++]];

        return this;

	},

    /**
     * Returns/destroys a named communication channel
     * @param {String} [id='default'] Channel ID
     * @param {Boolean} [drop=false] Destroy the channel
     * @returns {$.observable|undefined} Communication channel
     */
    channel : function(id, drop) {

        if(typeof id == 'boolean') {
            drop = id;
            id = undefined;
        }

        id || (id = 'default');

        if(drop) {
            if(channels[id]) {
                channels[id].un();
                delete channels[id];
            }
            return;
        }

        return channels[id] || (channels[id] = new $.observable());

    }

});

})(jQuery);