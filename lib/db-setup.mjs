// ═══════════════════════════════════════════════════════
// DATABASE SETUP — run once: npm run db:setup
// Creates the two tables needed for zero-password auth.
// ═══════════════════════════════════════════════════════
import pg from 'pg'
import { config } from 'dotenv'

config({ path: '.env.local' })

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    email         TEXT UNIQUE NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS verification_codes (
    id            SERIAL PRIMARY KEY,
    email         TEXT NOT NULL,
    code          TEXT NOT NULL,
    expires_at    TIMESTAMPTZ NOT NULL,
    used          BOOLEAN DEFAULT false,
    created_at    TIMESTAMPTZ DEFAULT now()
  );

  CREATE INDEX IF NOT EXISTS idx_verification_codes_email
    ON verification_codes (email, used, expires_at);
`

async function setup() {
  console.log('Setting up database...')
  await pool.query(schema)
  console.log('Done. Tables created:')
  console.log('  - users (id, email, created_at)')
  console.log('  - verification_codes (id, email, code, expires_at, used)')
  await pool.end()
}

setup().catch(err => {
  console.error('Setup failed:', err.message)
  process.exit(1)
})
