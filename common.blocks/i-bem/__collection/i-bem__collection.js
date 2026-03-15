/**
 * @module i-bem__collection
 */
import inherit from 'bem:inherit'

/**
 * @class BemCollection
 */
const BemCollection = inherit(/** @lends BemCollection.prototype */{
    /**
     * @constructor
     * @param {Array} entities BEM entities
     */
    __constructor(entities) {
        const _entities = this._entities = []
        const uniq = {}
        ;(Array.isArray(entities) ? entities : [...arguments]).forEach((entity) => {
            if(!uniq[entity._uniqId]) {
                uniq[entity._uniqId] = true
                _entities.push(entity)
            }
        })
    },

    /**
     * Sets the modifier for entities in Collection.
     * @param {String} modName Modifier name
     * @param {String|Boolean} [modVal=true] Modifier value. If not of type String or Boolean, it is casted to String
     * @returns {Collection} this
     */
    setMod : buildForEachEntityMethodProxyFn('setMod'),

    /**
     * Sets multiple modifiers at once for entities in Collection.
     * @param {Object} mods Hash of modifiers (modName: modVal)
     * @returns {Collection} this
     */
    setMods : buildForEachEntityMethodProxyFn('setMods'),

    /**
     * Removes the modifier from entities in Collection.
     * @param {String} modName Modifier name
     * @returns {Collection} this
     */
    delMod : buildForEachEntityMethodProxyFn('delMod'),

    /**
     * Sets a modifier for entities in Collection, depending on conditions.
     * If the condition parameter is passed: when true, modVal1 is set; when false, modVal2 is set.
     * If the condition parameter is not passed: modVal1 is set if modVal2 was set, or vice versa.
     * @param {String} modName Modifier name
     * @param {String} modVal1 First modifier value
     * @param {String} [modVal2] Second modifier value
     * @param {Boolean} [condition] Condition
     * @returns {Collection} this
     */
    toggleMod : buildForEachEntityMethodProxyFn('toggleMod'),

    /**
     * Checks whether every entity in Collection has a modifier.
     * @param {String} modName Modifier name
     * @param {String|Boolean} [modVal] Modifier value. If not of type String or Boolean, it is casted to String
     * @returns {Boolean}
     */
    everyHasMod : buildComplexProxyFn('every', 'hasMod'),

    /**
     * Checks whether some entities in Collection has a modifier.
     * @param {String} modName Modifier name
     * @param {String|Boolean} [modVal] Modifier value. If not of type String or Boolean, it is casted to String
     * @returns {Boolean}
     */
    someHasMod : buildComplexProxyFn('some', 'hasMod'),

    /**
     * Returns entity by index.
     * @param {Number} i Index
     * @returns {BemEntity}
     */
    get(i) {
        return this._entities[i]
    },

    /**
     * Calls callback once for each entity in collection.
     * @param {Function} fn Callback
     * @param {Object} ctx Callback context
     */
    forEach : buildEntitiesMethodProxyFn('forEach'),

    /**
     * Creates an array with the results of calling callback on every entity in collection.
     * @param {Function} fn Callback
     * @param {Object} ctx Callback context
     * @returns {Array}
     */
    map : buildEntitiesMethodProxyFn('map'),

    /**
     * Applies callback against an accumulator and each entity in collection (from left-to-right)
     * to reduce it to a single value.
     * @param {Function} fn Callback
     * @param {Object} [initial] Initial value
     * @returns {Array}
     */
    reduce : buildEntitiesMethodProxyFn('reduce'),

    /**
     * Applies callback against an accumulator and each entity in collection (from right-to-left)
     * to reduce it to a single value.
     * @param {Function} fn Callback
     * @param {Object} [initial] Initial value
     * @returns {Array}
     */
    reduceRight : buildEntitiesMethodProxyFn('reduceRight'),

    /**
     * Creates a new collection with all entities that pass the test implemented by the provided callback.
     * @param {Function} fn Callback
     * @param {Object} ctx Callback context
     * @returns {Collection}
     */
    filter(...args) {
        return new this.__self(buildEntitiesMethodProxyFn('filter').apply(this, args))
    },

    /**
     * Tests whether some entities in the collection passes the test implemented by the provided callback.
     * @param {Function} fn Callback
     * @param {Object} ctx Callback context
     * @returns {Boolean}
     */
    some : buildEntitiesMethodProxyFn('some'),

    /**
     * Tests whether every entities in the collection passes the test implemented by the provided callback.
     * @param {Function} fn Callback
     * @param {Object} ctx Callback context
     * @returns {Boolean}
     */
    every : buildEntitiesMethodProxyFn('every'),

    /**
     * Returns a boolean asserting whether an entity is present in the collection.
     * @param {BemEntity} entity BEM entity
     * @returns {Boolean}
     */
    has(entity) {
        return this._entities.includes(entity)
    },

    /**
     * Returns an entity, if it satisfies the provided testing callback.
     * @param {Function} fn Callback
     * @param {Object} ctx Callback context
     * @returns {BemEntity}
     */
    find(fn, ctx) {
        return this._entities.find((entity, i) => fn.call(ctx || this, entity, i, this)) || null
    },

    /**
     * Returns a new collection comprised of collection on which it is called joined with
     * the collection(s) and/or array(s) and/or entity(es) provided as arguments.
     * @param {...(Collection|Array|BemEntity)} args
     * @returns {Collection}
     */
    concat(...args) {
        const argsForConcat = args.map((arg) =>
            arg instanceof BemCollection ? arg._entities : arg)

        return new this.__self(this._entities.concat(...argsForConcat))
    },

    /**
     * Returns size of the collection.
     * @returns {Number}
     */
    size() {
        return this._entities.length
    },

    /**
     * Converts the collection into array.
     * @returns {Array}
     */
    toArray() {
        return this._entities.slice()
    }
})

function buildForEachEntityMethodProxyFn(methodName) {
    return function(...args) {
        this._entities.forEach((entity) => {
            entity[methodName].apply(entity, args)
        })
        return this
    }
}

function buildEntitiesMethodProxyFn(methodName) {
    return function(...args) {
        const entities = this._entities
        return entities[methodName].apply(entities, args)
    }
}

function buildComplexProxyFn(arrayMethodName, entityMethodName) {
    return function(...args) {
        return this._entities[arrayMethodName]((entity) =>
            entity[entityMethodName].apply(entity, args))
    }
}

export default BemCollection
