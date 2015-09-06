var config = require('../config'),
    configurePage = require('../helpers/page'),
    PLATFORMS = config.platforms;

/**
 * Creates `tests` task.
 *
 * This task allows to build pages for gemini test.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all pages
 * $ magic run tests
 * @example Build pages for desktop platform
 * $ magic make desktop.tests
 */
module.exports = function (project) {
    // load plugin
    if(!project._modules['enb-bem-examples']) {
       project.includeConfig('enb-bem-examples');
    }
    var magic = project.module('enb-magic-factory'),
        plugin = project.module('enb-bem-examples'),
        // create task with `tests` name
        // and get helper to configure it
        configurator = plugin.createConfigurator('tests'),
        helper = magic.getHelper('tests');

    PLATFORMS.forEach(function (platform) {
        var dirPattern = platform + '.tests/*/*';

        // configure BEMJSON files building
        configure(configurator, platform);
    });

    // configure pages building by BEMJSON files
    helper.configure(function (project, nodes) {
        PLATFORMS.forEach(function (platform) {
            var platformNodes = nodes.filter(function (node) {
                var dir = platform + '.examples';

                return node.indexOf(dir) === 0;
            });

            project.nodes(platformNodes, function (node) {
                configurePage(node, {
                    i18n : dirname.indexOf('i18n') !== -1,
                    platform : platform
                });
            });
        });
    });
};

/**
 * Configures of build BEMJSON files.
 *
 * @param {MagicHelper} helper - helper to configure task
 * @param {String} platform - platform name
 */
function configure(helper, platform) {
    var dir = platform + '.tests';

    helper.configure({
        destPath : dir,
        levels : config.levels(platform),
        techSuffixes : ['tests'],
        fileSuffixes : ['bemjson.js', 'title.txt']
    });
}
