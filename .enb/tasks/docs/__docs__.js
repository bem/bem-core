var config = require('../../config'),
    PLATFORMS = config.platforms;

/**
 * Creates service `__docs__` task.
 *
 * This task allows to build docs without examples.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all docs
 * $ magic run __docs__
 * @example Build docs for desktop platform
 * $ magic make desktop.docs
 */
module.exports = function (project) {
    // load plugin
    project.includeConfig('enb-bem-docs');
    var plugin = project.module('enb-bem-docs'),
        // create task with `__docs__` name
        // and get helper to configure it
        helper = plugin.createConfigurator('__docs__', ['examples', '__doc-examples__']),
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
        exampleSets : [platform + '.examples', platform + '.doc-examples'],
        langs : langs,
        jsdoc : { suffixes : ['vanilla.js', 'browser.js', 'js'] }
    });
}
