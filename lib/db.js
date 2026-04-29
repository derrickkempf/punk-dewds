// ═══════════════════════════════════════════════════════
// DATABASE — thin Postgres wrapper for serverless (Vercel).
//
// Uses the same POSTGRES_URL env var as db-setup.mjs.
// Exports a single `query(text, params)` that returns rows.
// ═══════════════════════════════════════════════════════
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,                    // keep the pool small for serverless
  idleTimeoutMillis: 10_000, // free idle connections quickly
})

/**
 * Run a SQL query and return the result rows.
 * @param {string} text  SQL with $1, $2… placeholders
 * @param {any[]}  params  values for the placeholders
 * @returns {Promise<object[]>}
 */
export async function query(text, params = []) {
  const { rows } = await pool.query(text, params)
  return rows
}
