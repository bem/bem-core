/**
 * @module loader_type_js
 * @description Load JS from external URL.
 */

const loading = new Map()
const loaded = new Map()
const head = document.getElementsByTagName('head')[0]

const runCallbacks = (path, type) => {
    const cbs = loading.get(path)
    loading.delete(path)
    for(const cb of cbs) {
        cb[type] && cb[type]()
    }
}

const onSuccess = (path) => {
    loaded.set(path, true)
    runCallbacks(path, 'success')
}

const onError = (path) => {
    runCallbacks(path, 'error')
}

export default
    /**
     * @param {String} path resource link
     * @param {Function} [success] to be called if the script succeeds
     * @param {Function} [error] to be called if the script fails
     */
    (path, success, error) => {
        if(loaded.has(path)) {
            success && success()
            return
        }

        if(loading.get(path)) {
            loading.get(path).push({ success, error })
            return
        }

        loading.set(path, [{ success, error }])

        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.charset = 'utf-8'
        script.src = (location.protocol === 'file:' && !path.indexOf('//')? 'http:' : '') + path

        script.onload = () => {
            script.onload = script.onerror = null
            onSuccess(path)
        }

        script.onerror = () => {
            script.onload = script.onerror = null
            onError(path)
        }

        head.insertBefore(script, head.lastChild)
    }
