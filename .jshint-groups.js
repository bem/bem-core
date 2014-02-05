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
        quotmark : 'single'
    },

    groups : {
        vanillajs : {
            options : {
                predef : ['modules']
            },
            includes : ['*.blocks/**/*.vanilla.js']
        },

        browserjs : {
            options : {
                browser : true,
                predef : ['modules']
            },
            includes : ['*.blocks/**/*.js'],
            excludes : [
                '**/*.i18n*/**',
                '**/*.bemhtml/**',
                '**/*.bemjson.js',
                '**/*.deps.js',
                '**/*.node.js',
                '**/*.spec.js',
                '**/*.vanilla.js'
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
                    'js',
                    'local',
                    'match',
                    'mix',
                    'mode',
                    'tag'
                ]
            },
            includes : ['*.blocks/**/*.bemhtml'],
            excludes : ['**/*.test.bemhtml/**']
        },

        bemjsonjs : {
            options : {
                asi : true
            },
            includes : ['*.bundles/**/*.bemjson.js']
        }
    }
};
