module.exports = {
    options : {
        expr : true,
        eqeqeq : true,
        undef : true,
        boss : true,
        sub : true,
        supernew : true,
        loopfunc : true,
        onecase : true,
        quotmark : 'single',
    },

    groups : {
        vanillajs : {
            options : {
                predef : ['modules']
            },
            includes : ['*.blocks/**/*.vanilla.js'],
            excludes : [
                'common.blocks/vow/**',
                'common.blocks/inherit/**',
            ]
        },

        browserjs : {
            options : {
                browser : true,
                predef : ['modules']
            },
            includes : ['*.blocks/**/*.js'],
            excludes : [
                '**/*.bem/*.js',
                '**/*.i18n/*.js',
                '**/*.i18n.js',
                '**/i18n.test.js',
                '**/*.bemjson.js',
                '**/*.deps.js',
                '**/*.node.js',
                '**/*.spec.js',
                '**/*.vanilla.js',
                '**/*.bh.js',
                '**/*.bemhtml.js',
                'common.blocks/vow/vow.js',
                'common.blocks/jquery/__event/_type/jquery__event_type_pointer*',
                'common.blocks/jquery/__event/_type/jquery__event_type_pointerpressrelease.tests/**'
            ]
        },

        specjs : {
            options : {
                browser : true,
                predef : [
                    'modules',
                    'describe',
                    'it',
                    'before',
                    'beforeEach',
                    'after',
                    'afterEach'
                ]
            },
            includes : ['*.blocks/**/*.spec.js']
        },

        bemjsonjs : {
            options : {
                asi : true
            },
            includes : [
                '*.bundles/**/*.bemjson.js',
                '**/*.tests/**/*.bemjson.js'
            ],
            excludes : [
                '**/.bem/**/*',
                '*.tests/**/*',
                '*.specs/**/*',
                '**/*.examples/**/*.bemjson.js',
                '**/*.doc-examples/**/*.bemjson.js',
                'libs/**/*',
                'node_modules/**/*'
            ]
        },

        nodejs : {
            options : {
                node : true
            },
            includes : ['**/.bem/**/*.js'],
            excludes : [
                '.bem/cache/**',
                'libs/**',
                'node_modules/**'
            ]
        },

        bemhtml : {
            options : {
                predef : [
                    'apply',
                    'applyCtx',
                    'applyNext',
                    'attrs',
                    'bem',
                    'block',
                    'cls',
                    'content',
                    'def',
                    'elem',
                    'elemMatch',
                    'js',
                    'local',
                    'match',
                    'mix',
                    'mod',
                    'mode',
                    'tag',
                    'wrap',
                    'once',
                    'replace',
                    'extend'
                ]
            },
            includes : ['*.blocks/**/*.bemhtml.js']
        },

        bemtree : {
            options : {
                predef : [
                    'apply',
                    'applyCtx',
                    'applyNext',
                    'block',
                    'content',
                    'def',
                    'elem',
                    'match',
                    'mod',
                    'mode',
                    'tag',
                    'wrap',
                    'once',
                    'replace',
                    'extend'
                ]
            },
            includes : ['*.blocks/**/*.bemtree.js']
        },

        bhjs : {
            options : {
                node : true
            },
            includes : ['*.blocks/**/*.bh.js']
        }
    }
};
