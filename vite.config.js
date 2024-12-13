// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,mp3}']
      },
      includeAssets: ['**/*'],
      manifest: {
        name: 'NiseAmen',
        short_name: 'NiseAmen',
        theme_color: '#1e1b4b',
        start_url: '/',
        display: 'standalone',
        background_color: '#1e1b4b',
        icons: [
          {
            src: '/resources/AppImages/ios/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/resources/AppImages/ios/512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'resources/public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      external: [
        '/images/sbjochoffa.webp'
      ],
      output: {
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});