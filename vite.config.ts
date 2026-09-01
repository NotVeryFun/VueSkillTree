import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // 1. Import the plugin
// https://vite.dev/config/
export default defineConfig({
  build: {
      minify: 'terser',
      terserOptions: {
          compress: {
              drop_console: true,
              drop_debugger: true,
          },
      },
  },

  plugins: [
    vue(),
    tailwindcss()
  
  ],
  base: '/VueSkillTree/',
  server: {
      port: 6538
  },
  
})
