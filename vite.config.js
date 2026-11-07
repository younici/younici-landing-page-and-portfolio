import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Younici-Landing-page-and-portfolio/',
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['younici.com'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
  build: {
    assetsInlineLimit: 0,
  },
})