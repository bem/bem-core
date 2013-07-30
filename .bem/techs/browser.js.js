var PATH = require('path'),
    BEM = require('bem'),
    Q = BEM.require('q'),
    ymPath = require.resolve('ym'),
    Deps = require('bem/lib/techs/v2/deps.js').Deps;

exports.baseTechName = 'vanilla.js';

exports.techMixin = {

    transformBuildDecl: function(decl) {
        var bb = this.getWeakBuildSuffixesMap();
        var ss = this.getWeakSuffixesMap();

        return decl
            .then(function(decl){
                var deps = new Deps().parseDepsDecl(decl)
                    .filter(function(dependson, dependent) {
                        return ((dependson.item.tech in ss)
                          || (!dependson.item.tech))
                    }).map(function(item){
                        return item.item;
                    });
                return {deps: deps};
            });
    },

    getWeakBuildSuffixesMap:function(){
        return { 'js' : ['vanilla.js', 'browser.js', 'js'] };
    },

    getBuildSuffixesMap:function(){
        return { 'js' : ['browser.js', 'js'] };
    },
    

    getCreateSuffixes : function() {
        return ['browser.js'];
    },

    getYmChunk : function(output) {
        var outputDir = PATH.resolve(output, '..');
        var ymRelPath = PATH.relative(outputDir, ymPath);
        return this.getBuildResultChunk(ymRelPath, ymPath);
    },

    getBuildResult : function(files, suffix, output, opts) {
        return Q.all([
                this.getYmChunk(output),
                this.__base.apply(this, arguments)
            ])
            .spread(function(ym, res) {
                return [ym].concat(res);
            });
    }

};