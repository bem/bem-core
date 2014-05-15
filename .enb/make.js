var DEFAULT_LANGS = ['ru', 'en'],
    fs = require('fs'),
    path = require('path');

module.exports = function(config) {
    var tools = require('enb-bem-docs')(config),
        langs = process.env.BEM_I18N_LANGS;

    config.setLanguages(langs? langs.split(' ') : [].concat(DEFAULT_LANGS));

    tools.configureSets({
        sets : {
            destPath : 'desktop.sets',
            levels : getDesktopLevels(config)
        },
        jsdocs : {
            _suffixes : ['vanilla.js', 'node.js', 'browser.js', 'js']
        },
        examples : {
            levels : getDesktopLevels(config),
            _techs : [
                [require('enb/techs/file-copy'), {
                    sourceTarget : '?.bemjson.js',
                    destTarget : '_?.bemjson.js'
                }],
                [require('enb-modules/techs/prepend-modules'), {
                    target : '?.js',
                    source : '?.pre.js'
                }],
                [require('enb-diverse-js/techs/browser-js'), {
                    target : '?.pre.js'
                }],
                [require('enb-bemxjst/techs/bemhtml'), { devMode : false }],
                [require('enb/techs/i18n-merge-keysets'), { lang : 'all' }],
                [require('enb/techs/i18n-merge-keysets'), { lang : '{lang}' }],
                [require('enb/techs/i18n-lang-js'), { lang : 'all' }],
                [require('enb/techs/i18n-lang-js'), { lang : '{lang}' }],
                [require('enb/techs/html-from-bemjson-i18n'), { lang : '{lang}' }],
                [require('enb/techs/file-copy'), { sourceTarget : '?.{lang}.html', destTarget : '_?.{lang}.html' }]
            ],
            _targets : [
                '?.js', '_?.bemjson.js',
                '?.bemhtml.js', '_?.{lang}.html'
            ],
            _optimizeTargets : [
                '?.js'
            ]
        }
    });

    config.nodes('*.bundles/*', function(nodeConfig) {
        nodeConfig.addTechs([
            [require('enb/techs/bemdecl-from-deps-by-tech'), {
                sourceTech : 'js',
                destTech : 'bemhtml',
                target : '?.bemhtml.bemdecl.js'
            }],
            [require('enb/techs/deps-old')],
            [require('enb/techs/files')],
            [require('enb/techs/files'), {
                depsTarget : '?.bemhtml.bemdecl.js',
                filesTarget : '?.bemhtml.files',
                dirsTarget : '?.bemhtml.dirs'
            }],
            [require('enb/techs/css')],
            [require('enb-diverse-js/techs/browser-js')],
            [require('enb-bemxjst/techs/bemhtml-old'), { devMode : false }],
            [require('enb-bh/techs/bh-server')],
            [require('enb-bemxjst/techs/bemhtml-old'), {
                target : '?.browser.bemhtml.js',
                filesTraget : '?.bemhtml.files',
                devMode : false
            }],
            [require('enb/techs/file-merge'), {
                sources : ['?.browser.bemhtml.js', '?.browser.js'],
                target : '?.pre.js'
            }],
            [require('enb-modules/techs/prepend-modules'), {
                source : '?.pre.js',
                target : '?.js'
            }]
        ]);

        nodeConfig.addTargets([
            '_?.css', '_?.js'
        ]);
    });

    config.nodes('*.bundles/index', function(nodeConfig) {
        nodeConfig.addTechs([
            [require('enb/techs/file-provider'), { target : '?.bemjson.js' }],
            [require('enb/techs/bemdecl-from-bemjson')],
            [require('enb/techs/html-from-bemjson')],
            [require('enb/techs/html-from-bemjson'), { destTarget : '?.bh.html' }]
        ]);

        nodeConfig.addTargets([
            '?.html', '?.bh.html'
        ]);
    });

    config.nodes('*.bundles/test-bemtree', function(nodeConfig) {
        nodeConfig.addTechs([
            [require('enb/techs/file-provider'), { target : '?.bemdecl.js' }],
            [require('enb-bemxjst/techs/bemtree-old'), { devMode : false }],
            [require('./techs/html-from-bemtree')]
        ]);

        nodeConfig.addTargets([
            '?.html'
        ]);
    });

    config.nodes('common.bundles/*', function(nodeConfig) {
        var levels = getCommonLevels(config),
            absPath = path.join(nodeConfig._root, nodeConfig._path, 'blocks');

        if(fs.existsSync(absPath)) {
            levels = levels.concat(absPath);
        }

        nodeConfig.addTechs([
            [require('enb/techs/levels'), { levels : levels }]
        ]);
    });

    config.mode('development', function() {
        config.nodes('*.bundles/*', function(nodeConfig) {
            nodeConfig.addTechs([
                [require('enb/techs/file-copy'), { sourceTarget : '?.css', destTarget : '_?.css' }],
                [require('enb/techs/file-copy'), { sourceTarget : '?.js', destTarget : '_?.js' }]
            ]);
        });
    });

    config.mode('production', function() {
        config.nodes('*.bundles/*', function(nodeConfig) {
            nodeConfig.addTechs([
                [require('enb/techs/borschik'), { sourceTarget : '?.css', destTarget : '_?.css' }],
                [require('enb/techs/borschik'), { sourceTarget : '?.js', destTarget : '_?.js' }]
            ]);
        });
    });
};

function getCommonLevels(config) {
    return [
        'common.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}

function getDesktopLevels(config) {
    return [
        'common.blocks',
        'desktop.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
