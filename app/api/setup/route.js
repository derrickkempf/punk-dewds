// ONE-TIME database setup endpoint
// Hit /api/setup?secret=YOUR_ADMIN_PASSWORD to create tables
// Delete this file after running it once.
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import crypto from 'crypto'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  // Must provide admin password
  if (!secret) {
    return NextResponse.json({ error: 'Missing ?secret= parameter' }, { status: 401 })
  }

  const hash = crypto.createHash('sha256').update(secret).digest('hex')
  if (hash !== process.env.ADMIN_HASH) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
  }

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        email         TEXT UNIQUE NOT NULL,
        created_at    TIMESTAMPTZ DEFAULT now()
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id            SERIAL PRIMARY KEY,
        email         TEXT NOT NULL,
        code          TEXT NOT NULL,
        expires_at    TIMESTAMPTZ NOT NULL,
        used          BOOLEAN DEFAULT false,
        created_at    TIMESTAMPTZ DEFAULT now()
      )
    `)

    await query(`
      CREATE INDEX IF NOT EXISTS idx_verification_codes_email
        ON verification_codes (email, used, expires_at)
    `)

    // Clear old verification codes
    const deleted = await query(`DELETE FROM verification_codes RETURNING id`)

    return NextResponse.json({
      ok: true,
      message: `Tables ready. Cleared ${deleted.length} old verification codes. You can delete app/api/setup/route.js now.`
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}