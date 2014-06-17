var DEFAULT_LANGS = ['ru', 'en'],
    fs = require('fs'),
    path = require('path'),
    docSets = require('enb-bem-docs'),
    exampleSets = require('enb-bem-examples'),
    levels = require('enb/techs/levels'),
    provide = require('enb/techs/file-provider'),
    bemdeclFromDepsByTech = require('enb/techs/bemdecl-from-deps-by-tech'),
    bemdecl = require('enb/techs/bemdecl-from-bemjson'),
    deps = require('enb/techs/deps-old'),
    files = require('enb/techs/files'),
    mergeBemdecl = require('enb/techs/bemdecl-merge'),
    css = require('enb/techs/css'),
    js = require('enb-diverse-js/techs/browser-js'),
    ym = require('enb-modules/techs/prepend-modules'),
    bemhtml = require('enb-bemxjst/techs/bemhtml-old'),
    bemtree = require('enb-bemxjst/techs/bemtree-old'),
    html = require('enb-bemxjst/techs/html-from-bemjson'),
    htmlFromData = require('./techs/html-from-bemtree'),
    bh = require('enb-bh/techs/bh-server'),
    bhHtml = require('enb-bh/techs/html-from-bemjson'),
    copyFile = require('enb/techs/file-copy'),
    mergeFiles = require('enb/techs/file-merge'),
    borschik = require('enb-borschik/techs/borschik');

module.exports = function(config) {
    var docs = docSets.create('docs', config),
        examples = exampleSets.create('examples', config),
        tests = exampleSets.create('tests', config),
        langs = process.env.BEM_I18N_LANGS;

    config.setLanguages(langs? langs.split(' ') : [].concat(DEFAULT_LANGS));

    docs.build({
        destPath : 'desktop.docs',
        levels : getDesktopLevels(config),
        examplesPattern : 'desktop.examples/?'
    });

    examples.build({
        destPath : 'desktop.examples',
        levels : getDesktopLevels(config),
        inlineBemjson : true
    });

    tests.build({
        destPath : 'desktop.tests',
        levels : getDesktopLevels(config),
        suffixes : ['tests']
    });

    docs.build({
        destPath : 'touch-pad.docs',
        levels : getTouchPadLevels(config),
        examplesPattern : 'touch-pad.examples/?'
    });

    examples.build({
        destPath : 'touch-pad.examples',
        levels : getTouchPadLevels(config),
        inlineBemjson : true
    });

    tests.build({
        destPath : 'touch-pad.tests',
        levels : getTouchPadLevels(config),
        suffixes : ['tests']
    });

    docs.build({
        destPath : 'touch-phone.docs',
        levels : getTouchPhoneLevels(config),
        examplesPattern : 'touch-phone.examples/?'
    });

    examples.build({
        destPath : 'touch-phone.examples',
        levels : getTouchPhoneLevels(config),
        inlineBemjson : true
    });

    tests.build({
        destPath : 'touch-phone.tests',
        levels : getTouchPhoneLevels(config),
        suffixes : ['tests']
    });

    config.nodes(['desktop.examples/*/*', 'desktop.tests/*/*'], function (nodeConfig) {
        var nodeDir = nodeConfig.getNodePath(),
            blockSublevelDir = path.join(nodeDir, '..', '.blocks'),
            sublevelDir = path.join(nodeDir, 'blocks'),
            extendedLevels = [].concat(getDesktopLevels(config));

        if(fs.existsSync(blockSublevelDir)) {
            extendedLevels.push(blockSublevelDir);
        }

        if(fs.existsSync(sublevelDir)) {
            extendedLevels.push(sublevelDir);
        }

        nodeConfig.addTech([levels, { levels : extendedLevels }]);
    });

    config.nodes(['touch-pad.examples/*/*', 'touch-pad.tests/*/*'], function (nodeConfig) {
        var nodeDir = nodeConfig.getNodePath(),
            blockSublevelDir = path.join(nodeDir, '..', '.blocks'),
            sublevelDir = path.join(nodeDir, 'blocks'),
            extendedLevels = [].concat(getTouchPadLevels(config));

        if(fs.existsSync(blockSublevelDir)) {
            extendedLevels.push(blockSublevelDir);
        }

        if(fs.existsSync(sublevelDir)) {
            extendedLevels.push(sublevelDir);
        }

        nodeConfig.addTech([levels, { levels : extendedLevels }]);
    });

    config.nodes(['touch-phone.examples/*/*', 'touch-phone.tests/*/*'], function (nodeConfig) {
        var nodeDir = nodeConfig.getNodePath(),
            blockSublevelDir = path.join(nodeDir, '..', '.blocks'),
            sublevelDir = path.join(nodeDir, 'blocks'),
            extendedLevels = [].concat(getTouchPhoneLevels(config));

        if(fs.existsSync(blockSublevelDir)) {
            extendedLevels.push(blockSublevelDir);
        }

        if(fs.existsSync(sublevelDir)) {
            extendedLevels.push(sublevelDir);
        }

        nodeConfig.addTech([levels, { levels : extendedLevels }]);
    });

    config.nodes('common.bundles/*', function(nodeConfig) {
        var nodeDir = nodeConfig.getNodePath(),
            sublevelDir = path.join(nodeDir, 'blocks'),
            extendedLevels = [].concat(getCommonLevels(config));

        if(fs.existsSync(sublevelDir)) {
            extendedLevels.push(sublevelDir);
        }

        nodeConfig.addTech([levels, { levels : extendedLevels }]);
    });

    config.nodes(['*.examples/*/*', '*.tests/*/*', '*.bundles/*'], function (nodeConfig) {
        // Base techs
        nodeConfig.addTechs([
            deps,
            files
        ]);

        // Client techs
        nodeConfig.addTechs([
            css,
            [js],
            [mergeFiles, {
                target : '?.pre.js',
                sources : ['?.browser.bemhtml.js', '?.browser.js']
            }],
            [ym, {
                source : '?.pre.js',
                target : '?.js'
            }]
        ]);

        // Client BEMHTML
        nodeConfig.addTechs([
            [bemdeclFromDepsByTech, {
                target : '?.js.bemhtml.bemdecl.js',
                sourceTech : 'js',
                destTech : 'bemhtml'
            }],
            [mergeBemdecl, {
                bemdeclSources : ['?.js.bemhtml.bemdecl.js', '?.bemdecl.js'],
                bemdeclTarget : '?.bemhtml.bemdecl.js'
            }],

            [deps, {
                depsTarget : '?.bemhtml.deps.js',
                bemdeclTarget : '?.bemhtml.bemdecl.js'
            }],
            [files, {
                depsTarget : '?.bemhtml.deps.js',
                filesTarget : '?.bemhtml.files',
                dirsTarget : '?.bemhtml.dirs'
            }],

            [bemhtml, {
                target : '?.browser.bemhtml.js',
                filesTarget : '?.bemhtml.files',
                devMode : false
            }]
        ]);

        // Template techs
        nodeConfig.addTechs([
            [bemhtml],
            [bh]
        ]);

        nodeConfig.addTargets([
            '?.css', '?.js'
        ]);
    });

    config.nodes(['*.examples/*/*', '*.tests/*/*', '*.bundles/index'], function (nodeConfig) {
        var langs = config.getLanguages();

        // Base techs
        nodeConfig.addTechs([
            [provide, { target : '?.bemjson.js' }],
            [bemdecl]
        ]);

        // Build htmls
        nodeConfig.addTechs([
            [html],
            [bhHtml, { target : '?.bh.html' }]
        ]);

        langs.forEach(function(lang) {
            var destTarget = '?.' + lang + '.html';

            nodeConfig.addTech([copyFile, { source : '?.html', target : destTarget }]);
            nodeConfig.addTarget(destTarget);
        });

        nodeConfig.addTargets([
            '?.html', '?.bh.html'
        ]);
    });

    config.nodes('*.bundles/test-bemtree', function(nodeConfig) {
        nodeConfig.addTechs([
            [provide, { target : '?.bemdecl.js' }],
            [bemtree, { devMode : false }],
            [htmlFromData]
        ]);

        nodeConfig.addTargets([
            '?.html'
        ]);
    });

    config.mode('development', function () {
        config.nodes(['*.examples/*/*', '*.tests/*/*', '*.bundles/*'], function (nodeConfig) {
            nodeConfig.addTechs([
                [copyFile, { source : '?.css', target : '_?.css' }],
                [copyFile, { source : '?.js', target : '_?.js' }]
            ]);
        });
    });

    config.mode('production', function () {
        config.nodes(['*.examples/*/*', '*.tests/*/*', '*.bundles/*'], function (nodeConfig) {
            nodeConfig.addTechs([
                [borschik, { source : '?.css', target : '_?.css', freeze : true }],
                [borschik, { source : '?.js', target : '_?.js', freeze : true }]
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

function getTouchPadLevels(config) {
    return [
        'common.blocks',
        'touch.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}

function getTouchPhoneLevels(config) {
    return [
        'common.blocks',
        'touch.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}
