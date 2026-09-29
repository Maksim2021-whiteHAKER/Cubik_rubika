// vitest.config.js
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            setupFiles: ['./Scripts/tests/setup.js'],
            globals: true,
            include: ['Scripts/tests/**/*.test.js'],
            exclude: ['node_modules', 'dist'],
            coverage: {
                provider: 'v8',
                include: ['Scripts/cube/**/*.js'],
                exclude: ['**/*.test.js', '**/tests/**'],
            },
        },
    })
);