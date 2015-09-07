var configureExamples = require('../../helpers/examples');

/**
 * Creates service example task.
 *
 * This task allows to build examples for docs.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all doc examples
 * $ magic run __doc-examples__
 * @example Build examples for desktop platform
 * $ magic make desktop.doc-examples
 */
module.exports = function (project) {
    configureExamples(project, {
        taskName : '__doc-examples__',
        destExt : '.doc-examples',
        techSuffixes : [],
        inlineBemjson : true
    });
};
