var FS = require('fs'),
    VM = require('vm'),
    BEM = require('bem'),
    Q = BEM.require('q'),
    Vow = require('vow');

exports.baseTechName = 'html';

exports.techMixin = {

    getCreateSuffixes : function() {
        return ['html'];
    },

    getBemhtml : function(prefix) {
        var path = this.getPath(prefix, 'bemhtml.js');
        return require(path).BEMHTML;
    },

    getBemjson : function(prefix) {
        var path = this.getPath(prefix, 'bemtree.js'),
            bemtree = FS.readFileSync(path),
            ctx = VM.createContext({
                Vow: Vow,
                console: console,
                setTimeout: setTimeout
            });

        VM.runInContext(bemtree, ctx);

        return ctx.BEMTREE;
    },

    getHtml : function(bemhtml, bemjson) {
        var ctx = {};
        return Q.when(bemjson)
            .then(function(bemjson) {
                return [bemhtml, bemjson.apply(ctx)];
            })
            .spread(function(bemhtml, bemjson) {
                return bemhtml.apply(bemjson);
            });
    },

    getDependencies : function() {
        return ['bemtree', 'bemhtml'];
    }

};
