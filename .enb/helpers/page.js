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
        [techs.bem.deps],
        [techs.bem.files],

        // build CSS
        [techs.css],

        // build JavaScript for browsers
        [techs.js, {
            target : '?.pre.js',
            sourceSuffixes : ['vanilla.js', 'js', 'browser.js']
        }],
        [techs.ym, {
            source : '?.pre.js',
            target : '?.js'
        }]
    ].filter(function (tech) {
        return tech;
    }));

    if(needBEMTREE) {
        // build HTML using BEMTREE + BEMHTML
        node.addTechs([
            [techs.engines.bemhtml],
            [techs.engines.bemtree],
            [techs.html.bemtree]
        ]);
    } else {
        if(BEM_TEMPLATE_ENGINE === 'BEMHTML') {
            // build HTML using BEMJSON + BEMHTML
            node.addTechs([
                [techs.engines.bemhtml],
                [techs.html.bemhtml]
            ]);
        } else {
            // build HTML using BEMJSON + BH
            node.addTechs([
                [techs.engines.bhCommonJS, {
                    devMode : false,
                    bhOptions : {
                        jsAttrName : 'data-bem',
                        jsAttrScheme : 'json'
                    }
                }],
                [techs.html.bh]
            ]);
        }
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
