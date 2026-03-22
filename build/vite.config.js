import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import bemLevels from './plugins/vite-plugin-bem-levels.js';

const rootDir = resolve(import.meta.dirname, '..');

export default defineConfig(({ mode }) => {
    const platform = process.env.BEM_PLATFORM || 'desktop';

    return {
        root: rootDir,

        plugins: [
            bemLevels({
                platform,
                levels: {
                    common: ['common.blocks'],
                    desktop: ['common.blocks', 'desktop.blocks'],
                    touch: ['common.blocks', 'touch.blocks'],
                },
                rootDir,
            }),
        ],

        build: {
            lib: {
                entry: resolve(import.meta.dirname, 'platforms', `${platform}.js`),
                name: 'bemCore',
                formats: ['es', 'umd'],
                fileName: (format) => `bem-core.${format === 'es' ? 'mjs' : 'js'}`,
            },
            outDir: resolve(rootDir, 'dist', platform),
            emptyOutDir: true,
            sourcemap: true,
            minify: mode === 'production',
            rolldownOptions: {
                external: ['jquery'],
                output: {
                    globals: {
                        jquery: 'jQuery',
                    },
                },
            },
        },

        server: {
            open: false,
        },
    };
});
