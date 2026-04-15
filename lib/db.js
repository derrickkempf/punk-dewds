// ═══════════════════════════════════════════════════════
// DATABASE — raw SQL, pg pool, no ORM
// ═══════════════════════════════════════════════════════
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
})

export async function query(text, params) {
  const { rows } = await pool.query(text, params)
  return rows
}

export async function queryOne(text, params) {
  const rows = await query(text, params)
  return rows[0] || null
}

export default pool
