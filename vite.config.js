// vite.config.js
import { defineConfig } from 'vite';
// If you use React Fast Refresh & JSX auto transform, keep this plugin.
// If your project doesn't have it installed, remove the next two lines.
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    // Remove plugins: [react()] if you don't use @vitejs/plugin-react
    plugins: [react()],

    build: {
      // ✅ No readable source maps in production bundles
      sourcemap: false,

      // Minify/obfuscate with esbuild (default)
      minify: 'esbuild',

      // Reasonable modern target for smaller bundles
      target: 'es2018',

      // Optional: tighter code-splitting control (tweak as you like)
      rollupOptions: {
        output: {
          // Example: put React in its own chunk to improve caching
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },

    // Extra obfuscation: strip console/debugger only for prod
    esbuild: isProd
      ? {
          drop: ['console', 'debugger'],
          legalComments: 'none',
        }
      : {
          legalComments: 'eof',
        },
  };
});
