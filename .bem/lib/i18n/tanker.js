var DOM = require('dom-js'),

    QUOTE_CHAR = '"',
    SINGLE_QUOTE_CHAR = "'",

    isArray = Array.isArray,

    isJson = function(obj) {
        try {
            if(isString(obj)) {
                var jsonStart = obj.trim().charAt(0);
                if(jsonStart === '{' || jsonStart === '[')
                    return JSON.parse(obj);
            }
            return false;
        } catch(e) {
            return false;
        }
    },
    isString = function(str) {
        return typeof str === 'string';
    },
    isSimple = function(obj) {
        var type = typeof obj;
        return type === 'string' || type === 'number';
    };


var parseXml = exports.parseXml = function(xml, cb) {

        isSimple(xml) || (xml = JSON.stringify(xml));

        try {
            new DOM.DomJS().parse('<root>' + xml + '</root>', function(err, dom) {
                if(err) return;
                cb(dom.children);
            });
        } catch(e) {
            parseXml(DOM.escape(xml), cb);
        }

    },
    domToJs = exports.domToJs = function(nodes) {

        var code = expandNodes(toCommonNodes(nodes), jsExpander);

        return code.length === 1 &&
            (code[0].charAt(0) === QUOTE_CHAR || code[0].charAt(0) === SINGLE_QUOTE_CHAR ) ?
                code[0] : 'function(params) { return ' + code.join(' + ') + ' }';

    };

exports.xmlToJs = function(xml, cb) {

    parseXml(xml, function(nodes) {
        cb(domToJs(nodes));
    });

};

/**
 * @param {Array|String|Number} node
 * @param {Function} expanderFn
 */
function expandNodes(node, expanderFn) {

    if(isSimple(node)) return node;

    return node.map(function(item) {
        return isSimple(item)? item : expanderFn(item);
    });

}

/**
 * @param {Array} node
 * @returns {String}
 */
function jsExpander(node, _raw) {

    _raw == null && (_raw = false);

    var currentExpander = function(node) {
            return jsExpander(node, _raw);
        },
        rawExpander = function(node) {
            return jsExpander(node, true);
        };

    if(!node) {
        // FIXME: should we throw?
        console.warn('[WARN]: Undefined item');
        return '';
    }

    var nodeclass = node.pop(),
        code;

    switch(nodeclass) {

    case 'TANKER_DYNAMIC':
        // [ keyset, key, [params] ]
        code = expandNodes(node, currentExpander);
        return "this.keyset('" + code[0] + "').key('" + code[1] + "', " + (code[2] || "{}") + ")";

    case 'JS_DYNAMIC':
        // [ code ]
        code = '(function(params) { ' + expandNodes(node[0], rawExpander).join('') + ' }).call(this, params);';
        return code;

    case 'XSL_DYNAMIC':
        // [ code ]
        return '';

    case 'XML':
        // [ tag, attrs, [content] ]
        var tag = node[0],
            attrs = node[1],
            prop = [],
            s = '', t, c;

        code = [];

        for(c in attrs) { prop.push([c, SINGLE_QUOTE_CHAR + attrs[c] + SINGLE_QUOTE_CHAR].join('=')); };
        prop = prop.length? jsQuote(' ' + prop.join(' ')) : '';

        c = '';
        t = '"<' + tag + prop;

        if(node[2].length) {
            s = ' + ';

            t += '>"';
            code.push(t);

            c = expandNodes(node[2], currentExpander);
            isArray(c) || (c = [c]);
            [].push.apply(code, c);

            code.push(t = '"</' + tag + '>"');
        } else {
            t += '/>"';
            code.push(t);
        }

        return code.join(s);

    case 'PARAMS':
        // [ [params] ]
        return "{ " + expandNodes(node, currentExpander).join(', ') + " } ";

    case 'PARAM':
        // [ name, [code] ]
        code = expandNodes(node[1], currentExpander);
        return [node[0], isArray(code) ? code.join(' + ') : code].join(': ');

    case 'PARAM-CALL':
        // [ key ]
        return 'params[' + node[0] + ']';

    case 'TEXT':
        // [ text ]
        return _raw ? node[0] : SINGLE_QUOTE_CHAR + jsQuote(node[0]) + SINGLE_QUOTE_CHAR;

    default:
        throw new Error('Unexpected item type: ' + nodeclass);

    }

}

/**
 * @param {Node[]} nodes
 * @returns {AST}
 */
function toCommonNodes(nodes) {

    var code = [];

    nodes.forEach(function(node) {
        if(node.name) {
            code.push(_node(node));
        }
        else if(node.text) {
            var text = _json(node.text);
            if(text) code.push(text);
        }
    });

    return code;

}

/**
 * @param {Object|Node} str
 * @returns {AST|String}
 */
function _text(str) {

    if(!isSimple(str)) return '';

    str = str.replace(/\n\s\s+/g, '\n ');

    if(!str.length) return '';

    return [str, 'TEXT'];

}

/**
 * @returns {AST}
 */
function _empty() {
    return ['', 'TEXT'];
}

/**
 * @param {Node} node
 * @returns {AST}
 */
function _node(node) {

    var name = node.name;
    switch(name) {

    case 'i18n:dynamic':
        var attrs = node.attributes;
        if(attrs && attrs.key) {
            // tanker dynamic
            var keyset = _keyset(attrs),
                params = _params(node.children);

            return [keyset, attrs.key, params, 'TANKER_DYNAMIC'];

        }

        // custom
        return _dynamic(node.children);

    case 'i18n:param':
        if(node.firstChild())
            return _paramCall(node.children[0]);

    }

    if(!~name.indexOf(':'))
        return _xml(node);

}

/**
 * @param {Node} node
 * @returns {AST}
 */
function _xml(node) {
    return [node.name, node.attributes, toCommonNodes(node.children), 'XML'];
}

/**
 * @param {Array|Object} nodes
 * @returns {AST}
 */
function _json(nodes) {

    var json;
    if(!(json = isJson(nodes)))
        return _text(nodes);

    if(isArray(json)) {
        // FIXME: array should always produce `plural_adv`?
        // FIXME: `none` value for json
        var params = [
                ['"count"', [ ['"count"', 'PARAM-CALL'] ], 'PARAM']
            ]
            .concat(['one', 'some', 'many', 'none'].map(function(p, i) {
                return [quotify(p), quotify(json[i] || ''), 'PARAM'];
            }));

        params.push('PARAMS');

        // FIXME: hardcode
        return ['i-tanker__dynamic', 'plural_adv', params, 'TANKER_DYNAMIC'];
    }

    return _text(nodes.toString());

}

/**
 * @param {Node[]} nodes
 * @returns {AST}
 */
function _dynamic(nodes) {

    var code = [];

    nodes.forEach(function(node) {
        var name = node.name;

        if(name === 'i18n:js') {
            code.push([toCommonNodes(node.children), 'JS_DYNAMIC']);
        //} else if(name === 'i18n:xsl') {
        //    code.push([toCommonNodes(node.children), 'XSL_DYNAMIC']);
        }

    });

    return code.length === 1? code[0] : code;

}

/**
 * @param {Node[]} nodes
 * @returns {AST}
 */
function _params(nodes) {

    var params = [];

    nodes.forEach(function(node) {
        if(!node.name) return;
        params.push(_param(node));
    });

    params.push('PARAMS');

    return params;

}

/**
 * @param {Node} param
 * @returns {AST}
 */
function _param(param) {
    var name = param.name.replace(/i18n:/, ''),
        val = toCommonNodes(param.children);

    val.length || val.push(_empty());

    return [JSON.stringify(name), val, 'PARAM'];
}

/**
 * @param {Node} param
 * @returns {AST}
 */
function _paramCall(param) {
    return [JSON.stringify(param.text), 'PARAM-CALL'];
}

/**
 * @param {Node} param
 * @returns {String}
 */
function _keyset(param) {
    // FIXME: get rid of Yandex.Tanker specifics
    return ((param.project && param.project === 'tanker') ? 'i-' + param.project + '__' : '') + param.keyset;
}


/** Helpers **/

function jsQuote(s) {
    return '' + s.replace(/([\\\/\'\r\n])/g, '\\$1');
}

function quotify(str) {
    if(isString(str))
       return QUOTE_CHAR + str + QUOTE_CHAR;
    return str;
}
