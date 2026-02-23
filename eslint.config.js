import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: [
            'dist/',
            'node_modules/',
            'libs/',
            'test/',
            'common.blocks/inherit/',
            '**/*.spec.js',
            '**/*.tests/**',
            '**/*.tmpl-specs/**',
            '**/*.examples/**',
            '**/*.bemhtml.js',
            '**/*.bh.js',
            'common.bundles/',
        ],
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'no-var': 'off',
            'prefer-const': 'off',
            'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
            'no-prototype-builtins': 'off',
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-cond-assign': 'off',
            'no-unassigned-vars': 'off',
            'no-useless-assignment': 'off',
        },
    },
    {
        files: ['build/**/*.js', '**/*.test.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];
