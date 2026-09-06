/**
 * Iron Log — AI proxy (Cloudflare Worker, free tier)
 *
 * Why this exists:
 *   1. NVIDIA's API sends no CORS headers, so a browser cannot call it directly.
 *   2. An API key inside a static site is public — anyone can read it from the
 *      page source. Here the key lives in Cloudflare's secret store instead and
 *      never reaches the browser.
 *
 * Setup:
 *   Workers → Create → paste this → Deploy
 *   Settings → Variables and Secrets → Add:
 *       NVIDIA_API_KEY   type Secret   your nvapi-... key
 *       ALLOWED_ORIGIN   type Text     e.g. https://amiralikh97.github.io
 *                                      optional; comma-separate for several
 *   Deploy again after adding them.
 *
 *   Cannot find that screen? Use FALLBACK_API_KEY below instead. ALLOWED_ORIGIN
 *   is optional - without it the proxy accepts any origin, which is workable
 *   for personal use but means anyone who learns your Worker URL could use it.
 *   Then point the app at:  https://<worker>.workers.dev/v1/chat/completions
 *   and leave the app's API key field empty.
 */

const UPSTREAM = 'https://integrate.api.nvidia.com/v1/chat/completions';

// ---------------------------------------------------------------------------
// If you cannot find the dashboard's Variables UI, you can fill these in here
// instead. Anything set as a dashboard variable/secret wins over these.
//
// This file lives in a PUBLIC repo, so if you paste your key below, do NOT
// commit it - edit it only in the Cloudflare editor. Setting NVIDIA_API_KEY as
// an encrypted secret in the dashboard is still the better option.
// ---------------------------------------------------------------------------
const FALLBACK_API_KEY = '';        // e.g. 'nvapi-...'  (leave empty if using a secret)
const FALLBACK_ALLOWED_ORIGIN = ''; // e.g. 'https://amiralikh97.github.io'

// Models this proxy is willing to forward. Stops a leaked worker URL being
// used to run anything at your expense.
const ALLOWED_MODELS = [
  'deepseek-ai/deepseek-v4-pro-0813',
  'deepseek-ai/deepseek-v4-flash-0731'
];

const MAX_BODY_BYTES = 200_000;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGIN || FALLBACK_ALLOWED_ORIGIN || '')
      .split(',').map(s => s.trim()).filter(Boolean);

    // With no ALLOWED_ORIGIN set, fall back to echoing the origin so local
    // development works. Set it in production.
    const allowOrigin =
      allowed.length === 0 ? (origin || '*')
      : allowed.includes(origin) ? origin
      : null;

    const cors = {
      'Access-Control-Allow-Origin': allowOrigin || 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    if (allowOrigin === null) {
      return json({ error: 'Origin not allowed. Add it to ALLOWED_ORIGIN.' }, 403, cors);
    }
    if (request.method !== 'POST') {
      return json({ error: 'POST only.' }, 405, cors);
    }
    const apiKey = env.NVIDIA_API_KEY || FALLBACK_API_KEY;
    if (!apiKey) {
      return json({ error: 'No API key. Set the NVIDIA_API_KEY secret on this Worker, or fill in FALLBACK_API_KEY at the top of the code.' }, 500, cors);
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ error: 'Request too large.' }, 413, cors);
    }

    let body;
    try { body = JSON.parse(raw); }
    catch { return json({ error: 'Body must be JSON.' }, 400, cors); }

    if (!Array.isArray(body.messages) || !body.messages.length) {
      return json({ error: 'messages[] is required.' }, 400, cors);
    }
    if (body.model && !ALLOWED_MODELS.includes(body.model)) {
      return json({ error: `Model not allowed. Permitted: ${ALLOWED_MODELS.join(', ')}` }, 400, cors);
    }

    const payload = {
      ...body,
      model: body.model || ALLOWED_MODELS[0],
      max_tokens: Math.min(Number(body.max_tokens) || 2048, 4096)
    };

    let upstream;
    try {
      upstream = await fetch(UPSTREAM, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: payload.stream ? 'text/event-stream' : 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      return json({ error: 'Upstream unreachable: ' + e.message }, 502, cors);
    }

    // Stream straight through so tokens appear as they are generated.
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...cors,
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' }
  });
}
