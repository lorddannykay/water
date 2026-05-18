import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const TUNNEL_ALLOWED_HOSTS = [
  '.loca.lt',
  '.trycloudflare.com',
  '.ngrok-free.app',
] as const;

/** GitHub Pages project sites live at /<repo>/; CI sets GITHUB_REPOSITORY=owner/repo */
function githubPagesBase(): string {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  return repo ? `/${repo}/` : '/';
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const tunnelMode = process.env.TUNNEL === '1';
  return {
    base: githubPagesBase(),
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      // TUNNEL=1 disables HMR so HTTPS tunnels (loca.lt / trycloudflare) do not hang on bad WS.
      hmr:
        process.env.DISABLE_HMR === 'true' || tunnelMode ? false : true,
      // Tunnel providers use random subdomains
      allowedHosts: [...TUNNEL_ALLOWED_HOSTS],
    },
    // Production build + `vite preview`: no @vite/client / HMR WebSockets (works through localtunnel).
    preview: {
      host: '127.0.0.1',
      port: 3000,
      strictPort: true,
      allowedHosts: [...TUNNEL_ALLOWED_HOSTS],
    },
  };
});
