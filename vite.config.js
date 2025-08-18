import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pradhu-site-test/', // <-- repo name for GitHub Pages project site
  plugins: [react()],
})
