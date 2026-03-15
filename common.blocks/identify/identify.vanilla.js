/**
 * @module identify
 */

let counter = 0
const expando = '__' + (+new Date),
  get = () => 'uniq' + (++counter),
  identify = obj => {
    if((typeof obj === 'object' && obj !== null) || typeof obj === 'function') {
      let key
      if('uniqueID' in obj) {
        obj === globalThis.document && (obj = obj.documentElement)
        key = 'uniqueID'
      } else {
        key = expando
      }
      return key in obj
        ? obj[key]
        : obj[key] = get()
    }

    return ''
  }

export default
  /**
   * Makes unique ID
   * @param {...Object} obj Object that needs to be identified
   * @returns {String} ID
   */
  function(obj) {
    if(arguments.length) {
      if(arguments.length === 1) {
        return identify(obj)
      }

      const res = []
      for(const arg of arguments)
        res.push(identify(arg))
      return res.sort().join('')
    }

    return get()
  }
