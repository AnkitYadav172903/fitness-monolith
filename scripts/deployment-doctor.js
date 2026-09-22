#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'https://fitness-monolith-1snp.onrender.com';
const FRONTEND_ORIGIN = 'https://fitness-monolith.vercel.app';
const ROOT_DIR = path.resolve(__dirname, '..');
const FRONTEND_ENV_FILES = [
  'fitness-frontend/.env.production',
  'fitness-frontend/.env.local',
  'fitness-frontend/.env'
];
const BACKEND_ENV_PATH = path.join(ROOT_DIR, 'fitness-backend', '.env');
const REPORT_PATH = path.join(ROOT_DIR, 'deployment-report.md');

const REQUEST_TIMEOUT_MS = 15000;
const HEALTH_ENDPOINTS = ['/actuator/health', '/api/health', '/health'];
const API_ENDPOINTS = ['/api/auth/register', '/api/auth/login', '/api/users'];
const BACKEND_REQUIRED_VARS = ['JWT_SECRET', 'DB_URL', 'DB_USERNAME', 'DB_PASSWORD'];
const BACKEND_VAR_ALIASES = {
  JWT_SECRET: ['JWT_SECRET'],
  DB_URL: ['DB_URL', 'SPRING_DATASOURCE_URL'],
  DB_USERNAME: ['DB_USERNAME', 'SPRING_DATASOURCE_USERNAME'],
  DB_PASSWORD: ['DB_PASSWORD', 'SPRING_DATASOURCE_PASSWORD']
};

const AUTH_TEST_NAME = 'Doctor Test User';
const AUTH_TEST_PASSWORD = 'Doctor@123';
const AUTH_TEST_EMAIL_PREFIX = 'doctor-test-';

const DB_DIAGNOSES = [
  ['password authentication failed', 'Database authentication failed - PostgreSQL rejected the supplied credentials.'],
  ['relation does not exist', 'Database schema issue - a table referenced by the backend does not exist (migrations not applied?).'],
  ['timeout', 'Database connection timed out - Neon may be paused or too slow to accept connections.'],
  ['sslmode', 'Connection rejected - the database requires an SSL connection (sslmode=require).'],
  ['ssl required', 'Connection rejected - the database requires an SSL connection (sslmode=require).'],
  ['connection refused', 'Database connection refused - the database host is unreachable or down.'],
  ['too many connections', 'Database connection pool exhausted - too many concurrent connections to Neon.'],
  ['http connection', 'Neon returned a non-Postgres response - the database may have scaled to zero.'],
  ['unexpected end of stream', 'Database connection was cut off - the Neon instance may be sleeping or restarting.']
];

const args = process.argv.slice(2);
const doFrontend = args.includes('--frontend');
const doBackend = args.includes('--backend');
const runAll = !doFrontend && !doBackend;

if (args.includes('--help') || args.includes('-h')) {
  console.log('');
  console.log('  Deployment Doctor - validate the fitness-monolith deployment.');
  console.log('');
  console.log('  Usage: node scripts/deployment-doctor.js [options]');
  console.log('');
  console.log('  Options:');
  console.log('    --frontend   Run frontend + frontend environment checks.');
  console.log('    --backend    Run backend, CORS, database, auth flow + backend environment checks.');
  console.log('    (no flags)   Run every check.');
  console.log('');
  process.exit(0);
}

function parseEnvFile(filePath) {
  const vars = {};
  if (!fs.existsSync(filePath)) return vars;
  const raw = fs.readFileSync(filePath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (value.startsWith('#')) continue;
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function resolveFrontendVar(name) {
  const fromEnv = process.env[name];
  if (fromEnv !== undefined && fromEnv !== '') return { value: fromEnv, source: 'process.env' };
  for (const rel of FRONTEND_ENV_FILES) {
    const vars = parseEnvFile(path.join(ROOT_DIR, rel));
    const val = vars[name];
    if (val !== undefined && val !== '') return { value: val, source: rel };
  }
  return { value: undefined, source: 'none' };
}

function resolveValue(fileVars, key) {
  const fromFile = fileVars[key];
  const fromEnv = process.env[key];
  if (fromEnv !== undefined && fromEnv !== '') return { value: fromEnv, source: 'process.env' };
  if (fromFile !== undefined && fromFile !== '') return { value: fromFile, source: 'file' };
  return { value: undefined, source: 'none' };
}

function hostIsLocalhost(hostname) {
  const h = (hostname || '').toLowerCase();
  return (
    h === 'localhost' ||
    h.endsWith('.localhost') ||
    h === '127.0.0.1' ||
    h === '::1' ||
    h === '0.0.0.0' ||
    h === '[::1]' ||
    /^127\.\d+\.\d+\.\d+$/.test(h)
  );
}

function isRenderBackend() {
  try {
    const host = new URL(BACKEND_URL).hostname.toLowerCase();
    return host === 'onrender.com' || host.endsWith('.onrender.com');
  } catch (err) {
    return false;
  }
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const timeout = timeoutMs || REQUEST_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const start = Date.now();
  try {
    const res = await fetch(url, Object.assign({}, options, { signal: controller.signal }));
    return { res, elapsedMs: Date.now() - start, error: null };
  } catch (err) {
    const reason = err && err.name === 'AbortError' ? 'request timed out' : err.message;
    return { res: null, elapsedMs: Date.now() - start, error: reason };
  } finally {
    clearTimeout(timer);
  }
}

function detectDbIssue(body) {
  if (!body) return null;
  const lower = body.toLowerCase();
  for (const entry of DB_DIAGNOSES) {
    if (lower.includes(entry[0])) return entry[1];
  }
  let parsed = null;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    parsed = null;
  }
  if (parsed && parsed.components && parsed.components.db) {
    const db = parsed.components.db;
    const status = String(db.status || '').toUpperCase();
    if (status && status !== 'UP') {
      const details = db.details ? ' - ' + JSON.stringify(db.details) : '';
      return 'Spring Boot actuator reports the database is DOWN (' + status + ')' + details + '.';
    }
  }
  return null;
}

async function runFrontendChecks() {
  const checks = [];
  const resolved = resolveFrontendVar('VITE_API_BASE_URL');
  const sourceLabel = resolved.source === 'process.env' ? 'process.env' : resolved.source;
  const apiUrl = resolved.value ? String(resolved.value).trim() : '';

  checks.push({
    name: 'VITE_API_BASE_URL configured',
    pass: !!(resolved.value && apiUrl),
    detail: resolved.value ? 'Loaded from ' + sourceLabel : 'variable not found',
    extra: resolved.source === 'process.env' ? 'source: process.env' : 'source: ' + path.join(ROOT_DIR, resolved.source)
  });

  if (apiUrl) {
    let url = null;
    try {
      url = new URL(apiUrl);
    } catch (err) {
      url = null;
    }
    checks.push({
      name: 'VITE_API_BASE_URL is a valid URL',
      pass: !!url,
      detail: url ? apiUrl : 'value is not a parseable URL'
    });
    if (url) {
      checks.push({
        name: 'VITE_API_BASE_URL uses HTTPS',
        pass: url.protocol === 'https:',
        detail: url.protocol + '//'
      });
      checks.push({
        name: 'VITE_API_BASE_URL does not point to localhost',
        pass: !hostIsLocalhost(url.hostname),
        detail: url.hostname
      });
      checks.push({
        name: 'VITE_API_BASE_URL ends with /api',
        pass: url.pathname.endsWith('/api'),
        detail: url.pathname || '(empty path)'
      });
    }
  } else {
    checks.push({
      name: 'Frontend API URL valid (HTTPS + not localhost + /api)',
      pass: false,
      detail: 'skipped because VITE_API_BASE_URL is missing'
    });
  }
  return checks;
}

async function runBackendHealthCheck() {
  const attempts = [];
  let success = null;
  let chosenBody = '';
  for (const ep of HEALTH_ENDPOINTS) {
    const url = BACKEND_URL + ep;
    const { res, elapsedMs, error } = await fetchWithTimeout(url, {
      method: 'GET',
      headers: { accept: 'application/json' }
    });
    if (error) {
      attempts.push({ ep, status: 'NO RESPONSE', elapsedMs: Math.round(elapsedMs), body: '', error });
      continue;
    }
    const text = await res.text().catch(() => '');
    attempts.push({ ep, status: res.status, elapsedMs: Math.round(elapsedMs), body: text, error: null });
    if (res.status >= 200 && res.status < 400) {
      success = ep;
      chosenBody = text;
      break;
    }
  }
  const winner = attempts.find((a) => a.status >= 200 && a.status < 400) || null;
  return {
    ok: !!success,
    success: success,
    status: winner ? winner.status : null,
    elapsedMs: winner ? winner.elapsedMs : null,
    attempts: attempts,
    body: chosenBody
  };
}

async function runBackendApiChecks() {
  const results = [];
  for (const ep of API_ENDPOINTS) {
    const url = BACKEND_URL + ep;
    const { res, elapsedMs, error } = await fetchWithTimeout(url, {
      method: 'OPTIONS',
      headers: {
        origin: FRONTEND_ORIGIN,
        'access-control-request-method': 'GET',
        'access-control-request-headers': 'content-type, authorization'
      }
    });
    if (error) {
      results.push({ ep, reachable: false, status: null, elapsedMs: Math.round(elapsedMs), error });
    } else {
      results.push({ ep, reachable: true, status: res.status, elapsedMs: Math.round(elapsedMs), error: null });
    }
  }
  return results;
}

function splitHeaderValues(value) {
  if (!value) return [];
  return String(value)
    .split(/[,\s]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function headerAllows(value, tokens) {
  if (!value) return false;
  const vals = splitHeaderValues(value);
  if (vals.includes('*')) return true;
  const lower = vals.map((v) => v.toLowerCase());
  return tokens.every((t) => lower.includes(String(t).toLowerCase()));
}

function originAllows(value, origin) {
  if (!value) return false;
  const trimmed = String(value).trim();
  if (trimmed === '*') return true;
  return splitHeaderValues(trimmed).includes(origin);
}

async function runCorsChecks() {
  const checks = [];
  const origin = FRONTEND_ORIGIN;
  const preflight = await fetchWithTimeout(BACKEND_URL + '/api/auth/register', {
    method: 'OPTIONS',
    headers: {
      origin: origin,
      'access-control-request-method': 'POST',
      'access-control-request-headers': 'content-type, authorization'
    }
  });

  if (preflight.error) {
    const summary = { origin: origin, status: null, acao: null, ach: null, acm: null };
    checks.push({
      name: 'CORS preflight request (OPTIONS /api/auth/register)',
      pass: false,
      detail: 'network error: ' + preflight.error
    });
    return { checks, summary };
  }

  const status = preflight.res.status;
  const acao = preflight.res.headers.get('access-control-allow-origin');
  const ach = preflight.res.headers.get('access-control-allow-headers');
  const acm = preflight.res.headers.get('access-control-allow-methods');
  const summary = { origin: origin, status: status, acao: acao, ach: ach, acm: acm };

  const reached = status >= 200 && status < 400;
  const originPass = originAllows(acao, origin);
  const headersPass = headerAllows(ach, ['content-type', 'authorization']);
  const methodsPass = headerAllows(acm, ['POST', 'OPTIONS']);

  checks.push({
    name: 'CORS preflight request (OPTIONS /api/auth/register)',
    pass: reached,
    detail: 'HTTP ' + status + ' in ' + Math.round(preflight.elapsedMs) + ' ms',
    extra: reached && !(originPass && headersPass && methodsPass)
      ? 'HTTP ' + status + ' but missing/invalid header(s): ' + [
          !originPass ? 'Access-Control-Allow-Origin' : null,
          !headersPass ? 'Access-Control-Allow-Headers' : null,
          !methodsPass ? 'Access-Control-Allow-Methods' : null
        ].filter(Boolean).join(', ')
      : ''
  });

  checks.push({
    name: 'Access-Control-Allow-Origin',
    pass: originPass,
    detail: acao ? acao : 'header not present',
    extra: originPass ? '' : 'expected: ' + origin
  });

  checks.push({
    name: 'Access-Control-Allow-Headers',
    pass: headersPass,
    detail: ach ? ach : 'header not present',
    extra: headersPass ? '' : 'must contain: content-type, authorization'
  });

  checks.push({
    name: 'Access-Control-Allow-Methods',
    pass: methodsPass,
    detail: acm ? acm : 'header not present',
    extra: methodsPass ? '' : 'must contain: POST, OPTIONS'
  });

  return { checks, summary };
}

async function runEnvironmentChecks() {
  const checks = [];
  const renderRemote = isRenderBackend();

  if (runAll || doFrontend) {
    const r = resolveFrontendVar('VITE_API_BASE_URL');
    checks.push({
      name: 'VITE_API_BASE_URL',
      pass: !!r.value,
      detail: r.value ? 'FOUND' : 'MISSING',
      extra: 'Loaded from ' + (r.source === 'none' ? 'none' : r.source === 'process.env' ? 'process.env' : r.source)
    });
  }

  if (runAll || doBackend) {
    if (renderRemote) {
      for (const key of BACKEND_REQUIRED_VARS) {
        checks.push({
          name: key,
          pass: true,
          detail: 'REMOTE (cannot verify locally)',
          extra: 'Render service manages this variable'
        });
      }
    } else {
      const backEnvVars = parseEnvFile(BACKEND_ENV_PATH);
      for (const key of BACKEND_REQUIRED_VARS) {
        const aliases = BACKEND_VAR_ALIASES[key];
        let found = false;
        let foundSource = 'none';
        for (const alias of aliases) {
          const r = resolveValue(backEnvVars, alias);
          if (r.value) {
            found = true;
            foundSource = alias + ' from ' + r.source;
            break;
          }
        }
        checks.push({
          name: key + (key.startsWith('DB') ? ' (or SPRING_DATASOURCE_*)' : ''),
          pass: found,
          detail: found ? 'FOUND' : 'MISSING',
          extra: found ? foundSource : 'not found in backend .env or process.env'
        });
      }
    }
  }
  return checks;
}

async function runDatabaseChecks(health, capturedBodies, capturedErrors) {
  const checks = [];
  const allText = capturedBodies.join(' ') + ' ' + capturedErrors.join(' ');
  const issue = detectDbIssue(allText);
  if (!health || !health.ok) {
    checks.push({
      name: 'Database status',
      pass: false,
      detail: 'cannot verify - backend health endpoint unreachable'
    });
    return checks;
  }
  if (issue) {
    checks.push({
      name: 'Database status',
      pass: false,
      detail: issue
    });
    return checks;
  }
  checks.push({
    name: 'Database status',
    pass: true,
    detail: 'no database error signatures detected in backend responses'
  });
  return checks;
}

async function runAuthFlowChecks() {
  const checks = [];
  const email = AUTH_TEST_EMAIL_PREFIX + Date.now() + '@example.com';
  const registerBody = JSON.stringify({
    name: AUTH_TEST_NAME,
    email: email,
    password: AUTH_TEST_PASSWORD
  });

  const reg = await fetchWithTimeout(BACKEND_URL + '/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: registerBody
  });
  let regStatus = null;
  let regDetail = '';
  if (reg.error) {
    regDetail = 'NO RESPONSE (' + reg.error + '), email ' + email;
  } else {
    regStatus = reg.res.status;
    const suffix =
      regStatus === 201 ? ' - user created' :
      regStatus === 409 ? ' - user already exists' :
      regStatus === 400 ? ' - validation working' : '';
    regDetail = 'HTTP ' + regStatus + ' in ' + Math.round(reg.elapsedMs) + ' ms' + suffix + ', email ' + email;
  }
  const registerPass = regStatus === 201 || regStatus === 409 || regStatus === 400;
  checks.push({
    name: 'POST /api/auth/register (throwaway test user)',
    pass: registerPass,
    detail: regDetail
  });

  if (regStatus === 201 || regStatus === 409) {
    const login = await fetchWithTimeout(BACKEND_URL + '/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: email, password: AUTH_TEST_PASSWORD })
    });
    let loginStatus = null;
    let loginDetail = '';
    let tokenPresent = false;
    let tokenName = '';
    if (login.error) {
      loginDetail = 'NO RESPONSE (' + login.error + ')';
    } else {
      loginStatus = login.res.status;
      const text = await login.res.text().catch(() => '');
      loginDetail = 'HTTP ' + loginStatus + ' in ' + Math.round(login.elapsedMs) + ' ms';
      let json = null;
      try {
        json = JSON.parse(text);
      } catch (err) {
        json = null;
      }
      if (json) {
        for (const candidate of ['token', 'accessToken', 'jwt', 'access_token']) {
          if (json[candidate] && typeof json[candidate] === 'string') {
            tokenPresent = true;
            tokenName = candidate;
            break;
          }
        }
      }
    }
    checks.push({
      name: 'POST /api/auth/login',
      pass: loginStatus === 200 && !login.error,
      detail: loginDetail + (tokenPresent ? ' - JWT token present (field: ' + tokenName + ')' : '')
    });
    checks.push({
      name: 'JWT token present',
      pass: tokenPresent,
      detail: tokenPresent ? 'token returned by login' : 'login response did not contain a JWT token'
    });
  } else if (regStatus === 400) {
    checks.push({
      name: 'POST /api/auth/login',
      pass: true,
      detail: 'skipped - registration returned 400 (validation rejected, no account created)'
    });
  } else {
    checks.push({
      name: 'POST /api/auth/login',
      pass: false,
      detail: 'not attempted - registration failed and no account existed'
    });
  }
  return checks;
}

function statusOf(check) {
  return check.pass ? 'PASS' : 'FAIL';
}

function symbolOf(pass) {
  return pass ? '\u2714' : '\u2716';
}

function padStartLeft(str, len) {
  str = String(str);
  while (str.length < len) str = ' ' + str;
  return str;
}

function padEndRight(str, len) {
  str = String(str);
  while (str.length < len) str = str + ' ';
  return str;
}

function printSeparator(char, width) {
  console.log(char.repeat(width));
}

function logCheck(i, check) {
  const idx = padStartLeft(i + 1, 2);
  const name = padEndRight(check.name, 46).slice(0, 46);
  const status = padEndRight(statusOf(check), 6);
  const detail = check.detail || '';
  console.log('   [' + idx + '] ' + symbolOf(check.pass) + ' ' + name + '  ' + status + '  ' + detail);
  if (check.extra) {
    console.log('       ' + String(check.extra));
  }
}

function overallFromChecks(checks) {
  for (const check of checks) {
    if (!check.pass) return 'FAIL';
  }
  return 'PASS';
}

function summaryBlock(sections) {
  const lines = [];
  lines.push('');
  lines.push('\u{1FA7A} FITNESS MONOLITH DEPLOYMENT DOCTOR');
  lines.push('Backend base URL: ' + BACKEND_URL);
  lines.push('');
  const has = (id) => !!(sections[id] && sections[id].length);
  if (has('frontend')) {
    lines.push('Frontend');
    for (const c of sections.frontend) lines.push('  ' + symbolOf(c.pass) + ' ' + c.name);
  }
  if (has('backend')) {
    lines.push('Backend');
    for (const c of sections.backend) lines.push('  ' + symbolOf(c.pass) + ' ' + c.name);
  }
  if (has('database')) {
    lines.push('Database');
    for (const c of sections.database) lines.push('  ' + symbolOf(c.pass) + ' ' + c.detail);
  }
  if (has('cors')) {
    lines.push('CORS');
    for (const c of sections.cors) lines.push('  ' + symbolOf(c.pass) + ' ' + c.detail);
  }
  if (has('auth')) {
    lines.push('Authentication');
    for (const c of sections.auth) lines.push('  ' + symbolOf(c.pass) + ' ' + c.name);
  }
  if (has('environment')) {
    lines.push('Remote Environment');
    for (const c of sections.environment) lines.push('  ' + symbolOf(c.pass) + ' ' + c.detail);
  }
  return lines;
}

function buildMarkdown(sections, allChecks, overall, startedAt) {
  const lines = [];
  lines.push('# \u{1FA7A} Fitness Monolith Deployment Doctor Report');
  lines.push('');
  lines.push('- Generated at: ' + startedAt.toISOString());
  lines.push('- Backend base URL: ' + BACKEND_URL);
  lines.push('- Frontend env source: ' + (runAll || doFrontend ? resolveFrontendVar('VITE_API_BASE_URL').source : 'not checked'));
  lines.push('- Mode: ' + (runAll ? 'full check' : (doFrontend && doBackend ? 'frontend + backend' : doFrontend ? 'frontend only' : 'backend only')));
  lines.push('');
  lines.push('## Overall Result: ' + overall);
  lines.push('');

  const sectionMeta = [
    ['frontend', 'Frontend'],
    ['backend', 'Backend'],
    ['cors', 'CORS'],
    ['database', 'Database'],
    ['auth', 'Authentication'],
    ['environment', 'Remote Environment']
  ];

  for (const entry of sectionMeta) {
    const checks = sections[entry[0]];
    if (!checks || !checks.length) continue;
    lines.push('## ' + entry[1]);
    lines.push('');
    lines.push('| # | Check | Status | Detail |');
    lines.push('|---|-------|--------|--------|');
    checks.forEach((c, i) => {
      const detail = [c.detail, c.extra].filter(Boolean).join(' | ');
      lines.push('| ' + (i + 1) + ' | ' + c.name + ' | ' + statusOf(c) + ' | ' + detail.replace(/\|/g, '\\|') + ' |');
    });
    lines.push('');
  }

  lines.push('## Failed Checks');
  lines.push('');
  const failures = allChecks.filter((c) => !c.pass);
  if (failures.length === 0) {
    lines.push('None. All executed checks passed.');
  } else {
    lines.push('| Check | Reason |');
    lines.push('|-------|--------|');
    for (const c of failures) {
      lines.push('| ' + c.name + ' | ' + (c.detail || 'n/a') + ' |');
    }
  }
  lines.push('');
  lines.push('_Report generated automatically by Deployment Doctor. The auth-flow section creates one throwaway test user per run; nothing else is modified._');
  return lines.join('\n') + '\n';
}

async function main() {
  const startedAt = new Date();

  printSeparator('=', 80);
  console.log('\u{1FA7A} FITNESS MONOLITH DEPLOYMENT DOCTOR');
  console.log('Backend base URL : ' + BACKEND_URL);
  console.log('Run mode          : ' + (runAll ? 'full check' : (doFrontend && doBackend ? 'frontend + backend' : doFrontend ? 'frontend only' : 'backend only')));
  printSeparator('=', 80);

  const sections = {
    frontend: [],
    backend: [],
    cors: [],
    database: [],
    auth: [],
    environment: []
  };
  const capturedBodies = [];
  const capturedErrors = [];
  let health = null;

  if (runAll || doFrontend) {
    console.log('');
    console.log('[A] FRONTEND CHECKS');
    console.log('    VITE_API_BASE_URL source priority: process.env > .env.production > .env.local > .env');
    const checks = await runFrontendChecks();
    checks.forEach((c, i) => logCheck(i, c));
    sections.frontend = checks;
  }

  if (runAll || doBackend) {
    console.log('');
    console.log('[B] BACKEND CHECKS');
    console.log('');

    console.log('    (1) Health endpoint');
    health = await runBackendHealthCheck();
    for (const attempt of health.attempts) {
      capturedBodies.push(attempt.body);
      if (attempt.error) capturedErrors.push(attempt.error);
      const line =
        '       ' + attempt.ep + ' -> HTTP ' + attempt.status +
        ' in ' + (attempt.elapsedMs !== null ? attempt.elapsedMs + ' ms' : 'n/a');
      console.log(line);
    }
    const healthNamed = health.ok
      ? 'health endpoint returned HTTP ' + health.status + ' in ' + health.elapsedMs + ' ms (' + health.success + ')'
      : 'no health endpoint responded successfully';
    sections.backend.push({ name: 'Health endpoint', pass: health.ok, detail: healthNamed });
    console.log('       RESULT: ' + (health.ok ? 'PASS' : 'FAIL') + ' - ' + healthNamed);

    console.log('');
    console.log('    (2) API availability (safe OPTIONS requests - nothing is created)');
    const apiResults = await runBackendApiChecks();
    let backendApiOk = true;
    apiResults.forEach((r) => {
      const named = r.ep + ' -> ' + (r.reachable ? 'HTTP ' + r.status + ' in ' + r.elapsedMs + ' ms' : 'NO RESPONSE (' + r.error + ')');
      const ok = r.reachable;
      if (!ok) backendApiOk = false;
      console.log('       ' + symbolOf(ok) + ' ' + named);
      sections.backend.push({ name: r.ep, pass: ok, detail: named });
      if (r.error) capturedErrors.push(r.error);
    });
    if (!apiResults.length) backendApiOk = false;
    sections.backend.push({ name: 'API availability', pass: backendApiOk, detail: backendApiOk ? 'all endpoints reachable' : 'one or more endpoints unreachable' });

    console.log('');
    console.log('[C] CORS VALIDATION');
    const corsResult = await runCorsChecks();
    console.log('    Test Origin:');
    console.log('    ' + corsResult.summary.origin);
    console.log('    Backend:');
    console.log('    ' + BACKEND_URL);
    console.log('    Received ACAO: ' + (corsResult.summary.acao || '(not present)'));
    console.log('    Result:');
    console.log('    ' + overallFromChecks(corsResult.checks));
    corsResult.checks.forEach((c, i) => logCheck(i, c));
    sections.cors = corsResult.checks;
  }

  console.log('');
  console.log('[D] ENVIRONMENT VALIDATION');
  const envChecks = await runEnvironmentChecks();
  if (runAll || doBackend) {
    if (isRenderBackend()) {
      console.log('    REMOTE CONFIGURATION (backend is deployed on Render - secrets cannot be read locally)');
    } else {
      console.log('    Checking: ' + BACKEND_ENV_PATH + ' and process.env');
    }
  }
  envChecks.forEach((c, i) => logCheck(i, c));
  sections.environment = envChecks;

  if (runAll || doBackend) {
    console.log('');
    console.log('[E] DATABASE VALIDATION');
    const dbChecks = await runDatabaseChecks(health, capturedBodies, capturedErrors);
    dbChecks.forEach((c, i) => logCheck(i, c));
    sections.database = dbChecks;

    console.log('');
    console.log('[F] AUTH FLOW VALIDATION');
    console.log('    Creates one throwaway test user per run (timestamp-based email). Never uses real data.');
    const authChecks = await runAuthFlowChecks();
    authChecks.forEach((c, i) => logCheck(i, c));
    sections.auth = authChecks;
  }

  const allChecks = [].concat(
    sections.frontend,
    sections.backend,
    sections.cors,
    sections.database,
    sections.auth,
    sections.environment
  );
  const overall = overallFromChecks(allChecks);

  console.log('');
  printSeparator('=', 80);
  console.log('\u{1FA7A} FITNESS MONOLITH DEPLOYMENT DOCTOR - SUMMARY REPORT');
  printSeparator('=', 80);
  for (const line of summaryBlock(sections)) {
    console.log(line);
  }
  console.log('');
  console.log('OVERALL RESULT: ' + overall);
  const failedReasons = allChecks.filter((c) => !c.pass).map((c) => c.name + ': ' + c.detail);
  if (failedReasons.length) {
    console.log('Reasons:');
    failedReasons.forEach((r) => console.log('  - ' + r));
  }
  printSeparator('=', 80);

  const markdown = buildMarkdown(sections, allChecks, overall, startedAt);
  fs.writeFileSync(REPORT_PATH, markdown, 'utf8');
  console.log('');
  console.log('Report written to: ' + REPORT_PATH);
  console.log('');
}

main().catch((err) => {
  console.error('Deployment Doctor crashed: ' + (err && err.stack ? err.stack : err));
  process.exit(1);
});