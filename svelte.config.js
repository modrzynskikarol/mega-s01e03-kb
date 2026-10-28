import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

// Render setup for the exported kb: .svx pages, the `runbook` layout, and the #lib alias.
// Not the desk's own config (that stayed in the `support` repo); this is a minimal stand-in.
/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.svx'],
      layout: { runbook: fileURLToPath(new URL('./src/lib/layouts/runbook.svelte', import.meta.url)) }
    })
  ],
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: undefined }),
    alias: { '#lib': 'src/lib' }
  }
};
