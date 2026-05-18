/**
 * Runs a remotely managed Cloudflare Tunnel using a connector token.
 * Create the tunnel in Zero Trust → Networks → Tunnels, then paste the token into .env.local.
 */
import { spawn } from 'node:child_process';
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local'), override: true });

const token =
  process.env.CLOUDFLARE_TUNNEL_TOKEN?.trim() ||
  process.env.TUNNEL_TOKEN?.trim();

if (!token) {
  console.error(
    'Set CLOUDFLARE_TUNNEL_TOKEN (or TUNNEL_TOKEN) in your environment or .env.local.\n' +
      'Zero Trust → Networks → Tunnels → your tunnel → Install connector → copy token.',
  );
  process.exit(1);
}

const child = spawn(
  'npx',
  ['--yes', 'cloudflared', 'tunnel', '--no-autoupdate', 'run', '--token', token],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  },
);

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
