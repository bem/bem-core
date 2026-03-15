/**
 * @module i-bem-dom__collection
 */
import inherit from 'bem:inherit'
import BemCollection from 'bem:i-bem__collection'

/**
 * @class BemDomCollection
 */
const BemDomCollection = inherit(BemCollection, /** @lends BemDomCollection.prototype */{
    /**
     * Finds the first child block for every entities in collection
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {BemDomCollection}
     */
    findChildBlock : buildProxyMethodForOne('findChildBlock'),

    /**
     * Finds child block for every entities in collections
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {BemDomCollection}
     */
    findChildBlocks : buildProxyMethodForMany('findChildBlocks'),

    /**
     * Finds the first parent block for every entities in collection
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {BemDomCollection}
     */
    findParentBlock : buildProxyMethodForOne('findParentBlock'),

    /**
     * Finds parent block for every entities in collections
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {BemDomCollection}
     */
    findParentBlocks : buildProxyMethodForMany('findParentBlocks'),

    /**
     * Finds first mixed bloc for every entities in collectionk
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {BemDomCollection}
     */
    findMixedBlock : buildProxyMethodForOne('findMixedBlock'),

    /**
     * Finds mixed block for every entities in collections
     * @param {Function|Object} Block Block class or description (block, modName, modVal) of the block to find
     * @returns {BemDomCollection}
     */
    findMixedBlocks : buildProxyMethodForMany('findMixedBlocks'),

    /**
     * Finds the first child elemen for every entities in collectiont
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {BemDomCollection}
     */
    findChildElem : buildProxyMethodForOne('findChildElem'),

    /**
     * Finds child element for every entities in collections
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {BemDomCollection}
     */
    findChildElems : buildProxyMethodForMany('findChildElems'),

    /**
     * Finds the first parent elemen for every entities in collectiont
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {BemDomCollection}
     */
    findParentElem : buildProxyMethodForOne('findParentElem'),

    /**
     * Finds parent element for every entities in collections
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @param {Boolean} [strictMode=false]
     * @returns {BemDomCollection}
     */
    findParentElems : buildProxyMethodForMany('findParentElems'),

    /**
     * Finds the first mixed elemen for every entities in collectiont
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {BemDomCollection}
     */
    findMixedElem : buildProxyMethodForOne('findMixedElem'),

    /**
     * Finds mixed element for every entities in collections
     * @param {Function|String|Object} Elem Element class or name or description elem, modName, modVal
     * @returns {BemDomCollection}
     */
    findMixedElems : buildProxyMethodForMany('findMixedElems'),

    /**
     * Checks whether any entity in collection has a modifier.
     * @param {String} modName Modifier name
     * @param {String|Boolean} [modVal] Modifier value
     * @returns {Boolean}
     */
    hasMod : buildAggregateProxyFn('some', 'hasMod'),

    /**
     * Returns an array of modifier values from all entities in collection.
     * @param {String} modName Modifier name
     * @returns {Array}
     */
    getMod : buildMapProxyFn('getMod'),

    /**
     * Checks whether any entity in collection contains the specified entity.
     * @param {BemDomEntity} entity entity to check
     * @returns {Boolean}
     */
    containsEntity : buildAggregateProxyFn('some', 'containsEntity')
})

function collectionMapMethod(collection, methodName, args) {
    return collection.map((entity) => entity[methodName].apply(entity, args))
}

function buildProxyMethodForOne(methodName) {
    return function() {
        return new BemDomCollection(collectionMapMethod(this, methodName, arguments))
    }
}

function buildAggregateProxyFn(arrayMethodName, entityMethodName) {
    return function(...args) {
        return this._entities[arrayMethodName]((entity) =>
            entity[entityMethodName].apply(entity, args))
    }
}

function buildMapProxyFn(entityMethodName) {
    return function(...args) {
        return this._entities.map((entity) =>
            entity[entityMethodName].apply(entity, args))
    }
}

function buildProxyMethodForMany(methodName) {
    return function() {
        const res = []

        collectionMapMethod(this, methodName, arguments).forEach((collection) => {
            collection.forEach((entity) => {
                res.push(entity)
            })
        })

        return new BemDomCollection(res)
    }
}

export default BemDomCollection
