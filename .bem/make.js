/*global MAKE: true */

require('./nodes');

var PATH = require('path'),
    environ = require('./environ');

try {
    var setsNodes = require(environ.getLibPath('bem-pr', 'bem/nodes/sets'));
} catch(e) {
    require('bem/lib/logger').warn('"bem-pr" is not installer');
}


MAKE.decl('Arch', {

    blocksLevelsRegexp: /^.+?\.blocks$/,

    bundlesLevelsRegexp: /^.+?\.bundles$/,

    libraries : [ 'bem-bl', 'bem-pr' ],

    createCustomNodes: function(common, libs, blocks) {
        if(!setsNodes)
            return;

        // Сборка примеров
        return setsNodes.SetsNode
            .create({ root : this.root, arch : this.arch })     // создаем экземпляр узла
            .alterArch(null, libs);                             // расширяем процесс сборки новыми узлами из bem-pr
    }

});


MAKE.decl('SetsNode', {

    /**
     * Описание уровней-источников
     * @returns {Object}
     */
    getSets : function() {
        return {
            'common' : [ 'common.blocks' ]
        };
    }

});


MAKE.decl('BundleNode', {

    getTechs : function() {
        if(~this.getPath().indexOf('test-bemtree')) {
            return [
                'bemdecl.js',
                'deps.js',
                'bemtree.xjst',
                'bemhtml',
                'html'
            ];
        }

        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'css',
            'browser.js',
            'bemhtml',
            'html'
        ];
    },

    'create-html-node': function(tech, _) {
        var args = [].slice.call(arguments, 1);

        ~this.getPath().indexOf('test-bemtree') &&
            (tech = 'bemtree-html');

        return this.__base.apply(this, [tech].concat(args));
    }

});


MAKE.decl('ExampleNode', {

    /**
     * Технологии сборки примера
     * @returns {Array}
     */
    getTechs : function() {
        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'css',
            'browser.js',
            'bemhtml',
            'html'
        ];
    },

    /**
     * Набор уровней для сборки примера
     * @returns {Array}
     */
    getLevels : function() {
        var levels = ['common.blocks'];

        // Подключаем в сборку уровень blocks-desktop из bem-bl — там есть b-page
        [].push.apply(levels, [
                'bem-bl/blocks-desktop'
            ]
            .map(function(path) { return PATH.resolve(environ.LIB_ROOT, path); }));

        // Подключаем %examplename%.blocks из папки с примерами блока
        levels.push(
            this.rootLevel
                .getTech('blocks')
                .getPath(this.getSourceNodePrefix()));

        return levels.map(function(path) { return PATH.resolve(this.root, path); }, this);
    }

});
