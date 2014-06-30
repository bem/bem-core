/**
 * @module i-bem__dom
 */

modules.define(
    'i-bem__dom',
    ['i-bem', 'i-bem__internal', 'jquery'],
    function(provide, BEM, INTERNAL, $, BEMDOM) {

var buildClass = INTERNAL.buildClass,
    NAME_PATTERN = INTERNAL.NAME_PATTERN,
    MOD_DELIM = INTERNAL.MOD_DELIM,
    ELEM_DELIM = INTERNAL.ELEM_DELIM,
    blocks = BEM.blocks,
    slice = Array.prototype.slice;

/**
 * @class BEMDOM
 * @augments BEMDOM
 * @exports
 */
provide(BEMDOM.decl(/** @lends BEMDOM.prototype */{

    /**
     * Delegates native getMod helper to element's instance
     * @protected
     * @param {jQuery} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {String} Modifier value
     */
    getMod : function(elem, modName) {
        var elemClass;

        if(elem && modName && blocks[elemClass = this.__self._buildElemClass(elem)]) {
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

        if(elem && typeof elem !== 'string' && blocks[elemClass = this.__self._buildElemClass(elem)]) {
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

        if(elem && typeof modVal !== 'undefined' && blocks[elemClass = this.__self._buildElemClass(elem)]) {
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
     * Returns and initializes (if necessary) the own block of current element
     * @returns {BEMDOM}
     */
    block : function() {
        return this._block || (this._block = this.findBlockOutside(this.__self._blockName));
    },

    /**
     * Executes handlers for setting modifiers
     * If element sets modifier to itself, it executes onElemSetMod handlers of the own block
     * @private
     * @param {String} prefix
     * @param {String} elemName Element name
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {Array} modFnParams Handler parameters
     */
    _callModFn : function(prefix, elemName, modName, modVal, modFnParams) {
        var result = this.__base.apply(this, arguments),
            selfElemName = this.__self._elemName;

        if(selfElemName) {
            this.__base.call(
                this.block(),
                prefix,
                elemName || selfElemName,
                modName,
                modVal,
                elemName? modFnParams : [this.domElem].concat(modFnParams)
            ) === false && (result = false);
        }
        return result;
    },

    /**
     * Filters results of findElem helper execution in strict mode
     * @param {jQuery} res DOM elements
     * @returns {jQuery} DOM elements
     */
    _filterFindElemResults : function(res) {
        var _self = this.__self,
            blockSelector = '.' + _self._blockName,
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
     * @returns {BEMDOM}
     */
    elemInstance : function() {
        return this._elemInstances(arguments, 'elem', 'findBlockOn');
    },

    /**
     * Lazy search (caches results) for instances of defined elements and intializes it (if necessary)
     * @param {String|jQuery} elem Element
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {BEMDOM[]}
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
     * @returns {BEMDOM}
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
     * @returns {BEMDOM[]}
     */
    findElemInstances : function() {
        return this._elemInstances(arguments, 'findElem', 'findBlocksOn');
    },

    _elemInstances : function(args, findElemMethod, findBlockMethod) {
        var elem = args[0],
            isString = typeof elem === 'string',
            elemClass;

        if(args.length === 1 && !isString) {
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
        if(!elemName) {
            elemName = ctx;
            ctx = this.domElem;
        }
        return this.__base(ctx, elemName);
    },

    /**
     * Finds instance of defined element outside the context or current element
     * @param {jQuery} [ctx=this.domElem] context (current element by default)
     * @param {String} elemName Element name
     * @returns {BEMDOM}
     */
    closestElemInstance : function(ctx, elemName) {
        return this.findBlockOn(
            this.closestElem.apply(this, arguments),
            buildClass(this.__self._blockName, elemName || ctx));
    },

    /**
     * Finds instances of defined elements outside the context or current element
     * @param {jQuery} [ctx=this.domElem] context (current element by default)
     * @param {String} elemName Element name
     * @returns {BEMDOM[]}
     */
    closestElemInstances : function(ctx, elemName) {
        return this.findBlocksOn(
            this.closestElem.apply(this, arguments),
            buildClass(this.__self._blockName, elemName || ctx));
    }

}, /** @lends BEMDOM */{

    /**
     * Auto-declarator for elements
     * @protected
     * @param {Object} name Instance name
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     * @param {Object} [_autoDecl] Auto-declaration flag
     * @returns {Function}
     */
    decl : function(name, props, staticProps, _autoDecl) {
        if(_autoDecl) {
            var names = name.split(ELEM_DELIM);
            return this.__base({ block : names[0], elem : names[1] }, props, staticProps);
        } else {
            return this.__base.apply(this, arguments);
        }
    },

    /**
     * Helper for live initialization for an own block's event
     * @protected
     * @param {String} event Event name
     * @param {Function} [callback] Handler to be called after successful initialization in the new element's context
     * @returns {Function} this
     */
    liveInitOnBlockEvent : function(event, callback) {
        return (typeof callback === 'string')?
            this.__base.apply(this, arguments) :
            this._liveInitOnOwnBlockEvent(event, callback);
    },

    _liveInitOnOwnBlockEvent : function(event, callback) {
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
     * Builds a CSS class corresponding to the element's instance with extraction it's name from the specified DOM element
     * @private
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
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery|String} [elem] Element
     * @returns {String}
     */
    _buildModClassPrefix : function(modName, elem) {
        return (elem?
                   this._blockName + ELEM_DELIM + (typeof elem === 'string'? elem : this._extractElemNameFrom(elem)) :
                   this._name) +
               MOD_DELIM + modName;
    },

    /**
     * Builds a regular expression for extracting names of elements nested in a block
     * @private
     * @returns {RegExp}
     */
    _buildElemNameRE : function() {
        return new RegExp(this._blockName + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');
    }
}));

});
