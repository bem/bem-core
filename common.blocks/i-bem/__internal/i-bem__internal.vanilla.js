/** @fileOverview Module for internal BEM helpers */
/** @requires BEM */

modules.define('i-bem__internal', function(provide) {

/**
 * Separator for modifiers and their values
 * @const
 * @type String
 */
var undef,
    MOD_DELIM = '_',

/**
 * Separator between names of a block and a nested element
 * @const
 * @type String
 */
    ELEM_DELIM = '__',

/**
 * Pattern for acceptable element and modifier names
 * @const
 * @type String
 */
    NAME_PATTERN = '[a-zA-Z0-9-]+';

function isSimple(obj) {
    var typeOf = typeof obj;
    return typeOf === 'string' || typeOf === 'number' || typeOf === 'boolean';
}

function buildModPostfix(modName, modVal, buffer) {
    /* jshint eqnull: true */
    if(modVal != null && modVal !== false) {
        buffer.push(MOD_DELIM, modName);
        modVal !== true && buffer.push(MOD_DELIM, modVal);
    }
}

function buildBlockClass(name, modName, modVal, buffer) {
    buffer.push(name);
    buildModPostfix(modName, modVal, buffer);
}

function buildElemClass(block, name, modName, modVal, buffer) {
    buildBlockClass(block, undef, undef, buffer);
    buffer.push(ELEM_DELIM, name);
    buildModPostfix(modName, modVal, buffer);
}

provide({
    NAME_PATTERN: NAME_PATTERN,

    MOD_DELIM: MOD_DELIM,
    ELEM_DELIM: ELEM_DELIM,

    buildModPostfix: function(modName, modVal, buffer) {
        var res = buffer || [];
        buildModPostfix(modName, modVal, res);
        return buffer? res : res.join('');
    },

    /**
     * Builds the class of a block or element with a modifier
     * @private
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String|Number} [modVal] Modifier value
     * @param {Array} [buffer] Buffer
     * @returns {String|Array} Class or buffer string (depending on whether the buffer parameter is present)
     */
    buildClass: function(block, elem, modName, modVal, buffer) {
        if(isSimple(modName)) {
            if(!isSimple(modVal)) {
                buffer = modVal;
                modVal = modName;
                modName = elem;
                elem = undef;
            }
        } else if(typeof modName !== 'undefined') {
            buffer = modName;
            modName = undef;
        } else if(elem && typeof elem !== 'string') {
            buffer = elem;
            elem = undef;
        }

        if(!(elem || modName || buffer)) { // optimization for simple case
            return block;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, modName, modVal, res) :
            buildBlockClass(block, modName, modVal, res);

        return buffer? res : res.join('');
    },

    /**
     * Builds full classes for a buffer or element with modifiers
     * @private
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {Object} [mods] Modifiers
     * @param {Array} [buffer] Buffer
     * @returns {String|Array} Class or buffer string (depending on whether the buffer parameter is present)
     */
    buildClasses: function(block, elem, mods, buffer) {
        if(elem && typeof elem !== 'string') {
            buffer = mods;
            mods = elem;
            elem = undef;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, undef, undef, res) :
            buildBlockClass(block, undef, undef, res);

        if(mods) {
            for(var modName in mods) {
                if(mods.hasOwnProperty(modName) && mods[modName]) {
                    res.push(' ');
                    elem?
                        buildElemClass(block, elem, modName, mods[modName], res) :
                        buildBlockClass(block, modName, mods[modName], res);
                }
            }
        }

        return buffer? res : res.join('');
    }
});

});