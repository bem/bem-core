var BEM = require('bem'),
    Q = BEM.require('q'),
    PATH = require('path'),
    compat = require('bemhtml-compat'),

    Tech = require('bem/lib/tech').TechV2;

exports.baseTech = Tech;

exports.techMixin = {

    getBuildSuffixesMap: function() {
        return {
            'bemhtml.js': ['bemhtml', 'bemhtml.xjst']
        };
    },

    getCreateSuffixes : function() {
        return ['bemhtml'];
    },

    getBuildResultChunk : function(relPath, path, suffix) {
        var content = this.readContent(path, suffix);
        return (suffix !== 'bemhtml.xjst' ?
            content.then(function(source) { return compat.transpile(source); }) :
            content)
                .then(function(source) {
                    return '\n/* begin: ' + relPath + ' */\n' +
                        source +
                        '\n/* end: ' + relPath + ' */\n';
                });
    },

    getBuildResult : function(files, suffix, output, opts) {
        var _t = this;
        return this.__base(files, suffix, output, opts)
            .then(_t.getCompiledResult.bind(_t));
    },

    getCompiledResult : function(sources) {
        sources = sources.join('\n');

        var BEMHTML = require('../lib/bemhtml');
        return BEMHTML.translate(sources, {
                devMode : process.env.BEMHTML_ENV == 'development',
                cache   : process.env.BEMHTML_CACHE == 'on',
                exportName : 'BEMHTML'
            });
    }

};
