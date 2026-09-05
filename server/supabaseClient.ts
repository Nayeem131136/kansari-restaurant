import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  // Fails loudly and early instead of silently returning empty data —
  // easier to diagnose a missing env var than a mysteriously empty menu.
  console.error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. ' +
    'Set these in .env (local) or in your Vercel Project Settings → Environment Variables. ' +
    'The server will start, but every database call will fail until these are set.'
  );
}

// The service role key bypasses Row Level Security — this client must
// ONLY ever be used from server-side code (API routes), never sent to
// the browser.
// A placeholder URL is used when unset so `createClient` doesn't throw
// synchronously and crash the whole server at boot — instead, individual
// API calls will fail with a clear "Database error" response (see
// throwIfError in db.ts), which is much easier to diagnose.
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder-not-configured.supabase.co',
  SUPABASE_SERVICE_KEY || 'placeholder-key',
  { auth: { persistSession: false } }
);

export const UPLOADS_BUCKET = 'kansari-uploads';
