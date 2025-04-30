import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react'
import svgo from 'vite-plugin-svgo'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import path from 'path';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  assetsInclude: ['**/*.md'],
  build: {
    minify: true,
    rollupOptions: {
      external: (id: string) => {
        if (!process.env.BUILD_PLUGINS) {
          return path.normalize(id).includes('/plugins/')
        }
        return false;
      }
    }
  },
  plugins: [ UnoCSS(), react(
    {
      jsxImportSource: '@emotion/react', babel: {
        plugins: ['@emotion/babel-plugin', 'babel-plugin-macros'],
      },
    }
  ),
    svgo({
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false
            }
          }
        }
      ]
    }),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    // gzip
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz'
    }),
    // brotli
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
