import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables. ' +
    'Set these in .env.local (local dev) or in your Vercel Project Settings → Environment Variables.'
  );
}

// This uses the anon/public key — safe to expose in the browser. Actual
// access control is enforced by Postgres Row Level Security policies
// (see supabase-schema.sql), not by keeping this key secret.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const UPLOADS_BUCKET = 'kansari-uploads';
