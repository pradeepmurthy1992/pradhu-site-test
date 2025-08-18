// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⬇️ replace `pradhu-site` with YOUR repo name if this is a project page.
// If you use a user/org page repo named <username>.github.io, set base: '/' instead.
export default defineConfig({
  base: '/pradhu-site-test/',
  plugins: [react()],
})
