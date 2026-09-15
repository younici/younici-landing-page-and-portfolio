import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // relative base so the build works both at a domain root and under a
  // GitHub Pages sub-path (/<repo>/)
  base: './',
  plugins: [react()],
  server: { port: 5173 },
  build: { assetsInlineLimit: 0 },
})
