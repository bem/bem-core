var config = require('../config'),
    PLATFORMS = config.platforms;

/**
 * Creates `docs` task.
 *
 * This task allows you to build docs.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all docs
 * $ magic run specs
 * @example Build docs for desktop platform
 * $ magic make desktop
 */
module.exports = function (project) {
    // load plugin
    project.includeConfig('enb-bem-docs');
    var plugin = project.module('enb-bem-docs'),
        // create task with `docs` name
        // and get helper to configure it
        helper = plugin.createConfigurator('docs'),
        langs = project.getLanguages();

    PLATFORMS.forEach(function (platform) {
        configure(helper, platform, langs);
    });
};

/**
 * Configures task for specified platform.
 *
 * @param {MagicHelper} helper - helper to configure task
 * @param {String} platform - platform name
 */
function configure(helper, platform, langs) {
    var dir = platform + '.docs';

    helper.configure({
        destPath : dir,
        levels : config.levels(platform),
        exampleSets : [platform + '.examples'],
        langs : langs,
        jsdoc : { suffixes : ['vanilla.js', 'browser.js', 'js'] }
    });
}
