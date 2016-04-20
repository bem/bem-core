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
        'examples', 'tests',
        'docs'
    ].forEach(function (name) {
        var filename = path.join(__dirname, 'tasks', name + '.js');

        project.includeConfig(filename);
    });

    // build bundles
    project.nodes('*.bundles/*', function (node) {
        // provide BEMJSON file
        node.addTech([techs.files.provide, { target : '?.bemjson.js' }]);

        configurePage(node, {
            platform : 'common'
        });
    });
};
