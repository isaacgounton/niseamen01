import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: {
          vendor: ['vue', '@capacitor/core']
        }
      }
    }
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/',
      'Cache-Control': 'no-store',
    },
  }
});