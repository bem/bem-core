var fs = require('fs'),
    path = require('path'),
    config = require('../config'),
    techs = require('../techs'),
    BEM_TEMPLATE_ENGINE = process.env.BEM_TEMPLATE_ENGINE || 'BH';

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
 *             platform: 'desktop'
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

    var nodeDirname = node.getNodePath(),
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
        !needBEMTREE && [techs.bem.bemjsonToBemdecl, { target : '.tmp.bemdecl.js' }],
        [techs.bem.deps, {
            target : '.tmp.deps.js',
            bemdeclFile : needBEMTREE? '?.bemdecl.js' : '.tmp.bemdecl.js'
        }],
        [techs.bem.files, {
            depsFile : '.tmp.deps.js'
        }],

        // build CSS
        [techs.css, { target : '.tmp.css' }],

        // build JavaScript for browsers
        [techs.js, {
            target : '.tmp.pre.js',
            sourceSuffixes : ['vanilla.js', 'js', 'browser.js']
        }],
        [techs.ym, {
            source : '.tmp.pre.js',
            target : '.tmp.js'
        }]
    ].filter(function (tech) {
        return tech;
    }));

    if(needBEMTREE) {
        // build HTML using BEMTREE + BEMHTML
        node.addTechs([
            [techs.engines.bemhtml, { target : '.tmp.bemhtml.js' }],
            [techs.engines.bemtree, { target : '.tmp.bemtree.js' }],
            [techs.html.bemtree, {
                target : '?.html',
                bemhtmlFile : '.tmp.bemhtml.js',
                bemtreeFile : '.tmp.bemtree.js'
            }]
        ]);
    } else {
        if(BEM_TEMPLATE_ENGINE === 'BEMHTML') {
            // build HTML using BEMJSON + BEMHTML
            node.addTechs([
                [techs.engines.bemhtml, { target : '.tmp.bemhtml.js' }],
                [techs.html.bemhtml, {
                    target : '?.html',
                    bemhtmlFile : '.tmp.bemhtml.js'
                }]
            ]);
        } else {
            // build HTML using BEMJSON + BH
            node.addTechs([
                [techs.engines.bhCommonJS, {
                    target : '.tmp.bh.js',
                    devMode : false,
                    bhOptions : {
                        jsAttrName : 'data-bem',
                        jsAttrScheme : 'json'
                    }
                }],
                [techs.html.bh, {
                    target : '?.html',
                    bhFile : '.tmp.bh.js'
                }]
            ]);
        }
    }

    node.addTargets([
        '_?.css', '_?.js',
        '?.html'
    ]);

    node.mode('development', function() {
        node.addTechs([
            [techs.files.copy, { source : '.tmp.css', target : '_?.css' }],
            [techs.files.copy, { source : '.tmp.js', target : '_?.js' }]
        ]);
    });

    node.mode('production', function() {
        node.addTechs([
            [techs.borschik, { source : '.tmp.css', target : '_?.css', tech : 'cleancss' }],
            [techs.borschik, { source : '.tmp.js', target : '_?.js' }]
        ]);
    });
};
