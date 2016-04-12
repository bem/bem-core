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
        blockName = path.basename(path.dirname(nodeDirname)),
        exampleName = path.basename(nodeDirname),
        sublevels = [
            path.join(nodeDirname, blockName + '.blocks'),
            path.join(nodeDirname, exampleName + '.blocks'),
            path.join(nodeDirname, 'blocks')
        ].filter(fs.existsSync),
        levels = [].concat(
            config.levels(opts.platform),
            sublevels
        );

    node.addTechs([
        // get FileList
        [techs.bem.levels, { levels : levels }],
        [techs.bem.bemjsonToBemdecl, { target : '.tmp.bemdecl.js' }],
        [techs.bem.deps, {
            target : '.tmp.deps.js',
            bemdeclFile : '.tmp.bemdecl.js'
        }],
        [techs.bem.files, {
            depsFile : '.tmp.deps.js'
        }],

        // build CSS
        [techs.css, { target : '.tmp.css' }],

        // build JavaScript for browsers
        [techs.browserJS, {
            target : '.tmp.js',
            includeYM : true
        }]
    ]);

    node.addTargets([
        '?.css', '?.js',
    ]);

    if(opts.i18n) {
        // build browser JavaScript with i18n
        node.addTechs([
            [techs.i18n.keysets, {
                target : '.tmp.keysets.{lang}.js',
                lang : '{lang}'
            }],
            [techs.i18n.js, {
                target : '.tmp.lang.{lang}.js',
                keysetsFile : '.tmp.keysets.{lang}.js',
                lang : '{lang}'
            }],
            [techs.files.merge, {
                target : '.tmp.{lang}.js',
                lang : '{lang}',
                sources : ['.tmp.js', '.tmp.lang.{lang}.js']
            }]
        ]);
        node.addTarget('?.{lang}.js');

        if(BEM_TEMPLATE_ENGINE === 'BEMHTML') {
            // build lang HTMLs using BEMJSON + BEMHTML
            node.addTechs([
                [techs.engines.bemhtmlI18N, {
                    target : '.tmp.bemhtml.{lang}.js',
                    lang : '{lang}',
                    keysetsFile : '.tmp.keysets.{lang}.js'
                }],
                [techs.html.bemhtml, {
                    target : '?.{lang}.html',
                    bemhtmlFile : '.tmp.bemhtml.{lang}.js'
                }]
            ]);
        } else {
            // build lang HTMLs using BEMJSON + BH
            node.addTechs([
                [techs.engines.bhCommonJSI18N, {
                    target : '.tmp.bh.{lang}.js',
                    lang : '{lang}',
                    keysetsFile : '.tmp.keysets.{lang}.js',
                    devMode : false,
                    bhOptions : {
                        jsAttrName : 'data-bem',
                        jsAttrScheme : 'json'
                    }
                }],
                [techs.html.bh, {
                    target : '?.{lang}.html',
                    bhFile : '.tmp.bh.{lang}.js'
                }]
            ]);
        }

        node.addTarget('?.{lang}.html');
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

        node.addTarget('?.html');
    }

    node.mode('development', function() {
        node.addTechs([
            [techs.files.copy, { source : '.tmp.css', target : '?.css' }],
            [techs.files.copy, { source : '.tmp.js', target : '?.js' }]
        ]);

        if(opts.i18n) {
            node.addTech([techs.files.copy, { source : '.tmp.{lang}.js', target : '?.{lang}.js' }]);
        }
    });

    node.mode('production', function() {
        node.addTechs([
            [techs.borschik, { source : '.tmp.css', target : '?.css' }],
            [techs.borschik, { source : '.tmp.js', target : '?.js' }]
        ]);

        if(opts.i18n) {
            node.addTech([techs.borschik, { source : '.tmp.{lang}.js', target : '?.{lang}.js' }]);
        }
    });
};
