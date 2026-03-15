/**
 * @module loader_type_bundle
 * @description Load BEM bundle (JS+CSS) from external URL.
 */

const LOADING_TIMEOUT = 30000
const doc = document
let head
const bundles = new Map()

const handleError = (bundleId) => {
    const bundleDesc = bundles.get(bundleId)

    if(!bundleDesc) return

    const fns = bundleDesc.errorFns

    clearTimeout(bundleDesc.timer)

    for(const fn of fns) fn()
    bundles.delete(bundleId)
}

const appendCss = (css) => {
    const style = doc.createElement('style')
    style.type = 'text/css'
    head.appendChild(style)
    style.appendChild(doc.createTextNode(css))
}

/**
 * Loads bundle
 * @param {String} id
 * @param {String} url
 * @param {Function} onSuccess
 * @param {Function} [onError]
 */
const load = (id, url, onSuccess, onError) => {
    const bundle = bundles.get(id)
    if(bundle) {
        if(bundle.successFns) { // bundle is being loaded
            bundle.successFns.push(onSuccess)
            onError && bundle.errorFns.push(onError)
        } else { // bundle was loaded before
            setTimeout(onSuccess, 0)
        }
        return
    }

    const script = doc.createElement('script')
    const errorFn = () => {
        handleError(id)
    }

    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.src = url
    script.onerror = errorFn // for browsers that support
    setTimeout(() => {
        (head || (head = doc.getElementsByTagName('head')[0])).insertBefore(script, head.firstChild)
    }, 0)

    bundles.set(id, {
        successFns : [onSuccess],
        errorFns : onError? [onError] : [],
        timer : setTimeout(errorFn, LOADING_TIMEOUT)
    })
}

load._loaded = (bundle) => {
    const bundleDesc = bundles.get(bundle.id)

    if(!bundleDesc) return

    clearTimeout(bundleDesc.timer)

    bundle.js && bundle.js.call(globalThis)

    bundle.css && appendCss(bundle.css)

    if(bundle.hcss) {
        const styles = []
        const _ycssjs = window._ycssjs

        bundle.hcss.forEach((hsh) => {
            if(_ycssjs) {
                if(hsh[0] in _ycssjs) return
                _ycssjs(hsh[0])
            }

            styles.push(hsh[1])
        })

        styles.length && appendCss(styles.join(''))
    }

    const onSuccess = () => {
        const fns = bundleDesc.successFns
        for(const fn of fns) fn()
        delete bundleDesc.successFns
    }

    onSuccess()
}

export default load
