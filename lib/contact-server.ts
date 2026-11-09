/** Server-only contact endpoint. Secrets and recipient configuration stay in Worker bindings. */
export interface ContactEnvironment {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
}

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  requestId?: string;
};

type ProviderFetch = (url: string, init: RequestInit) => Promise<Response>;
type ContactDependencies = {
  fetch?: ProviderFetch;
  now?: () => number;
};

type RateEntry = { count: number; expiresAt: number };
const MAX_BODY_BYTES = 24 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;
const MAX_RATE_ENTRIES = 2048;
const DEFAULT_RECIPIENT = 'bafna.shourya2023@gmail.com';
const DEFAULT_FROM = 'onboarding@resend.dev';
const EMAIL = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HEADER_CONTROL = /[\u0000-\u001f\u007f\u2028\u2029]/;
const MESSAGE_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

function json(status: number, body: { ok: true } | { ok: false; error: string }, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('Origin');
  if (!origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') return false;
  try {
    const source = new URL(origin);
    return source.origin === new URL(request.url).origin && origin === source.origin;
  } catch {
    return false;
  }
}

async function readBody(request: Request): Promise<{ value: unknown } | { error: Response }> {
  const length = request.headers.get('Content-Length');
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) {
    return { error: json(413, { ok: false, error: 'Your message is too large. Please shorten it and try again.' }) };
  }
  const reader = request.body?.getReader();
  if (!reader) return { error: json(400, { ok: false, error: 'Please fill in the contact form.' }) };
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        return { error: json(413, { ok: false, error: 'Your message is too large. Please shorten it and try again.' }) };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return { value: JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) };
  } catch {
    return { error: json(400, { ok: false, error: 'The contact form could not be read. Please try again.' }) };
  } finally {
    reader.releaseLock();
  }
}

function validate(value: Record<string, unknown>): ContactPayload | string {
  if (typeof value.name !== 'string') return 'Please enter your name.';
  const name = value.name.trim();
  if (name.length < 2 || name.length > 100 || HEADER_CONTROL.test(name)) return 'Please enter a name between 2 and 100 characters.';
  if (typeof value.email !== 'string') return 'Please enter a valid email address.';
  const email = value.email.trim();
  if (email.length > 254 || email.split('@')[0].length > 64 || email.startsWith('.') || email.includes('..') || email.includes('.@') || !EMAIL.test(email) || HEADER_CONTROL.test(email)) return 'Please enter a valid email address.';
  if (typeof value.subject !== 'string') return 'Please enter a subject.';
  const subject = value.subject.trim();
  if (subject.length > 160 || HEADER_CONTROL.test(subject)) return 'Please keep the subject under 160 characters on one line.';
  if (typeof value.message !== 'string') return 'Please enter your message.';
  const message = value.message.trim();
  if (message.length < 10 || message.length > 5000 || MESSAGE_CONTROL.test(message)) return 'Please write a message between 10 and 5,000 characters.';
  if (value.requestId !== undefined && (typeof value.requestId !== 'string' || !UUID.test(value.requestId))) return 'Please refresh the contact form and try again.';
  return { name, email, subject, message, requestId: value.requestId as string | undefined };
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}

export function createContactHandler(dependencies: ContactDependencies = {}) {
  const providerFetch: ProviderFetch = dependencies.fetch ?? ((url, init) => fetch(url, init));
  const now = dependencies.now ?? Date.now;
  // Per-isolate, short-lived limits. No message content or persistent visitor record is stored.
  const rateEntries = new Map<string, RateEntry>();

  return async function handleContact(request: Request, env: ContactEnvironment): Promise<Response> {
    if (request.method !== 'POST') return json(405, { ok: false, error: 'Please submit the contact form to send a message.' }, { Allow: 'POST' });
    if (!sameOrigin(request)) return json(403, { ok: false, error: 'Please send your message from this website.' });
    if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return json(415, { ok: false, error: 'The contact form could not be read. Please refresh and try again.' });
    }
    const parsed = await readBody(request);
    if ('error' in parsed) return parsed.error;
    if (!parsed.value || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) return json(400, { ok: false, error: 'Please fill in the contact form.' });
    const fields = parsed.value as Record<string, unknown>;
    // A filled hidden field is a bot submission; acknowledge it without sending an email.
    if (typeof fields.website === 'string' && fields.website.trim()) return json(200, { ok: true });
    const payload = validate(fields);
    if (typeof payload === 'string') return json(400, { ok: false, error: payload });

    const apiKey = env.RESEND_API_KEY?.trim();
    const from = env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;
    const to = env.CONTACT_TO_EMAIL?.trim() || DEFAULT_RECIPIENT;
    if (!apiKey || !EMAIL.test(to) || HEADER_CONTROL.test(from) || from.length > 320) {
      return json(503, { ok: false, error: 'Contact is not available yet. Please use LinkedIn for now.' });
    }

    const time = now();
    const visitor = request.headers.get('CF-Connecting-IP') || 'anonymous';
    let entry = rateEntries.get(visitor);
    if (!entry || entry.expiresAt <= time) {
      for (const [key, stored] of rateEntries) if (stored.expiresAt <= time) rateEntries.delete(key);
      if (rateEntries.size >= MAX_RATE_ENTRIES) rateEntries.delete(rateEntries.keys().next().value!);
      entry = { count: 0, expiresAt: time + RATE_WINDOW_MS };
      rateEntries.set(visitor, entry);
    }
    if (entry.count >= RATE_MAX_REQUESTS) {
      return json(429, { ok: false, error: 'You have sent several messages. Please wait a few minutes before trying again.' }, { 'Retry-After': String(Math.max(1, Math.ceil((entry.expiresAt - time) / 1000))) });
    }
    entry.count += 1;

    const subject = payload.subject ? `Portfolio contact: ${payload.subject}` : 'Portfolio contact';
    const text = `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject || '(not provided)'}\n\n${payload.message}`;
    const html = `<h2>New portfolio message</h2><p><strong>Name:</strong> ${escapeHtml(payload.name)}<br><strong>Email:</strong> ${escapeHtml(payload.email)}<br><strong>Subject:</strong> ${escapeHtml(payload.subject || '(not provided)')}</p><div style="white-space:pre-wrap;overflow-wrap:anywhere">${escapeHtml(payload.message)}</div>`;
    const headers: Record<string, string> = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
    if (payload.requestId) headers['Idempotency-Key'] = `portfolio-contact/${payload.requestId}`;
    try {
      const response = await providerFetch('https://api.resend.com/emails', {
        method: 'POST',
        headers,
        body: JSON.stringify({ from, to: [to], reply_to: payload.email, subject, text, html }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!response.ok) {
        await response.body?.cancel();
        return json(response.status === 429 ? 503 : 502, { ok: false, error: 'Your message could not be sent right now. Please try again shortly or use LinkedIn.' });
      }
      const receipt = await response.json() as { id?: unknown };
      if (typeof receipt.id !== 'string' || !receipt.id.trim()) throw new Error('Missing delivery receipt');
      return json(200, { ok: true });
    } catch {
      return json(502, { ok: false, error: 'Your message could not be sent right now. Please try again shortly or use LinkedIn.' });
    }
  };
}

export const handleContact = createContactHandler();
