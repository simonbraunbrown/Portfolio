import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	root: './src/',
	base: '',

	resolve: {
		preserveSymlinks: true,
		alias: {
			'@': resolve(dir, 'src'),
		},
	},

	cacheDir: resolve(dir, 'node_modules/.vite'),
	publicDir: true,

	css: {
		devSourcemap: true,
	},

	build: {
		outDir: resolve(dir, './dist/'),
		emptyOutDir: true,
		minify: 'esbuild',

		rollupOptions: {
			output: {
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split('.').at(1);
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {

						extType = 'img';
						return `assets/${extType}/[name]-[hash][extname]`;
					}

					return `assets/[name]-[hash][extname]`;
					
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
			},
		},
	},

	plugins: [eslint()],
});
