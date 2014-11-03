var BEM = require('bem'),
    Q = BEM.require('q'),
    VM = require('vm'),
    REQF = require('reqf');

exports.API_VER = 2;

exports.techMixin = {

    getBemhtml : function(prefix) {

        var path = this.getPath(prefix, 'bemhtml.js');
        return BEM.util.readFile(path)
            .then(function(c) {
                var ctx = VM.createContext({
                    require : REQF(path, module),
                    console : console
                });
                VM.runInContext(c, ctx, path);
                return ctx.BEMHTML;
            });

    },

    getBemjson : function(prefix) {

        var path = this.getPath(prefix, 'bemjson.js');
        return BEM.util.readFile(path)
            .then(function(c) {
                return VM.runInNewContext(
                    c,
                    {
                        require : REQF(path, module),
                        console : console
                    },
                    path);
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
