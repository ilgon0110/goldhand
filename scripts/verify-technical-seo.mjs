import { spawn } from 'node:child_process';
import process from 'node:process';

const port = 3100;
const origin = `http://127.0.0.1:${port}`;
const publicRoutes = [
  '/',
  '/company',
  '/manager/about',
  '/manager/work',
  '/price',
  '/voucher',
  '/franchisee',
  '/rental',
  '/event',
  '/review',
  '/reservation',
];
const noIndexRoutes = [
  '/login',
  '/signup',
  '/mypage',
  '/manager',
  '/manager/apply',
  '/reservation/apply',
  '/review/form',
  '/event/form',
];

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(port)], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
});

let startupError;
let serverExit;
let serverReady = false;
let serverOutput = '';

const appendOutput = chunk => {
  serverOutput = `${serverOutput}${chunk}`.slice(-8_000);
  if (/ready/i.test(serverOutput)) serverReady = true;
};

server.stdout.on('data', appendOutput);
server.stderr.on('data', appendOutput);
server.once('error', error => {
  startupError = error;
});
server.once('exit', (code, signal) => {
  serverExit = { code, signal };
});

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const startupFailure = message => {
  const details = serverOutput.trim();
  return new Error(`${message}${details ? `\n${details}` : ''}`);
};

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (startupError) throw startupFailure(`Next production server failed to start: ${startupError.message}`);
    if (serverExit) {
      const { code, signal } = serverExit;
      throw startupFailure(`Next production server exited before becoming ready (code ${code}, signal ${signal ?? 'none'})`);
    }

    try {
      const response = await fetch(origin);
      if (serverReady && response.ok) return;
    } catch {}

    await delay(500);
  }

  throw startupFailure('Next production server did not become ready');
};

const read = async path => {
  const response = await fetch(`${origin}${path}`, { redirect: 'manual' });
  const html = await response.text();
  if (response.status !== 200) throw new Error(`${path}: expected 200, received ${response.status}`);
  return html;
};

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hasAttribute = (tag, name, value) => {
  const escapedName = escapeRegExp(name);
  const escapedValue = escapeRegExp(value);
  return new RegExp(`\\b${escapedName}\\s*=\\s*(?:"${escapedValue}"|'${escapedValue}'|${escapedValue})(?=\\s|/?>)`, 'i').test(tag);
};

const hasTag = (html, name, predicate) => {
  const tags = html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
  return tags.some(predicate);
};

const hasRobotsNoIndex = html =>
  hasTag(html, 'meta', tag =>
    hasAttribute(tag, 'name', 'robots') && /\bcontent\s*=\s*(?:"[^"]*\bnoindex\b[^"]*"|'[^']*\bnoindex\b[^']*'|[^\s>]*\bnoindex\b[^\s>]*)/i.test(tag),
  );

const hasCanonical = (html, canonical) =>
  hasTag(html, 'link', tag => hasAttribute(tag, 'rel', 'canonical') && hasAttribute(tag, 'href', canonical));

const waitForExit = () =>
  new Promise(resolve => {
    if (serverExit) {
      resolve();
      return;
    }
    server.once('exit', resolve);
  });

const terminateServer = async () => {
  if (serverExit) return;

  server.kill('SIGTERM');
  await Promise.race([waitForExit(), delay(5_000)]);
  if (serverExit) return;

  server.kill('SIGKILL');
  await Promise.race([waitForExit(), delay(5_000)]);
  if (!serverExit) throw new Error('Unable to terminate the Next production server');
};

try {
  await waitForServer();

  for (const path of publicRoutes) {
    const html = await read(path);
    if (html.includes('BAILOUT_TO_CLIENT_SIDE_RENDERING')) throw new Error(`${path}: CSR bailout found`);
    if (!html.includes('<main')) throw new Error(`${path}: <main> missing`);
    if (!html.includes('<h1')) throw new Error(`${path}: <h1> missing`);
    if (hasRobotsNoIndex(html)) throw new Error(`${path}: unexpected noindex`);
    const canonical = path === '/' ? 'https://nicegoldhand.com' : `https://nicegoldhand.com${path}`;
    if (!hasCanonical(html, canonical)) throw new Error(`${path}: canonical mismatch`);
  }

  for (const path of noIndexRoutes) {
    const html = await read(path);
    if (!hasRobotsNoIndex(html)) throw new Error(`${path}: noindex missing`);
  }

  const robots = await read('/robots.txt');
  if (!robots.includes('Allow: /') || !robots.includes('Disallow: /api/') || !robots.includes('Sitemap: https://nicegoldhand.com/sitemap.xml')) {
    throw new Error('/robots.txt: policy mismatch');
  }

  const sitemap = await read('/sitemap.xml');
  if (!sitemap.includes('<loc>https://nicegoldhand.com/manager/work</loc>')) throw new Error('/sitemap.xml: public URL missing');
  if (sitemap.includes('/reservation/apply')) throw new Error('/sitemap.xml: private URL found');

  console.log('Technical SEO production verification passed.');
} finally {
  await terminateServer();
}
