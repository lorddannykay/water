/**
 * Lists Cloudflare Tunnels for the account via the REST API (Tunnel API).
 * https://developers.cloudflare.com/api/resources/zero_trust/subresources/tunnels/methods/list/
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local'), override: true });

const accountId = process.env.CF_ACCOUNT_ID?.trim();
const apiToken =
  process.env.CF_API_TOKEN?.trim() ||
  process.env.CLOUDFLARE_API_TOKEN?.trim();

if (!accountId || !apiToken) {
  console.error(
    'Set CF_ACCOUNT_ID and CF_API_TOKEN (or CLOUDFLARE_API_TOKEN).\n' +
      'API token needs permission to read Cloudflare Tunnel for that account.',
  );
  process.exit(1);
}

const url = new URL(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/tunnels`,
);
url.searchParams.set('is_deleted', 'false');
url.searchParams.set('per_page', '50');

const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
  },
});

const body = await res.json().catch(() => ({}));

if (!res.ok || body.success === false) {
  console.error('Tunnel API error:', res.status, JSON.stringify(body, null, 2));
  process.exit(1);
}

const tunnels = body.result ?? [];
if (tunnels.length === 0) {
  console.log('No active tunnels in this account (or empty page).');
  process.exit(0);
}

for (const t of tunnels) {
  const line = [
    t.name ?? '(unnamed)',
    t.id,
    t.status ?? '?',
    t.config_src ? `config:${t.config_src}` : '',
  ]
    .filter(Boolean)
    .join(' | ');
  console.log(line);
}
