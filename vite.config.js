import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue()
    // Removed VitePWA plugin
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'resources/public',
  build: {
    outDir: 'dist',
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      external: [
        '/images/sbjochoffa.webp'
      ],
      output: {
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: {
          vendor: ['vue', '@capacitor/core']
        }
      }
    },
    copyPublicDir: true  // Ensure public files are copied
  }
});