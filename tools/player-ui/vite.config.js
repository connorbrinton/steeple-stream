import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    outDir: resolve(import.meta.dirname, '../../public/build'),
    emptyOutDir: true,
    target: 'es2022',
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        admin: resolve(import.meta.dirname, 'entries/admin.js'),
        broadcaster: resolve(import.meta.dirname, 'entries/broadcaster.js'),
        player: resolve(import.meta.dirname, 'entries/player.js'),
        viewer: resolve(import.meta.dirname, 'entries/viewer.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: asset => asset.name === 'style.css' ? 'app.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
