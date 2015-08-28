var path = require('path'),
    naming = require('bem-naming'),
    config = require('../../config'),
    configurePage = require('../../helpers/page'),
    PLATFORMS = config.platforms;

/**
 * Creates service `__doc-examples__` task.
 *
 * This task allows to build examples from md files.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all __doc-examples__
 * $ magic run examples
 * @example Build examples for desktop platform
 * $ magic make desktop.docs/examples
 */
module.exports = function (project) {
    // load plugin
    if(!project._modules['enb-bem-examples']) {
       project.includeConfig('enb-bem-examples');
    }
    var plugin = project.module('enb-bem-examples'),
        // create task with `examples` name
        // and get helper to configure it
        helper = plugin.createConfigurator('__doc-examples__');

    PLATFORMS.forEach(function (platform) {
        var dirPattern = platform + '.doc-examples/*/*';

        // configure BEMJSON files building
        configure(helper, platform);

        // configure pages building by BEMJSON files
        project.nodes(dirPattern, function (node) {
            configurePage(node, {
                platform : platform
            });
        });
    });
};

/**
 * Configures BEMJSON files building.
 *
 * @param {MagicHelper} helper - helper to configure task
 * @param {String} platform - platform name
 */
function configure(helper, platform) {
    var dirname = path.join(platform + '.doc-examples');

    helper.configure({
        destPath : dirname,
        levels : config.levels(platform),
        techSuffixes : [],
        fileSuffixes : [],
        inlineBemjson : true,
        processInlineBemjson : wrapInPage
    });
}

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
