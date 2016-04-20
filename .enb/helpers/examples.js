var path = require('path'),
    naming = require('bem-naming'),
    config = require('../config'),
    configurePage = require('./page'),
    PLATFORMS = config.platforms;

/**
 * Helper to create example task.
 *
 * This task allows to build examples.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all examples
 * $ magic run examples
 * @example Build examples for desktop platform
 * $ magic make desktop.examples
 */
module.exports = function (project, options) {
    var taskName = options.taskName || 'examples',
        destExt = options.destExt || '.examples',
        techSuffixes = options.techSuffixes || ['examples'],
        fileSuffixes = options.fileSuffixes || ['bemjson.js', 'title.txt'],
        inlineBemjson = options.inlineBemjson;

    // load plugin
    if(!project._modules['enb-bem-examples']) {
       project.includeConfig('enb-bem-examples');
    }
    var magic = project.module('enb-magic-factory'),
        plugin = project.module('enb-bem-examples'),
        // create task with `examples` name
        // and get helper to configure it
        configurator = plugin.createConfigurator(taskName),
        helper = magic.getHelper(taskName);

    PLATFORMS.forEach(function (platform) {
        var dirPattern = platform + destExt + '/*/*';

        // configure BEMJSON files building
        configure(configurator, platform);
    });

    // configure pages building by BEMJSON files
    helper.configure(function (project, nodes) {
        PLATFORMS.forEach(function (platform) {
            var platformNodes = nodes.filter(function (node) {
                var dir = platform + destExt;

                return node.indexOf(dir) === 0;
            });

            project.nodes(platformNodes, function (node) {
                var dirname = node.getPath();

                configurePage(node, {
                    i18n : dirname.indexOf('i18n') !== -1,
                    platform : platform
                });
            });
        });
    });

    /**
     * Configures BEMJSON files building.
     *
     * @param {MagicHelper} helper - helper to configure task
     * @param {String} platform - platform name
     */
    function configure(helper, platform) {
        var dir = platform + destExt;

        helper.configure({
            destPath : dir,
            levels : config.levels(platform),
            techSuffixes : techSuffixes,
            fileSuffixes : fileSuffixes,
            inlineBemjson : inlineBemjson,
            processInlineBemjson : wrapInPage
        });
    }
};

function wrapInPage(bemjson, meta) {
    var basename = path.basename(meta.filename, '.bemjson.js');
    return {
        block : 'page',
        title : naming.stringify(meta.notation),
        head : [{ elem : 'css', url : basename + '.css' }],
        scripts : [{ elem : 'js', url : basename + '.js' }],
        content : bemjson
    };
}
