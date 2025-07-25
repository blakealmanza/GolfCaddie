import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: 'prompt',
			injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				name: 'GolfCaddie',
				short_name: 'GolfCaddie',
				description:
					'A golf app designed to guide you and help you achieve lower scores',
				theme_color: '#E2F4ED',
			},

			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
			},

			devOptions: {
				enabled: false,
				navigateFallback: 'index.html',
				suppressWarnings: true,
				type: 'module',
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@shared': path.resolve(__dirname, '../shared'),
		},
	},
});
