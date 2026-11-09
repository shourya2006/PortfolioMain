import assert from 'node:assert/strict';
import test from 'node:test';
import { createContactHandler } from '../lib/contact-server.ts';

const origin = 'https://portfolio.example';
const valid = { name: 'Ada Lovelace', email: 'ada@example.com', subject: 'Working together', message: 'I would like to discuss a software project.' };
const env = { RESEND_API_KEY: 're_unit_test_only' };
function request(payload = valid, headers = {}) {
  return new Request(`${origin}/api/contact`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.9', ...headers }, body: JSON.stringify(payload) });
}
const mustNotSend = async () => { assert.fail('No provider request should be made'); };

for (const [label, payload] of [
  ['short name', { ...valid, name: 'A' }],
  ['long name', { ...valid, name: 'A'.repeat(101) }],
  ['invalid email', { ...valid, email: 'not-an-email' }],
  ['empty domain label', { ...valid, email: 'a@invalid..com' }],
  ['email line break', { ...valid, email: 'ada@example.com\nBcc: other@example.com' }],
  ['subject header injection', { ...valid, subject: 'Hi\r\nBcc: other@example.com' }],
  ['long subject', { ...valid, subject: 'x'.repeat(161) }],
  ['short message', { ...valid, message: 'short' }],
  ['long message', { ...valid, message: 'x'.repeat(5001) }],
  ['invalid request id', { ...valid, requestId: 'not-a-uuid' }],
]) {
  test(`rejects ${label} without sending`, async () => {
    const handle = createContactHandler({ fetch: mustNotSend });
    const response = await handle(request(payload), env);
    assert.equal(response.status, 400);
    assert.equal((await response.json()).ok, false);
  });
}

test('requires the contact page origin and JSON; never sends cross-site requests', async () => {
  const handle = createContactHandler({ fetch: mustNotSend });
  for (const headers of [{ Origin: 'https://other.example' }, { Origin: 'null' }, { 'Sec-Fetch-Site': 'cross-site' }]) {
    const response = await handle(request(valid, headers), env);
    assert.equal(response.status, 403);
  }
  const noOrigin = request(); noOrigin.headers.delete('Origin');
  assert.equal((await handle(noOrigin, env)).status, 403);
  assert.equal((await handle(request(valid, { 'Content-Type': 'text/plain' }), env)).status, 415);
});

test('rejects non-POST and malformed JSON without sending', async () => {
  const handle = createContactHandler({ fetch: mustNotSend });
  const get = await handle(new Request(`${origin}/api/contact`), env);
  assert.equal(get.status, 405); assert.equal(get.headers.get('Allow'), 'POST');
  const malformed = new Request(`${origin}/api/contact`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{' });
  assert.equal((await handle(malformed, env)).status, 400);
});

test('caps both declared and undeclared request body sizes', async () => {
  const handle = createContactHandler({ fetch: mustNotSend });
  assert.equal((await handle(request(valid, { 'Content-Length': '999999' }), env)).status, 413);
  const large = new Request(`${origin}/api/contact`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...valid, message: 'x'.repeat(30_000) }) });
  assert.equal((await handle(large, env)).status, 413);
});

test('missing configuration is an honest unavailable response', async () => {
  const handle = createContactHandler({ fetch: mustNotSend });
  const response = await handle(request(), {});
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.ok, false); assert.match(body.error, /not available/i);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});

test('honeypot acknowledges without calling Resend, including when unconfigured', async () => {
  const handle = createContactHandler({ fetch: mustNotSend });
  const response = await handle(request({ website: 'https://bot.invalid' }), {});
  assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true });
});

test('sends only the validated server-configured payload with escaped HTML and reply_to', async () => {
  const id = '72831ed1-c625-44d6-8104-a6499ddf1879';
  let calls = 0;
  const handle = createContactHandler({ fetch: async (url, init) => {
    calls += 1;
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(init.method, 'POST');
    assert.equal(init.headers.Authorization, 'Bearer re_unit_test_only');
    assert.equal(init.headers['Idempotency-Key'], `portfolio-contact/${id}`);
    assert.equal(init.signal.aborted, false);
    const body = JSON.parse(init.body);
    assert.equal(body.from, 'Portfolio <contact@example.com>');
    assert.deepEqual(body.to, ['owner@example.com']);
    assert.equal(body.reply_to, 'ada@example.com');
    assert.equal(body.subject, 'Portfolio contact: A <b>great</b> fit');
    assert.match(body.text, /<script>alert\("hello"\)<\/script>/);
    assert.match(body.html, /&lt;script&gt;alert\(&quot;hello&quot;\)&lt;\/script&gt;/);
    assert.match(body.html, /&lt;Ada &amp; &quot;Test&quot;&gt;/);
    assert.doesNotMatch(body.html, /<script>/);
    assert.equal(body.to.includes('attacker@example.com'), false);
    return Response.json({ id: 'provider-message-id' });
  } });
  const payload = { ...valid, name: '  <Ada & "Test">  ', email: ' ada@example.com ', subject: ' A <b>great</b> fit ', message: '<script>alert("hello")</script>\nMore & details here.', requestId: id, to: 'attacker@example.com', from: 'attacker@example.com' };
  const response = await handle(request(payload), { ...env, RESEND_FROM_EMAIL: 'Portfolio <contact@example.com>', CONTACT_TO_EMAIL: 'owner@example.com' });
  assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true }); assert.equal(calls, 1);
});

test('uses the explicitly authorized recipient and safe default sender', async () => {
  const handle = createContactHandler({ fetch: async (_url, init) => {
    const body = JSON.parse(init.body);
    assert.deepEqual(body.to, ['bafna.shourya2023@gmail.com']);
    assert.equal(body.from, 'onboarding@resend.dev');
    assert.equal(init.headers['Idempotency-Key'], undefined);
    return Response.json({ id: 'provider-message-id' });
  } });
  assert.equal((await handle(request(), env)).status, 200);
});

test('provider rejection, invalid receipt, and fetch timeout never report success or leak provider details', async () => {
  const providers = [
    async () => Response.json({ message: 'Secret provider details re_unit_test_only' }, { status: 403 }),
    async () => Response.json({ error: 'not an accepted receipt' }),
    async () => { throw new DOMException('Provider private timeout details', 'TimeoutError'); },
  ];
  for (const fetch of providers) {
    const handle = createContactHandler({ fetch });
    const response = await handle(request(), env);
    assert.equal(response.status, 502);
    const body = await response.json(); assert.equal(body.ok, false);
    assert.doesNotMatch(JSON.stringify(body), /re_unit_test_only|Secret provider|private timeout/);
  }
});

test('rate limits provider attempts per visitor, expires, and does not block a different visitor', async () => {
  let time = 0, calls = 0;
  const handle = createContactHandler({ now: () => time, fetch: async () => { calls += 1; return Response.json({ id: 'provider-message-id' }); } });
  for (let i = 0; i < 5; i++) assert.equal((await handle(request(), env)).status, 200);
  const blocked = await handle(request(), env);
  assert.equal(blocked.status, 429); assert.equal(blocked.headers.get('Retry-After'), '600'); assert.equal(calls, 5);
  assert.equal((await handle(request(valid, { 'CF-Connecting-IP': '203.0.113.10' }), env)).status, 200);
  time = 600_001;
  assert.equal((await handle(request(), env)).status, 200); assert.equal(calls, 7);
});
