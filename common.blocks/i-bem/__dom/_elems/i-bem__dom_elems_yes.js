/** @requires BEM */
/** @requires BEM.INTERNAL */

modules.define(
    'i-bem__dom',
    ['i-bem', 'i-bem__internal', 'jquery'],
    function(provide, BEM, INTERNAL, $, DOM) {

var buildClass = INTERNAL.buildClass,
    NAME_PATTERN = INTERNAL.NAME_PATTERN,
    MOD_DELIM = INTERNAL.MOD_DELIM,
    ELEM_DELIM = INTERNAL.ELEM_DELIM,
    blocks = BEM.blocks,
    slice = Array.prototype.slice;

BEM.decl('i-bem__dom', {

    /**
     * Delegates native getMod helper to element's instance
     * @protected
     * @param {jQuery} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {String} Modifier value
     */
    getMod : function(elem, modName) {
        var elemClass;

        if (elem && modName && blocks[elemClass = this.__self._buildElemClass(elem)]) {
            return this.__base.call(this.findBlockOn(elem, elemClass), modName);
        }
        return this.__base(elem, modName);
    },

    /**
     * Delegates native getMods helper to element's instance
     * @protected
     * @param {jQuery} [elem] Nested element
     * @param {String} [modName1, ..., modNameN] Modifier names
     * @returns {Object} Hash of modifier values
     */
    getMods : function(elem) {
        var elemClass;

        if (elem && typeof elem !== 'string' && blocks[elemClass = this.__self._buildElemClass(elem)]) {
            return this.__base.apply(this.findBlockOn(elem, elemClass), slice.call(arguments, 1));
        }
        return this.__base.apply(this, arguments);
    },

    /**
     * Delegates native setMod helper to element's instances
     * @protected
     * @param {jQuery} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @returns {BEM}
     */
    setMod : function(elem, modName, modVal) {
        var elemClass;

        if (elem && typeof modVal !== 'undefined' && blocks[elemClass = this.__self._buildElemClass(elem)]) {
            this
                .findBlocksOn(elem, elemClass)
                .forEach(function(instance) {
                    this.__base.call(instance, modName, modVal);
                }, this);
            return this;
        }
        return this.__base(elem, modName, modVal);
    },

    /**
     * Returns and initializes (if necessary) the parent block of current element
     * @returns {BEM}
     */
    getParent : function() {
        return this._parent || (this._parent = this.findBlockOutside(this.__self._blockName));
    },

    /**
     * Executes handlers for setting modifiers
     * If element sets modifier to itself, it executes onElemSetMod handlers of the parent block
     * @private
     * @param {String} elemName Element name
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {Array} modFnParams Handler parameters
     */
    _callModFn : function(elemName, modName, modVal, modFnParams) {
        var result = this.__base.apply(this, arguments),
            elemClass;

        if (this.__self._elemName) {
            this.__base.call(
                this.getParent(),
                this.__self._elemName,
                modName,
                modVal,
                [ this.domElem ].concat(modFnParams)
            )
                === false && (result = false);
        }
        return result;
    },

    /**
     * Finds elements of the parent block nested in the current element
     * @protected
     * @param {jQuery} [ctx=this.domElem] Element where search is being performed
     * @param {String} names Nested element name (or names separated by spaces)
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @param {Boolean} [strictMode=false]
     * @returns {jQuery} DOM elements
     */
    findElem : function(ctx, names, modName, modVal, strictMode) {
        if(typeof ctx === 'string') {
            strictMode = modVal;
            modVal = modName;
            modName = names;
            names = ctx;
            ctx = this.domElem;
        }

        if(typeof modName === 'boolean') {
            strictMode = modName;
            modName = undefined;
        }

        var _self = this.__self,
            selector = '.' +
                names.split(' ').map(function(name) {
                    return _self.buildClass(name, modName, modVal);
                }).join(',.'),
            res = ctx.find(selector).add(ctx.filter(selector)); // findDomElem

        if(!strictMode) return res;

        var blockSelector = this.buildSelector(''),
            domElem = _self._elemName? this.domElem.closest(blockSelector) : this.domElem;
        return res.filter(function() {
            return domElem.index($(this).closest(blockSelector)) > -1;
        });
    },

    /**
     * Lazy search (caches results) for the first instance of defined element and intializes it (if necessary)
     * @param {String|jQuery} elem Element
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {BEM}
     */
    elemInstance : function() {
        return this._elemInstances(arguments, 'elem', 'findBlockOn');
    },

    /**
     * Lazy search (caches results) for instances of defined elements and intializes it (if necessary)
     * @param {String|jQuery} elem Element
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {BEM[]}
     */
    elemInstances : function() {
        return this._elemInstances(arguments, 'elem', 'findBlocksOn');
    },

    /**
     * Finds the first instance of defined element and intializes it (if necessary)
     * @param {jQuery} [ctx=this.domElem] Element where search is being performed
     * @param {String|jQuery} elem Element
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @param {Boolean} [strictMode=false]
     * @returns {BEM}
     */
    findElemInstance : function() {
        return this._elemInstances(arguments, 'findElem', 'findBlockOn');
    },

    /**
     * Finds instances of defined elements and intializes it (if necessary)
     * @param {jQuery} [ctx=this.domElem] Element where search is being performed
     * @param {String|jQuery} elem Element
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @param {Boolean} [strictMode=false]
     * @returns {BEM[]}
     */
    findElemInstances : function() {
        return this._elemInstances(arguments, 'findElem', 'findBlocksOn');
    },

    _elemInstances : function(args, findElemMethod, findBlockMethod) {
        var elem = args[0],
            isString = typeof elem === 'string',
            elemClass;

        if (args.length === 1 && !isString) {
            elemClass = this.__self._buildElemClass(elem);
        } else {
            elemClass = buildClass(this.__self._blockName, args[isString? 0 : 1]);
            elem = this[findElemMethod].apply(this, args);
        }
        return this[findBlockMethod](elem, elemClass);
    },

    /**
     * Finds elements outside the context or current element
     * @param {jQuery} [ctx=this.domElem] context (current element by default)
     * @param {String} elemName Element name
     * @returns {jQuery} DOM elements
     */
    closestElem : function(ctx, elemName) {
        return ctx && elemName?
            this.__base(ctx, elemName) :
            this.__base(this.domElem, elemName || ctx);
    },

    /**
     * Finds instance of defined element outside the context or current element
     * @param {jQuery} [ctx=this.domElem] context (current element by default)
     * @param {String} elemName Element name
     * @returns {BEM}
     */
    closestElemInstance : function(ctx, elemName) {
        return this.findBlockOn(
            this.closestElem.apply(this, arguments),
            buildClass(this.__self._blockName, elemName || ctx));
    }

}, {

    /**
     * Helper for live initialization for a parent block's event
     * @static
     * @protected
     * @param {String} event Event name
     * @param {Function} [callback] Handler to be called after successful initialization in the new element's context
     */
    liveInitOnParentEvent : function(event, callback) {
        var name = this._elemName;
        blocks[this._blockName].on(event, function(e) {
            var args = arguments,
                elems = e.target.findElemInstances(name, true);

            callback && elems.forEach(function(elem) {
                callback.apply(elem, args);
            });
        });
        return this;
    },

    /**
     * Builds a CSS class corresponding to the element's instance with extraction it's name form the specified DOM element
     * @param {jQuery} elem Element
     * @returns {String}
     */
    _buildElemClass : function(elem) {
        return buildClass(this._blockName, this._extractElemNameFrom(elem));
    },

    /**
     * Builds a CSS class corresponding to the block/element and modifier
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildClass : function(elem, modName, modVal) {
        return this._elemName && elem && (modVal || !modName)?
            buildClass(this._blockName, elem, modName, modVal) :
            buildClass(this._name, elem, modName, modVal);
    },

    /**
     * Builds a prefix for the CSS class of a DOM element or nested element of the block, based on modifier name
     * @static
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery|String} [elem] Element
     * @returns {String}
     */
    _buildModClassPrefix : function(modName, elem) {
        return buildClass(elem? this._blockName : this._name) +
               (elem?
                   ELEM_DELIM + (typeof elem === 'string'? elem : this._extractElemNameFrom(elem)) :
                   '') +
               MOD_DELIM + modName + MOD_DELIM;
    },

    /**
     * Builds a regular expression for extracting names of elements nested in a block
     * @static
     * @private
     * @returns {RegExp}
     */
    _buildElemNameRE : function() {
        return new RegExp(this._blockName + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');
    }

});

provide(DOM);

});
