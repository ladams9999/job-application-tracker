#!/usr/bin/env node

import { config as loadEnv } from 'dotenv';

loadEnv({ quiet: true });

const KEEPALIVE_PATH = '/rest/v1/job_applications?select=id&limit=1';
const REQUEST_TIMEOUT_MS = 10000;

function getConfigValue(primaryKey, fallbackKey) {
  const primaryValue = process.env[primaryKey]?.trim();
  if (primaryValue) {
    return primaryValue;
  }

  const fallbackValue = process.env[fallbackKey]?.trim();
  if (fallbackValue) {
    return fallbackValue;
  }

  return '';
}

function fail(message, exitCode) {
  console.error(message);
  process.exit(exitCode);
}

const supabaseUrl = getConfigValue('SUPABASE_URL', 'VITE_SUPABASE_URL');
const publishableKey = getConfigValue(
  'SUPABASE_PUBLISHABLE_KEY',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
);

if (!supabaseUrl) {
  fail(
    'Supabase keepalive failed: missing SUPABASE_URL or VITE_SUPABASE_URL.',
    2,
  );
}

if (!publishableKey) {
  fail(
    'Supabase keepalive failed: missing SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_PUBLISHABLE_KEY.',
    2,
  );
}

let requestUrl;

try {
  requestUrl = new URL(KEEPALIVE_PATH, supabaseUrl);
} catch {
  fail('Supabase keepalive failed: invalid Supabase URL configuration.', 2);
}

let response;

try {
  response = await fetch(requestUrl, {
    headers: {
      Accept: 'application/json',
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
} catch (error) {
  const message = error instanceof Error ? error.message : 'unknown network error';
  fail(`Supabase keepalive failed: network error (${message}).`, 1);
}

const responseBody = await response.text();

if (!response.ok) {
  const detail = responseBody.trim() || 'no response body';
  fail(
    `Supabase keepalive failed: ${response.status} ${response.statusText} for ${requestUrl.pathname}${requestUrl.search} (${detail}).`,
    1,
  );
}

let payload;

try {
  payload = JSON.parse(responseBody);
} catch {
  fail(
    `Supabase keepalive failed: invalid JSON response from ${requestUrl.pathname}${requestUrl.search}.`,
    1,
  );
}

if (!Array.isArray(payload)) {
  fail(
    `Supabase keepalive failed: expected a JSON array from ${requestUrl.pathname}${requestUrl.search}.`,
    1,
  );
}

console.log(
  `Supabase keepalive succeeded: ${requestUrl.pathname}${requestUrl.search} returned HTTP ${response.status} with ${payload.length} row(s).`,
);
