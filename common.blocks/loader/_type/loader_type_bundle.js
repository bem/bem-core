/**
 * @module loader_type_bundle
 * @description Load BEM bundle (JS+CSS) from external URL.
 */

modules.define('loader_type_bundle', function(provide) {

var LOADING_TIMEOUT = 30000,
    global = this.global,
    doc = document,
    head,
    bundles = {},

    handleError = function(bundleId) {
        var bundleDesc = bundles[bundleId];

        if(!bundleDesc) return;

        var fns = bundleDesc.errorFns,
            fn;

        clearTimeout(bundleDesc.timer);

        while(fn = fns.shift()) fn();
        delete bundles[bundleId];
    },

    appendCss = function(css) {
        var style = doc.createElement('style');
        style.type = 'text/css';
        head.appendChild(style); // ie needs to insert style before setting content
        style.styleSheet?
            style.styleSheet.cssText = css :
            style.appendChild(doc.createTextNode(css));
    },

    /**
     * Loads bundle
     * @exports
     * @param {String} id
     * @param {String} url
     * @param {Function} onSuccess
     * @param {Function} [onError]
     */
    load = function(id, url, onSuccess, onError) {
        var bundle = bundles[id];
        if(bundle) {
            if(bundle.successFns) { // bundle is being loaded
                bundle.successFns.push(onSuccess);
                onError && bundle.errorFns.push(onError);
            } else { // bundle was loaded before
                setTimeout(onSuccess, 0);
            }
            return;
        }

        var script = doc.createElement('script'),
            errorFn = function() {
                handleError(id);
            };

        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.src = url;
        script.onerror = errorFn; // for browsers that support
        setTimeout(function() {
            (head || (head = doc.getElementsByTagName('head')[0])).insertBefore(script, head.firstChild);
        }, 0);

        bundles[id] = {
            successFns : [onSuccess],
            errorFns : onError? [onError] : [],
            timer : setTimeout(errorFn, LOADING_TIMEOUT)
        };
    };

load._loaded = function(bundle) {
    var bundleDesc = bundles[bundle.id];

    if(!bundleDesc) return;

    clearTimeout(bundleDesc.timer);

    bundle.js && bundle.js.call(global);

    bundle.css && appendCss(bundle.css);

    if(bundle.hcss) {
        var styles = [],
            _ycssjs = window._ycssjs;

        bundle.hcss.forEach(function(hsh) {
            if(_ycssjs) {
                if(hsh[0] in _ycssjs) return;
                _ycssjs(hsh[0]);
            }

            styles.push(hsh[1]);
        });

        styles.length && appendCss(styles.join(''));
    }

    function onSuccess() {
        var fns = bundleDesc.successFns, fn;
        while(fn = fns.shift()) fn();
        delete bundleDesc.successFns;
    }

    modules.isDefined('i-bem__dom_init')?
        modules.require(['i-bem__dom_init'], onSuccess) :
        onSuccess();
};

provide(load);

});
