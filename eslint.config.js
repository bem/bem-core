import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: [
            'dist/',
            'docs/',
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
            'docs/',
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
            'no-var': 'error',
            'prefer-const': 'error',
            'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
            'no-prototype-builtins': 'error',
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-cond-assign': 'off',
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
