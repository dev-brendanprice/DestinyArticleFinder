import js from '@eslint/js';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            semi: ['error', 'always'],
            curly: ['error', 'all'],
            'brace-style': ['error', '1tbs', { allowSingleLine: true }]
        }
    },
    js.configs.recommended
];
