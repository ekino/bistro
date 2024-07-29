import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
    // global ignores
    {
        ignores: ['dist/**', 'node_modules/**', 'bin/**', 'build/**'],
    },
    pluginJs.configs.recommended,
    {
        files: ['src/**/*.js'],
        rules: {
            ...pluginJs.configs.recommended.rules,
            'no-console': 'error',
        },
    },
    eslintConfigPrettier,
];
