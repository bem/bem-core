(function(global) {

var DECL_STATES = {
        NOT_RESOLVED : 0,
        IN_RESOLVING : 1,
        RESOLVED     : 2
    },

    curOptions = {
        trackCircularDependencies : true
    },

    undef,
    modulesStorage = {},
    declsToCalc = [],
    waitForNextTick = false,
    pendingRequires = [],

    /**
     * Defines module
     * @param {String} name
     * @param {String[]} deps
     * @param {Function} declFn
     */
    define = function(name, deps, declFn) {
        if(!declFn) {
            declFn = deps;
            deps = [];
        }

        var module = modulesStorage[name] || (modulesStorage[name] = {
                name : name,
                decl : undef
            });

        declsToCalc.push(module.decl = {
            name          : name,
            fn            : declFn,
            state         : DECL_STATES.NOT_RESOLVED,
            deps          : deps,
            prevDecl      : module.decl,
            dependOnDecls : [],
            dependents    : [],
            exports       : undef
        });
    },

    /**
     * Requires modules
     * @param {String[]} modules
     * @param {Function} cb
     */
    require = function(modules, cb) {
        if(!waitForNextTick) {
            waitForNextTick = true;
            nextTick(onNextTick);
        }

        pendingRequires.push({ modules : modules, cb : cb });
    },

    onNextTick = function() {
        waitForNextTick = false;
        calcDeclDeps();
        applyRequires();
    },

    calcDeclDeps = function() {
        var i = 0, decl, j, dep, dependOnDecls;
        while(decl = declsToCalc[i++]) {
            j = 0;
            dependOnDecls = decl.dependOnDecls;
            while(dep = decl.deps[j++]) {
                modulesStorage[dep] || throwModuleNotFound(dep, decl);
                dependOnDecls.push(modulesStorage[dep].decl);
            }
            decl.deps = undef;

            if(decl.prevDecl) {
                dependOnDecls.push(decl.prevDecl);
                decl.prevDecl = undef;
            }
        }

        declsToCalc = [];
    },

    applyRequires = function() {
        var pendingRequire, i = 0, j, dep, dependOnDecls;
        while(pendingRequire = pendingRequires[i++]) {
            j = 0; dependOnDecls = [];
            while(dep = pendingRequire.modules[j++]) {
                modulesStorage[dep] || throwModuleNotFound(dep);
                dependOnDecls.push(modulesStorage[dep].decl);
            }
            applyRequire(dependOnDecls, pendingRequire.cb);
        }

        pendingRequires = [];
    },

    applyRequire = function(dependOnDecls, cb) {
        requireDecls(
            dependOnDecls,
            function(exports) {
                cb.apply(null, exports);
            },
            []);
    },

    requireDecls = function(decls, cb, path) {
        var unresolvedDeclCnt = decls.length,
            checkUnresolved = true;

        if(unresolvedDeclCnt) {
            var onDeclResolved = function() {
                    --unresolvedDeclCnt || onDeclsResolved(decls, cb);
                },
                i = 0, decl;

            while(decl = decls[i++]) {
                if(decl.state === DECL_STATES.RESOLVED) {
                    --unresolvedDeclCnt;
                }
                else {
                    if(curOptions.trackCircularDependencies && isDependenceCircular(decl, path)) {
                        throwCircularDependenceDetected(decl, path);
                    }

                    decl.state === DECL_STATES.NOT_RESOLVED && startDeclResolving(decl, path);

                    if(decl.state === DECL_STATES.RESOLVED) { // decl was resolved synchronously
                        --unresolvedDeclCnt;
                    }
                    else {
                        decl.dependents.push(onDeclResolved);
                        checkUnresolved = false;
                    }
                }
            }
        }

        if(checkUnresolved && !unresolvedDeclCnt) {
            onDeclsResolved(decls, cb);
        }
    },

    onDeclsResolved = function(decls, cb) {
        var exports = [],
            i = 0, decl;
        while(decl = decls[i++]) {
            exports.push(decl.exports);
        }
        cb(exports);
    },

    startDeclResolving = function(decl, path) {
        curOptions.trackCircularDependencies && (path = path.slice()).push(decl);
        decl.state = DECL_STATES.IN_RESOLVING;
        requireDecls(
            decl.dependOnDecls,
            function(depDeclsExports) {
                decl.fn.apply(
                    null,
                    [function(exports) {
                        provideDecl(decl, exports);
                    }].concat(depDeclsExports));
            },
            path);
    },

    provideDecl = function(decl, exports) {
        decl.exports = exports;
        decl.state = DECL_STATES.RESOLVED;

        var i = 0, dependent;
        while(dependent = decl.dependents[i++]) {
            dependent(decl.exports);
        }

        decl.dependents = undef;
    },

    isDependenceCircular = function(decl, path) {
        var i = 0, pathDecl;
        while(pathDecl = path[i++]) {
            if(decl === pathDecl) {
                return true;
            }
        }
        return false;
    },

    options = function(inputOptions) {
        for(var name in inputOptions) {
            if(inputOptions.hasOwnProperty(name)) {
                curOptions[name] = inputOptions[name];
            }
        }
    },

    throwModuleNotFound = function(name, decl) {
        throw Error(
            decl?
                'Module "' + decl.name + '": can\'t resolve dependence "' + name + '"' :
                'Can\'t resolve required module "' + name + '"');
    },

    throwCircularDependenceDetected = function(decl, path) {
        var strPath = [],
            i = 0, pathDecl;
        while(pathDecl = path[i++]) {
            strPath.push(pathDecl.name);
        }
        strPath.push(decl.name);

        throw Error('Circular dependence detected "' + strPath.join(' -> ') + '"');
    },

    nextTick = (function() {
        if(typeof process === 'object') { // nodejs
            return process.nextTick;
        }

        if(global.setImmediate) { // ie10
            return global.setImmediate;
        }

        var fns = [],
            callFns = function() {
                var fnsToCall = fns, i = 0, len = fns.length;
                fns = [];
                while(i < len) {
                    fnsToCall[i++]();
                }
            };

        if(global.postMessage) { // modern browsers
            var isPostMessageAsync = true;
            if(global.attachEvent) {
                var checkAsync = function() {
                        isPostMessageAsync = false;
                    };
                global.attachEvent('onmessage', checkAsync);
                global.postMessage('__checkAsync', '*');
                global.detachEvent('onmessage', checkAsync);
            }

            if(isPostMessageAsync) {
                var msg = '__modules' + +new Date,
                    onMessage = function(e) {
                        if(e.data === msg) {
                            e.stopPropagation && e.stopPropagation();
                            callFns();
                        }
                    };

                global.addEventListener?
                    global.addEventListener('message', onMessage, true) :
                    global.attachEvent('onmessage', onMessage);

                return function(fn) {
                    fns.push(fn) === 1 && global.postMessage(msg, '*');
                };
            }
        }

        var doc = global.document;
        if('onreadystatechange' in doc.createElement('script')) { // ie6-ie8
            var createScript = function() {
                    var script = doc.createElement('script');
                    script.onreadystatechange = function() {
                        script.parentNode.removeChild(script);
                        script = script.onreadystatechange = null;
                        callFns();
                };
                (doc.documentElement || doc.body).appendChild(script);
            };

            return function(fn) {
                fns.push(fn) === 1 && createScript();
            };
        }

        return function(fn) { // old browsers
            setTimeout(fn, 0);
        };
    })(),

    api = {
        define  : define,
        require : require,
        options : options
    };

if(typeof exports === 'object') {
    module.exports = api;
}
else {
    global.modules = api;
}

})(this);