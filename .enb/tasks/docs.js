var path = require('path'),
    vow = require('vow');

/**
 * Creates `docs` meta task.
 *
 * This task allows to build docs with examples.
 *
 * @param {ProjectConfig} project - main ENB config for this project
 * @example Build all docs
 * $ magic run docs
 * @example Build docs for desktop platform
 * $ magic make desktop.docs
 */
module.exports = function (project) {
    // load service task configs
    ['__doc-examples__', '__docs__'].forEach(function (name) {
        var filename = path.join(__dirname, 'docs', name + '.js');

        project.includeConfig(filename);
    });

    project.task('docs', function (task) {
        var platform = task.getMakePlatform(),
            args = [].slice.call(arguments, 1),
            exampleArgs = args.filter(function (arg) {
                return arg.indexOf('examples') !== -1;
            }),
            docsArgs = args.filter(function (arg) {
                return arg.indexOf('examples') === -1;
            });

        return vow.all([
            platform.buildTask('examples', exampleArgs),
            platform.buildTask('__doc-examples__', exampleArgs),
            platform.buildTask('__docs__', docsArgs)
        ]);
    });
};
