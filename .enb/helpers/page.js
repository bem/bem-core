var fs = require('fs'),
    path = require('path'),
    config = require('../config'),
    techs = require('../techs');

/**
 * Configures dir to build page.
 *
 * Directory with BEMJSON file must exist in file system before build.
 *
 * page/
 * └── page.bemjson.js
 *
 * Important: BEMJSON file should be provided.
 *
 * After build we get JS, CSS and HTML files.
 *
 * page/
 * ├── page.bemjson.js
 * ├── page.css
 * ├── page.js
 * └── page.html
 *
 * @param {NodeConfig} node — instance for configure dir
 * @param {Object}   opts
 * @param {Object}   opts.platform  — platform name (desktop or touch).
 * @param {String[]} [opts.langs]   — languages.
 * @param {Boolean}  [opts.bemtree] — build HTML using BEMTREE.
 * @example
 * var configurePage = require('./helpers/page'),
 *     FileProviderTech = require('enb/techs/file-provider');
 *
 * module.exports = function(project) {
 *     project.node('desktop.bundles/index', function (node) {
 *         // provide BEMJSON file
 *         node.addTech([FileProviderTech, { target: '?.bemjson.js' }]);
 *
 *         // build page
 *         configurePage(node, {
 *             platform: 'desktop',
 *             langs: ['en', 'ru']
 *         });
 *     });
 * };
 */
module.exports = function(node, opts) {
    var nodeUrl = node.getPath();

    opts = opts || {};

    if(!opts.platform) {
        var error = new Error('platform to configure the `' + nodeUrl + '` node is not specified.');
        error.name = 'ConfigError';

        throw error;
    }

    var langs = opts.langs || [],
        nodeDirname = node.getNodePath(),
        sublevels = [
            path.join(nodeDirname, '..', '.blocks'),
            path.join(nodeDirname, 'blocks')
        ].filter(function (level) {
            return fs.existsSync(level);
        }),
        levels = [].concat(
            config.levels(opts.platform),
            sublevels
        ),
        needBEMTREE = opts.bemtree;

    node.addTechs([
        // get FileList
        [techs.bem.levels, { levels : levels }],
        !needBEMTREE && [techs.bem.bemjsonToBemdecl],
        [techs.bem.depsOld],
        [techs.bem.files],

        // build CSS
        [techs.css],

        // build BEMHTML for browsers
        [techs.bem.depsByTechToBemdecl, {
            target : '?.bemhtml.bemdecl.js',
            sourceTech : 'js',
            destTech : 'bemhtml'
        }],
        [techs.bem.depsOld, {
            target : '?.bemhtml.deps.js',
            sourceDepsFile : '?.bemhtml.bemdecl.js'
        }],
        [techs.bem.files, {
            target : '?.bemhtml.deps.js',
            filesTarget : '?.bemhtml.files',
            dirsTarget : '?.bemhtml.dirs'
        }],
        [techs.engines.bemhtml, {
            target : '?.browser.bemhtml.js',
            filesTarget : '?.bemhtml.files',
            devMode : false
        }],

        // build JavaScript for browsers
        [techs.js, {
            target : '?.browser.js',
            sourceSuffixes : ['vanilla.js', 'js', 'browser.js']
        }],
        [techs.files.merge, {
            target : '?.pre.js',
            sources : ['?.browser.bemhtml.js', '?.browser.js']
        }],
        [techs.ym, {
            source : '?.pre.js',
            target : '?.js'
        }],
    ].filter(function (tech) {
        return tech;
    }));

    node.addTech(techs.engines.bemhtml);
    if(needBEMTREE) {
        // build HTML using BEMTREE
        node.addTechs([
            [techs.engines.bemtree],
            [techs.html.bemtree]
        ]);
    } else {
        node.addTechs([
            // build HTML using BEMHTML
            [techs.html.bemhtml],

            // build HTML using BH
            [techs.engines.bhCommonJS, {
                devMode : false,
                bhOptions : {
                    jsAttrName : 'data-bem',
                    jsAttrScheme : 'json'
                }
            }],
            [techs.html.bh, { target : '?.bh.html' }]
        ]);

        node.addTarget('?.bh.html');
    }

    node.addTargets([
        '_?.css', '_?.js',
        '?.html'
    ]);

    node.mode('development', function() {
        node.addTechs([
            [techs.files.copy, { source : '?.css', target : '_?.css' }],
            [techs.files.copy, { source : '?.js', target : '_?.js' }]
        ]);
    });

    node.mode('production', function() {
        node.addTechs([
            [techs.borschik, { source : '?.css', target : '_?.css', tech : 'cleancss' }],
            [techs.borschik, { source : '?.js', target : '_?.js' }]
        ]);
    });

    langs.forEach(function(lang) {
        var destTarget = '?.' + lang + '.html';

        node.addTech([techs.files.copy, { source : '?.html', target : destTarget }]);
        node.addTarget(destTarget);
    });
};
