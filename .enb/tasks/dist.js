var techs = require('../techs'),
    config = require('../config'),
    PLATFORMS = config.platforms,
    LIB_NAME = 'bem-core';

/**
 * Creates `dist` task.
 *
 * This task allows to build distribution of this project.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build dist for all platforms
 * $ magic run dist
 * @example Build dist for desktop platform
 * $ magic make dist/desktop
 */
module.exports = function (project) {
    var dirs = PLATFORMS.map(function (platform) {
        return 'dist/' + platform;
    });

    project.task('dist', function(task) {
        return task.buildTargets(dirs);
    });

    PLATFORMS.forEach(function (platform, i) {
        var dir = dirs[i];

        project.node(dir, function (node) {
            configure(node, platform);
        });
    });
};

/**
 * Configures task for specified platform.
 *
 * @param {NodeConfig} node — instance for configure dir with dist for specified platform
 * @param {String} platform - platform name
 */
function configure(node, platform) {
    node.addTechs([
        // get FileList
        [techs.bem.levels, { levels : config.levels(platform) }],
        [techs.bem.levelsToBemdecl, { target : '.tmp.bemdecl.js' }],
        [techs.bem.deps, { bemdeclFile : '.tmp.bemdecl.js', target : '.tmp.deps.js' }],
        [techs.files.write, {
            target : '.tmp.i-bem-dom-init-auto.deps.js',
            content : 'module.exports = ' + JSON.stringify({ deps : [{
                block : 'i-bem',
                elem : 'dom',
                mod : 'init',
                val : 'auto'
            }] })
        }],
        [techs.bem.subtractDeps, { from : '.tmp.deps.js', target : '.tmp.no-autoinit.deps.js', what : '.tmp.i-bem-dom-init-auto.deps.js' }],
        [techs.bem.files, { depsFile : '.tmp.deps.js' }],
        [techs.bem.files, {
            depsFile : '.tmp.no-autoinit.deps.js',
            filesTarget : '.tmp.no-autoinit-files.files',
            dirsTarget : '.tmp.no-autoinit-files.dirs'
        }],

        // build CSS
        [techs.css, { target : LIB_NAME + '.dev.css' }],
        [techs.borschik, { source : LIB_NAME + '.dev.css', target : LIB_NAME + '.css' }],

        // build core of i18n
        [techs.i18n.keysets, {
            target : '.tmp.keysets.js',
            lang : 'none'
        }],
        [techs.i18n.js, {
            target : '.tmp.i18n.js',
            keysetsFile : '.tmp.keysets.js',
            exports : {
                globals : true,
                ym : true
            },
            lang : 'none'
        }],

        // build JavaScript for browsers
        [techs.browserJS, {
            target : '.tmp.without-i18n.js',
            includeYM : true
        }],
        [techs.browserJS, {
            target : '.tmp.no-autoinit-without-i18n.js',
            filesTarget : '.tmp.no-autoinit-files.files',
            includeYM : true
        }],

        [techs.files.merge, {
            sources : ['.tmp.without-i18n.js', '.tmp.i18n.js'],
            target : LIB_NAME + '.dev.js'
        }],
        [techs.files.merge, {
            sources : ['.tmp.no-autoinit-without-i18n.js', '.tmp.i18n.js'],
            target : LIB_NAME + '.dev.no-autoinit.js'
        }],
        [techs.borschik, { source : LIB_NAME + '.dev.js', target : LIB_NAME + '.js' }],
        [techs.borschik, { source : LIB_NAME + '.dev.no-autoinit.js', target : LIB_NAME + '.no-autoinit.js' }],

        // build BEMHTML
        [techs.engines.bemhtml, { target : LIB_NAME + '.dev.bemhtml.js', sourceSuffixes : ['bemhtml', 'bemhtml.js'] }],
        [techs.borschik, { source : LIB_NAME + '.dev.bemhtml.js', target : LIB_NAME + '.bemhtml.js' }],

        // build BH
        [techs.engines.bhBundle, {
            target : LIB_NAME + '.dev.bh.js',
            mimic : ['bh', 'BEMHTML'],
            bhOptions : {
                jsAttrName : 'data-bem',
                jsAttrScheme : 'json'
            }
        }],
        [techs.borschik, { source : LIB_NAME + '.dev.bh.js', target : LIB_NAME + '.bh.js' }],

        // merge JavaScript with BEMHTML
        [techs.files.merge, {
            target : LIB_NAME + '.dev.js+bemhtml.js',
            sources : [LIB_NAME + '.dev.js', LIB_NAME + '.dev.bemhtml.js']
        }],
        [techs.borschik, { source : LIB_NAME + '.dev.js+bemhtml.js', target : LIB_NAME + '.js+bemhtml.js' }],

        [techs.files.merge, {
            target : LIB_NAME + '.dev.no-autoinit.js+bemhtml.js',
            sources : [LIB_NAME + '.dev.no-autoinit.js', LIB_NAME + '.dev.bemhtml.js']
        }],
        [techs.borschik, { source : LIB_NAME + '.dev.no-autoinit.js+bemhtml.js', target : LIB_NAME + '.no-autoinit.js+bemhtml.js' }],

        // merge JavaScript with BH
        [techs.files.merge, {
            target : LIB_NAME + '.dev.js+bh.js',
            sources : [LIB_NAME + '.dev.js', LIB_NAME + '.dev.bh.js']
        }],
        [techs.borschik, { source : LIB_NAME + '.dev.js+bh.js', target : LIB_NAME + '.js+bh.js' }],

        [techs.files.merge, {
            target : LIB_NAME + '.dev.no-autoinit.js+bh.js',
            sources : [LIB_NAME + '.dev.no-autoinit.js', LIB_NAME + '.dev.bh.js']
        }],
        [techs.borschik, { source : LIB_NAME + '.dev.no-autoinit.js+bh.js', target : LIB_NAME + '.no-autoinit.js+bh.js' }]
    ]);

    node.addTargets([
        '.dev.css',
        '.dev.js',
        '.dev.no-autoinit.js',
        '.dev.bemhtml.js',
        '.dev.bh.js',
        '.dev.js+bemhtml.js',
        '.dev.no-autoinit.js+bemhtml.js',
        '.dev.js+bh.js',
        '.dev.no-autoinit.js+bh.js',

        '.css',
        '.js',
        '.no-autoinit.js',
        '.bemhtml.js',
        '.bh.js',
        '.js+bemhtml.js',
        '.no-autoinit.js+bemhtml.js',
        '.js+bh.js',
        '.no-autoinit.js+bh.js'
    ].map(function (ext) {
        return LIB_NAME + ext;
    }));
}
