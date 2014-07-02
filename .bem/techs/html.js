var BEM = require('bem'),
    Q = BEM.require('q'),
    VM = require('vm');

exports.API_VER = 2;

exports.techMixin = {

    getBemhtml : function(prefix) {

        var path = this.getPath(prefix, 'bemhtml.js');
        return BEM.util.readFile(path)
            .then(function(c) {
                /* global BEMHTML */
                /** @name BEMHTML variable appears after runInThisContext() call */
                VM.runInThisContext(c, path);
                return BEMHTML;
            });

    },

    getBemjson : function(prefix) {

        var path = this.getPath(prefix, 'bemjson.js');
        return BEM.util.readFile(path)
            .then(function(c) {
                return VM.runInThisContext(c, path);
            });

    },

    getHtml : function(bemhtml, bemjson) {

        return Q.all([bemhtml, bemjson])
            .spread(function(bemhtml, bemjson) {
                return bemhtml.apply(bemjson);
            });

    },

    getCreateResult : function(path, suffix, vars) {

        return this.getHtml(
            this.getBemhtml(vars.Prefix),
            this.getBemjson(vars.Prefix));

    },

    storeCreateResult : function(path, suffix, res, force) {
        // always overwrite html files
        return this.__base(path, suffix, res, true);
    },

    getDependencies : function() {
        return ['bemjson.js', 'bemhtml.js'];
    }

};
