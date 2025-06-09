import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server:{
    host: '0.0.0.0',
    port: 8082,
    proxy:{
      ['/api']: {
        // target: 'http://localhost:8081',
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        rewrite:(path) => path.replace(new RegExp(`^/api`),"")
      }
    }
  }
})
