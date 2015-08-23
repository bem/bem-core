var path = require('path'),
    env = process.env,
    techs = require('./techs'),
    config = require('./config'),
    configurePage = require('./helpers/page'),
    DEFAULT_LANGS = ['ru', 'en'],
    LANGS = env.BEM_I18N_LANGS && env.BEM_I18N_LANGS.split(' ');

module.exports = function(project) {
    project.setLanguages(LANGS || DEFAULT_LANGS);

    // load task configs
    [
        'dist',
        'specs', 'tmpl-specs',
        'tests',
        'docs', 'examples',
    ].forEach(function (name) {
        var filename = path.join(__dirname, 'tasks', name + '.js');

        project.includeConfig(filename);
    });

    // build `common.bundles/index` page
    project.node('common.bundles/index', function (node) {
        // provide BEMJSON file
        node.addTech([techs.files.provide, { target : '?.bemjson.js' }]);

        configurePage(node, {
            platform : 'common'
        });
    });

    // build `common.bundles/test-bemtree` page
    project.node('common.bundles/test-bemtree', function (node) {
        // provide BEMDECL file
        node.addTech([techs.files.provide, { target : '?.bemdecl.js' }]);

        configurePage(node, {
            bemtree : true,
            platform : 'common'
        });
    });
};
