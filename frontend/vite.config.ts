import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		svgr(),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: 'auto',

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
				background_color: '#E2F4ED',
				orientation: 'portrait',
				display: 'standalone',
				display_override: ['standalone', 'window-controls-overlay'],
				start_url: '/',
				id: '/',

				// Chrome specific config
				...({ form_factor: ['narrow', 'wide'] } as any),
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
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						if (id.includes('react')) return 'vendor_react';
						if (id.includes('@tanstack')) return 'vendor_tanstack';
						if (id.includes('firebase')) return 'vendor_firebase';
						if (id.includes('maplibre-gl')) return 'vendor_maplibre';
						return 'vendor_node_modules';
					}
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@shared': path.resolve(__dirname, '../shared'),
		},
	},
});
