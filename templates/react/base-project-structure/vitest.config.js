import react from '@vitejs/plugin-react';
import { configDefaults, defineConfig } from 'vitest/config';

/**
 * https://vitest.dev/config/#configuration
 */
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude],
        include: [
            ...configDefaults.include,
            'src/**/*.{test,spec}.?(c|m)[jt]s?(x)',
            'src/**/*-{test,spec}.?(c|m)[jt]s?(x)',
        ],
        coverage: {
            include: ['src/**'],
            exclude: [...configDefaults.coverage.exclude],
        },
    },
});
