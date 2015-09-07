var configureExamples = require('../helpers/examples');

/**
 * Creates `tests` task.
 *
 * This task allows to build examples.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all fixtures
 * $ magic run tests
 * @example Build fixtures for desktop platform
 * $ magic make desktop.tests
 */
module.exports = function (project) {
    configureExamples(project, {
        taskName : 'tests',
        destExt : '.tests',
        techSuffixes : ['tests']
    });
};
