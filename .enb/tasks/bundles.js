var techs = require('../techs'),
    config = require('../config'),
    promisify = require('vow-node').promisify,
    glob = promisify(require('glob'));

/**
 * Creates `bundles` task.
 *
 * This task allows to build bundles of this project.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build bundles for all platforms
 * $ magic run bundles
 * @example Build bundles for desktop platform
 * $ magic make desktop.bundles
 */
module.exports = function (project) {
    project.task('bundles', function (task) {
        var platform = task.getMakePlatform();

        return glob('*.bundles/*')
            .then (function (dirs) {
                return platform.buildTargets(dirs);
            });
    });
};
