import { configDefaults, defineConfig } from 'vitest/config';

// https://vitest.dev/config/
export default defineConfig({
    test: {
        exclude: [...configDefaults.exclude],
        include: [
            ...configDefaults.include,
            'src/**/*.{test,spec}.?(c|m)[jt]s?(x)',
            'src/**/*-{test,spec}.?(c|m)[jt]s?(x)',
        ],
        coverage: {
            exclude: [
                ...configDefaults.coverage.exclude,
                '**/AppLogger.js',
                '**/bistro-cli.js',
                '**/bistro-project-structure-cli.js',
            ],
        },
    },
});
