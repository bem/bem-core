var techs = require('../techs'),
    config = require('../config'),
    PLATFORMS = config.platforms;

/**
 * Creates `tmpl-specs` task.
 *
 * This task allows to run test for templates code (BEMHTML and BH).
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Run all tests
 * $ magic run tmpl-specs
 * @example Run tests for desktop platform
 * $ magic make desktop.tmpl-specs
 */
module.exports = function (project) {
    // load plugin
    project.includeConfig('enb-bem-tmpl-specs');
    var plugin = project.module('enb-bem-tmpl-specs'),
        // create task with `tmpl-specs` name
        // and get helper to configure it
        helper = plugin.createConfigurator('tmpl-specs');

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
    var dir = platform + '.tmpl-specs',
        levels = config.levels(platform);

    helper.configure({
        destPath : platform + '.tmpl-specs',
        levels : levels,
        sourceLevels : levels,
        langs : true,
        depsTech : techs.bem.deps,
        engines : {
            bh : {
                tech : 'enb-bh/techs/bh-bundle',
                options : {
                    devMode : false,
                    requires : {
                        i18n : { globals : 'BEM.I18N' }
                    },
                    bhOptions : {
                        jsAttrName : 'data-bem',
                        jsAttrScheme : 'json'
                    }
                }
            },
            bemhtml : {
                tech : 'enb-bemxjst/techs/bemhtml',
                options : {
                    sourceSuffixes : ['bemhtml', 'bemhtml.js'],
                    requires : {
                        i18n : { globals : 'BEM.I18N' }
                    }
                }
            }
        }
    });
}
