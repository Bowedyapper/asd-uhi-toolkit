import { defineConfig, externalizeDepsPlugin  } from 'electron-vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as path from 'path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      watch: {}
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [svelte()],
    resolve: {
      alias: [
        { find: '$lib', replacement: path.resolve(__dirname, 'src/renderer/src/lib') },
        { find: '$views', replacement: path.resolve(__dirname, 'src/renderer/src/views') },
        {
          find: '$components',
          replacement: path.resolve(__dirname, 'src/renderer/src/components')
        },
        { find: '$stores', replacement: path.resolve(__dirname, 'src/renderer/src/lib/stores') },
        { find: '$resources', replacement: path.resolve(__dirname, 'resources') },
        { find: '$assets', replacement: path.resolve(__dirname, 'src/renderer/src/assets')}
      ]
    }
  }
});
