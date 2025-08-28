// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Auto-detect correct base when building on GitHub Pages.
// - Repo pages:   https://user.github.io/<repo>/  -> base = "/<repo>/"
// - User/Org page https://user.github.io          -> base = "/"
// - Local/dev or other hosts                      -> base = process.env.VITE_BASE || "/"
function detectBase() {
  const repo = process.env.GITHUB_REPOSITORY
    ? process.env.GITHUB_REPOSITORY.split('/').pop()
    : '';

  if (!repo) return process.env.VITE_BASE || '/';

  const isUserOrOrgPage = /\.github\.io$/i.test(repo);
  if (isUserOrOrgPage) return '/';

  return `/${repo}/`;
}

export default defineConfig(({ mode }) => ({
  base: detectBase(),

  plugins: [react()],

  build: {
    sourcemap: false,      // no readable source maps in prod
    minify: 'esbuild',     // fast minification/obfuscation
    target: 'es2018',
  },

  // Keep console in prod for now to surface runtime errors if any.
  // After you verify everything, you can set drop: ['console','debugger'].
  esbuild: mode === 'production'
    ? { legalComments: 'none' }
    : { legalComments: 'eof' },
}));
