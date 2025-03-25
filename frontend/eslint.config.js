import js from '@eslint/js';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            semi: ['error', 'always'], // Ensures semicolons everywhere
            curly: ['error', 'all'], // Forces braces for all blocks
            'brace-style': ['error', '1tbs', { allowSingleLine: true }], // Enforces consistent brace style
            'lines-before-comment': ['error', { beforeBlockComment: true, beforeLineComment: true }] // Adds blank lines before comments
        }
    },
    js.configs.recommended
];
