import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative paths so the site works under GitHub Pages project subpaths
  base: "./",
  plugins: [react()],
})
