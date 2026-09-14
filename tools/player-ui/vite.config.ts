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
        admin: resolve(import.meta.dirname, 'entries/admin.ts'),
        broadcaster: resolve(import.meta.dirname, 'entries/broadcaster.ts'),
        player: resolve(import.meta.dirname, 'entries/player.ts'),
        viewer: resolve(import.meta.dirname, 'entries/viewer.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: asset => asset.name === 'style.css' ? 'app.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
