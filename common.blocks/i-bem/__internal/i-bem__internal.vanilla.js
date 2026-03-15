/**
 * @module i-bem__internal
 */

/**
 * Separator for modifiers and their values
 * @const
 * @type String
 */
const MOD_DELIM = '_'

/**
 * Separator between names of a block and a nested element
 * @const
 * @type String
 */
const ELEM_DELIM = '__'

/**
 * Pattern for acceptable element and modifier names
 * @const
 * @type String
 */
const NAME_PATTERN = '[a-zA-Z0-9-]+'

function isSimple(obj) {
    const typeOf = typeof obj
    return typeOf === 'string' || typeOf === 'number' || typeOf === 'boolean'
}

function buildModPostfix(modName, modVal) {
    let res = ''
    if(modVal != null && modVal !== false) {
        res += MOD_DELIM + modName
        modVal !== true && (res += MOD_DELIM + modVal)
    }
    return res
}

function buildBlockClassName(name, modName, modVal) {
    return name + buildModPostfix(modName, modVal)
}

function buildElemClassName(block, name, modName, modVal) {
    return buildBlockClassName(block, undefined, undefined) +
        ELEM_DELIM + name +
        buildModPostfix(modName, modVal)
}

export default {
    NAME_PATTERN,

    MOD_DELIM,
    ELEM_DELIM,

    buildModPostfix,

    /**
     * Builds the class name of a block or element with a modifier
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String|Number} [modVal] Modifier value
     * @returns {String} Class name
     */
    buildClassName(block, elem, modName, modVal) {
        if(isSimple(modName)) {
            if(!isSimple(modVal)) {
                modVal = modName
                modName = elem
                elem = undefined
            }
        } else if(typeof modName !== 'undefined') {
            modName = undefined
        } else if(elem && typeof elem !== 'string') {
            elem = undefined
        }

        if(!(elem || modName)) { // optimization for simple case
            return block
        }

        return elem?
            buildElemClassName(block, elem, modName, modVal) :
            buildBlockClassName(block, modName, modVal)
    },

    /**
     * Builds full class names for a buffer or element with modifiers
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {Object} [mods] Modifiers
     * @returns {String} Class
     */
    buildClassNames(block, elem, mods) {
        if(elem && typeof elem !== 'string') {
            mods = elem
            elem = undefined
        }

        let res = elem?
            buildElemClassName(block, elem, undefined, undefined) :
            buildBlockClassName(block, undefined, undefined)

        if(mods) {
            for(const [modName, modVal] of Object.entries(mods)) {
                if(modVal) {
                    res += ' ' + (elem?
                        buildElemClassName(block, elem, modName, modVal) :
                        buildBlockClassName(block, modName, modVal))
                }
            }
        }

        return res
    }
}
