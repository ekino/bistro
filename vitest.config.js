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
    },
});
