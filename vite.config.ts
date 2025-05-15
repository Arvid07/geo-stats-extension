import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      // Tell Rollup to treat `background.ts` as another entry point
      input: {
        // main SPA entry:
        main: 'index.html',
        // background service worker entry:
        background: 'src/background.ts',
        // content script:
        content: 'src/content_script.ts'
      },
      output: {
        // ensure the background chunk is emitted as background.js
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') return 'background.js';
          if (chunkInfo.name === 'content')    return 'content_script.js';
          return '[name].js';
        }
      }
    },
    // Since extensions don't need hashed file names:
    assetsDir: '.'
  }
});
