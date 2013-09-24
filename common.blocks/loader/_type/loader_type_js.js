/**
 * @module loader_type_js
 * @version 1.0.0
 * @author Filatov Dmitry <dfilatov@yandex-team.ru>
 */

modules.define('loader_type_js', function(provide) {

var loading = {},
    loaded = {},
    head = document.getElementsByTagName('head')[0],
    onLoad = function(path) {
        loaded[path] = true;
        var cbs = loading[path], cb, i = 0;
        delete loading[path];
        while(cb = cbs[i++]) {
            cb();
        }
    };

provide(function(path, cb) {
    if(loaded[path]) {
        cb();
        return;
    }

    if(loading[path]) {
        loading[path].push(cb);
        return;
    }

    loading[path] = [cb];

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = (location.protocol === 'file:' && !path.indexOf('//')? 'http:' : '') + path;
    script.onreadystatechange === null?
        script.onreadystatechange = function() {
            var readyState = this.readyState;
            if(readyState === 'loaded' || readyState === 'complete') {
                script.onreadystatechange = null;
                onLoad(path);
            }
        } :
        script.onload = script.onerror = function() {
            script.onload = script.onerror = null;
            onLoad(path);
        };

    head.insertBefore(script, head.lastChild);
});

});
