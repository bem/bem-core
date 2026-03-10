/**
 * @module inherit
 * @version 2.2.6
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 */

const noop = () => {},
  extend = (o1, o2) => {
    if(o2) {
      for(const [key, val] of Object.entries(o2))
        o1[key] = val
    }
    return o1
  },
  toStr = Object.prototype.toString,
  isFunction = obj => toStr.call(obj) === '[object Function]'

function override(base, res, add) {
  for(const name of Object.keys(add)) {
    if(name === '__self') continue

    const prop = add[name]
    if(isFunction(prop) &&
        (!prop.prototype || !prop.prototype.__self) &&
        (prop.toString().indexOf('.__base') > -1)) {
      res[name] = (name => {
        const baseMethod = base[name]
            ? base[name]
            : name === '__constructor'
              ? res.__self.__parent
              : noop,
          result = function() {
            const baseSaved = this.__base
            this.__base = result.__base
            const res = prop.apply(this, arguments)
            this.__base = baseSaved
            return res
          }
        result.__base = baseMethod
        return result
      })(name)
    } else {
      res[name] = prop
    }
  }
}

function applyMixins(mixins, res) {
  for(let i = 1; i < mixins.length; i++) {
    const mixin = mixins[i]
    res
      ? isFunction(mixin)
        ? inherit.self(res, mixin.prototype, mixin)
        : inherit.self(res, mixin)
      : res = isFunction(mixin)
        ? inherit(mixins[0], mixin.prototype, mixin)
        : inherit(mixins[0], mixin)
  }
  return res || mixins[0]
}

/**
* Creates class
* @param {Function|Array} [baseClass|baseClassAndMixins] class (or class and mixins) to inherit from
* @param {Object} prototypeFields
* @param {Object} [staticFields]
* @returns {Function} class
*/
function inherit() {
  const args = arguments,
    withMixins = Array.isArray(args[0]),
    hasBase = withMixins || isFunction(args[0]),
    base = hasBase ? withMixins ? applyMixins(args[0]) : args[0] : noop,
    props = args[hasBase ? 1 : 0] || {},
    staticProps = args[hasBase ? 2 : 1],
    res = props.__constructor || (hasBase && base.prototype && base.prototype.__constructor)
      ? function() {
          return this.__constructor.apply(this, arguments)
        }
      : hasBase
        ? function() {
            return base.apply(this, arguments)
          }
        : function() {}

  if(!hasBase) {
    res.prototype = props
    res.prototype.__self = res.prototype.constructor = res
    return extend(res, staticProps)
  }

  extend(res, base)

  res.__parent = base

  const basePtp = base.prototype,
    resPtp = res.prototype = Object.create(basePtp)

  resPtp.__self = resPtp.constructor = res

  props && override(basePtp, resPtp, props)
  staticProps && override(base, res, staticProps)

  return res
}

inherit.self = function() {
  const args = arguments,
    withMixins = Array.isArray(args[0]),
    base = withMixins ? applyMixins(args[0], args[0][0]) : args[0],
    props = args[1],
    staticProps = args[2],
    basePtp = base.prototype

  props && override(basePtp, basePtp, props)
  staticProps && override(base, base, staticProps)

  return base
}

export default inherit
