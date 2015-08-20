var path = require('path'),
    naming = require('bem-naming'),
    config = require('../config'),
    configurePage = require('../helpers/page'),
    PLATFORMS = config.platforms;

/**
 * Creates `examples` task.
 *
 * This task allows you to build examples.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all examples
 * $ magic run examples
 * @example Build examples for desktop platform
 * $ magic make desktop.examples
 */
module.exports = function (project) {
    // load plugin
    if(!project._modules['enb-bem-examples']) {
       project.includeConfig('enb-bem-examples');
    }
    var plugin = project.module('enb-bem-examples'),
        // create task with `examples` name
        // and get helper to configure it
        helper = plugin.createConfigurator('examples'),
        langs = project.getLanguages();

    PLATFORMS.forEach(function (platform) {
        var dirPattern = platform + '.examples/*/*';

        // configure of build BEMJSON files
        configure(helper, platform);

        // configure of build pages by BEMJSON files
        project.nodes(dirPattern, function (node) {
            configurePage(node, {
                platform : platform,
                langs : langs
            });
        });
    });
};

/**
 * Configures build BEMJSON files.
 *
 * @param {MagicHelper} helper - helper to configure task
 * @param {String} platform - platform name
 */
function configure(helper, platform) {
    var dir = platform + '.examples';

    helper.configure({
        destPath : dir,
        levels : config.levels(platform),
        techSuffixes : ['examples'],
        fileSuffixes : ['bemjson.js', 'title.txt'],
        inlineBemjson : true,
        processInlineBemjson : wrapInPage
    });
}

function wrapInPage(bemjson, meta) {
    var basename = '_' + path.basename(meta.filename, '.bemjson.js');
    return {
        block : 'page',
        title : naming.stringify(meta.notation),
        head : [{ elem : 'css', url : basename + '.css' }],
        scripts : [{ elem : 'js', url : basename + '.js' }],
        content : bemjson
    };
}
