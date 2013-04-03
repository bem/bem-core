/**
 * Inheritance module
 *
 * Copyright (c) 2010 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.3.5
 */

modules.define('inherit', function(provide) {

var hasIntrospection = (function(){_}).toString().indexOf('_') > -1,
    emptyBase = function() {},
    objCreate = Object.create || function(ptp) {
        var inheritance = function() {};
        inheritance.prototype = ptp;
        return new inheritance();
    },
    objKeys = Object.keys || function(obj) {
        var res = [];
        for(var i in obj) {
            obj.hasOwnProperty(i) && res.push(i);
        }
        return res;
    },
    extend = function(o1, o2) {
        for(var i in o2) {
            o2.hasOwnProperty(i) && (o1[i] = o2[i]);
        }

        return o1;
    },
    toStr = Object.prototype.toString,
    isFunction = function(obj) {
        return toStr.call(obj) === '[object Function]';
    },
    noOp = function() {},
    needCheckProps = true,
    testPropObj = { toString : '' };

for(var i in testPropObj) { // fucking ie hasn't toString, valueOf in for
    testPropObj.hasOwnProperty(i) && (needCheckProps = false);
}

var specProps = needCheckProps? ['toString', 'valueOf'] : null;

function override(base, res, add) {
    var addList = objKeys(add);
    if(needCheckProps) {
        var specProp, i = 0;
        while(specProp = specProps[i++]) {
            add.hasOwnProperty(specProp) && addList.push(specProp);
        }
    }

    var j = 0, len = addList.length,
        name, prop;
    while(j < len) {
        name = addList[j++];
        prop = add[name];
        if(isFunction(prop) &&
                (!hasIntrospection || prop.toString().indexOf('.__base') > -1)) {
            res[name] = (function(name, prop) {
                var baseMethod = base[name] || noOp;
                return function() {
                    var baseSaved = this.__base;
                    this.__base = baseMethod;
                    var res = prop.apply(this, arguments);
                    this.__base = baseSaved;
                    return res;
                };
            })(name, prop);
        }
        else {
            res[name] = prop;
        }
    }
}

provide({
    inherit : function() {
        var args = arguments,
            hasBase = isFunction(args[0]),
            base = hasBase? args[0] : emptyBase,
            props = args[hasBase? 1 : 0] || {},
            staticProps = args[hasBase? 2 : 1],
            res = props.__constructor || (hasBase && base.prototype.__constructor)?
                function() {
                    return this.__constructor.apply(this, arguments);
                } :
                noOp;

        if(!hasBase) {
            res.prototype = props;
            res.prototype.__self = res.prototype.constructor = res;
            return extend(res, staticProps);
        }

        extend(res, base);

        var basePtp = base.prototype,
            resultPtp = res.prototype = objCreate(basePtp);

        resultPtp.__self = resultPtp.constructor = res;

        override(basePtp, resultPtp, props);
        staticProps && override(base, res, staticProps);

        return res;
    },

    inheritSelf : function(base, props, staticProps) {
        var basePtp = base.prototype;

        override(basePtp, basePtp, props);
        staticProps && override(base, base, staticProps);

        return base;
    }
});

});