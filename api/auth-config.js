/*
 * Public configuration for the optional Google sign-in button.
 *
 * Supabase's anon key is intentionally safe to expose in a browser client;
 * the service-role key must never be returned from this endpoint.
 */
const DEFAULT_ORIGINS = [
  'https://avvm.studio',
  'https://www.avvm.studio',
  'https://avvmstudio25.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

function allowedOrigins() {
  return String(process.env.AVVM_ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && !allowedOrigins().includes(origin)) return false;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  return true;
}

module.exports = async (req, res) => {
  if (!setCors(req, res)) return res.status(403).json({ error: 'Origin is not allowed.' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });

  const supabaseUrl = String(process.env.SUPABASE_URL || '').trim();
  const supabaseAnonKey = String(process.env.SUPABASE_ANON_KEY || '').trim();
  const enabled = process.env.AVVM_GOOGLE_LOGIN_ENABLED === 'true' && Boolean(supabaseUrl && supabaseAnonKey);

  res.setHeader('Cache-Control', 'no-store, max-age=0');
  return res.status(200).json({
    enabled,
    supabaseUrl: enabled ? supabaseUrl : '',
    supabaseAnonKey: enabled ? supabaseAnonKey : ''
  });
};
