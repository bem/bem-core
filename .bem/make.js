/*global MAKE: true */

require('./nodes');

var PATH = require('path'),
    environ = require('bem-environ')(__dirname);

environ.extendMake(MAKE);

try {
    var setsNodes = require(environ.getLibPath('bem-pr', 'bem/nodes/sets'));
} catch(e) {
    if(e.code !== 'MODULE_NOT_FOUND')
        throw e;

    require('bem/lib/logger').warn('"bem-pr" is not installer');
}


MAKE.decl('Arch', {

    blocksLevelsRegexp: /^.+?\.blocks$/,

    bundlesLevelsRegexp: /^.+?\.bundles$/,

    libraries : [ 'bem-pr@0.3.5' ],

    createCustomNodes: function(common, libs, blocks) {
        if(!setsNodes) return;

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
            'desktop' : [ 'common.blocks', 'desktop.blocks' ],
            'touch' : [ 'common.blocks', 'touch.blocks' ]
        };
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

    'desktop-levels' : function() {
        return [
            'common.blocks',
            'desktop.blocks'
        ];
    },

    'touch-levels' : function() {
        return [
            'common.blocks',
            'touch.blocks'
        ];
    },

    /**
    * Уровни переопределения используемые для сборки примера
    */
    getLevels : function() {
        var type = this.getNodePrefix().split('.')[0],
            resolve = PATH.resolve.bind(null, this.root),
            levels = [ ],
            getLevels = this[(type.indexOf(environ.getConf().siteOutputFolder) === 0? 'desktop' : type) + '-levels'];

        getLevels && (levels = levels.concat(getLevels()));

        levels.push(
            this.getSourceNodePrefix() // Подключаем директорию blocks из папки с примерами блока
                .split('/')
                .slice(0, -1)
                .concat([ 'blocks' ])
                .join('/'),
            this.rootLevel // Подключаем %examplename%.blocks из папки с примерами блока
                .getTech('blocks')
                .getPath(this.getSourceNodePrefix()));

        return levels.map(function(level) {
            return resolve(level);
        });
    }

});


MAKE.decl('TestNode', {

    getLevels : function() {
        return this.__base().concat([
            environ.getLibPath('bem-pr', 'test.blocks')
        ]);
    },

    getTechs : function() {
        return this.__base().concat([
            'test.js+browser.js+bemhtml',
            'phantomjs'
        ]);
    }
});
