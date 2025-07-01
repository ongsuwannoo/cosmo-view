import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@/components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@/pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: '@/stores', replacement: path.resolve(__dirname, './src/stores') },
      {
        find: '@cosmo-view/ui',
        replacement: path.resolve(__dirname, '../../packages/ui/dist/index.js'),
      },
      {
        find: '@cosmo-view/ui/styles',
        replacement: path.resolve(__dirname, '../../packages/ui/dist/styles.css'),
      },
    ],
  },
  server: {
    port: 3000,
    open: true,
  },
});
