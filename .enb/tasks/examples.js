var configureExamples = require('../helpers/examples');

/**
 * Creates `examples` task.
 *
 * This task allows to build examples.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all examples
 * $ magic run examples
 * @example Build examples for desktop platform
 * $ magic make desktop.examples
 */
module.exports = function (project) {
    configureExamples(project, {
        taskName : 'examples',
        destExt : '.examples',
        techSuffixes : ['examples']
    });
};
