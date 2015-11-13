import ym from 'ym';
var origDefine = ym.define;

ym.define = function(name, deps, decl) {
    origDefine.apply(ym, arguments);

    name !== 'i-bem-dom__init' && arguments.length > 2 && ~deps.indexOf('i-bem-dom') &&
        ym.define('i-bem-dom__init', [name], function(provide, _, prev) {
            provide(prev);
        });
};
