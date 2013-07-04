/** @requires BEM */
/** @requires BEM.INTERNAL */

modules.define(
    'i-bem__dom',
    ['i-bem', 'i-bem__internal'],
    function(provide, BEM, INTERNAL, DOM) {

var buildClass = INTERNAL.buildClass,
    NAME_PATTERN = INTERNAL.NAME_PATTERN,
    MOD_DELIM = INTERNAL.MOD_DELIM,
    ELEM_DELIM = INTERNAL.ELEM_DELIM,
    slice = Array.prototype.slice;

/**
 * Clears the element's modifiers cache
 * TODO костыль, сделать с использованием кэша
 */
function clearElemModCache() {
    var result = this.__base.apply(this, arguments);
    this.__self._elemName && (this._modCache = {});
    return result;
}

BEM.decl('i-bem__dom', {

    getMod : clearElemModCache,
    getMods : clearElemModCache,
    setMod : clearElemModCache,

    /**
     * Returns and initializes (if necessary) the parent block of current element
     * @returns {BEM}
     */
    getParent : function() {
        return this._parent || (this._parent = this.findBlockOutside(this.__self._blockName));
    },

    /**
     * Executes handlers for setting modifiers
     * If block sets modifier to its elements, it executes their onSetMod handlers too (if these elements have their own instances)
     * If element sets modifier to itself, it executes onElemSetMod handlers of parent block
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

        } else if (elemName && BEM.blocks[elemClass = this.__self.buildClass(elemName)]) {

            this.findBlocksOn(modFnParams[0], elemClass).forEach(
                function(elemInstance) {
                    this.__base.call(
                        elemInstance,
                        undefined,
                        modName,
                        modVal,
                        modFnParams.slice(1)
                    )
                        === false && (result = false) },
                this);
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
     * Finds the first instance of defined elements of the current (or parent) block
     * @param {String|jQuery} elem Element
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {BEM}
     */
    elemInstance : function() {
        return this._elemInstances(arguments, 'elem', 'findBlockOn') || null;
    },

    /**
     * Finds instances of defined elements of the current (or parent) block
     * @param {String|jQuery} elem Element
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {BEM[]}
     */
    elemInstances : function() {
        return this._elemInstances(arguments, 'elem', 'findBlocksOn') || [];
    },

    findElemInstance : function() {
        return this._elemInstances(arguments, 'findElem', 'findBlockOn') || null;
    },

    findElemInstances : function() {
        return this._elemInstances(arguments, 'findElem', 'findBlocksOn') || [];
    },

    _elemInstances : function(args, findElemMethod, findBlockMethod) {
        var elem = args[0],
            _self = this.__self,
            blockName = _self._blockName,
            elemClass;

        if (args.length == 1 && typeof elem !== 'string') {
            elemClass = buildClass(blockName, _self._extractElemNameFrom(elem));
        } else {
            if (typeof elem !== 'string') elem = args[1];
            elemClass = buildClass(blockName, elem = elem.replace(/^.+__/, ''));
            elem = this[findElemMethod].apply(this, [elem].concat(slice.call(args, 1), [true]));
        }
        return this[findBlockMethod](elem, elemClass);
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
        return this._liveInitOnBlockEvent(event, this._blockName, callback, 'elemInstances');
    },

    /**
     * Builds a CSS class corresponding to the block/element and modifier
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildClass : function(elem, modName, modVal) {
        return this._elemName && (arguments.length % 2)?
            buildClass(this._blockName, elem, modName, modVal) :
            buildClass(this._name, elem, modName, modVal);
    },

    /**
     * Builds a CSS selector corresponding to the block/element and modifier
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildSelector : function() {
        return '.' + this.buildClass.apply(this, arguments);
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
