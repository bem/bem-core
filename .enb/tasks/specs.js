var techs = require('../techs'),
    config = require('../config'),
    PLATFORMS = config.platforms;

/**
 * Creates `specs` task.
 *
 * This task allows to run test for browser JavaScript code.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Run all tests
 * $ magic run specs
 * @example Run tests for desktop platform
 * $ magic make desktop.specs
 */
module.exports = function (project) {
    // load plugin
    project.includeConfig('enb-bem-specs');
    var plugin = project.module('enb-bem-specs'),
        // create task with `specs` name
        // and get helper to configure it
        helper = plugin.createConfigurator('specs');

    PLATFORMS.forEach(function (platform) {
        configure(helper, platform);
    });
};

/**
 * Configures task for specified platform.
 *
 * @param {MagicHelper} helper - helper to configure task
 * @param {String} platform - platform name
 */
function configure(helper, platform) {
    var dir = platform + '.specs';

    helper.configure({
        destPath     : dir,
        levels       : config.levels(platform),
        sourceLevels : config.levels(platform, { specs : true }),
        jsSuffixes   : ['vanilla.js', 'browser.js', 'js'],
        specSuffixes : ['spec.js'],
        langs        : true,
        depsTech     : techs.bem.deps
    });
}
