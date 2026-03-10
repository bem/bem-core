/**
 * @module uri__querystring
 * @description A set of helpers to work with query strings
 */

import uri from 'bem:uri'

function addParam(res, name, val) {
    res.push(encodeURIComponent(name) + '=' + (val == null? '' : encodeURIComponent(val)))
}

export default {
    /**
     * Parse a query string to an object
     * @param {String} str
     * @returns {Object}
     */
    parse(str) {
        if(!str) {
            return {}
        }

        return str.split('&').reduce(
            (res, pair) => {
                if(!pair) {
                    return res
                }

                const eq = pair.indexOf('=')
                let name, val

                if(eq >= 0) {
                    name = pair.substr(0, eq)
                    val = pair.substr(eq + 1)
                } else {
                    name = pair
                    val = ''
                }

                name = uri.decodeURIComponent(name)
                val = uri.decodeURIComponent(val)

                Object.hasOwn(res, name)?
                    Array.isArray(res[name])?
                        res[name].push(val) :
                        res[name] = [res[name], val] :
                    res[name] = val

                return res
            },
            {})
    },

    /**
     * Serialize an object to a query string
     * @param {Object} obj
     * @returns {String}
     */
    stringify(obj) {
        return Object.keys(obj)
            .reduce(
                (res, name) => {
                    const val = obj[name]
                    Array.isArray(val)?
                        val.forEach(function(val) {
                            addParam(res, name, val)
                        }) :
                        addParam(res, name, val)
                    return res
                },
                [])
            .join('&')
    }
}
