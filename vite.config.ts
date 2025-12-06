import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Vite 5 config optimized for GitHub Pages and React 18.
export default defineConfig({
  plugins: [react()],
  base: '/circuit-symphony/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    https: false,
  },
})
