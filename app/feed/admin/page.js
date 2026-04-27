import { redirect } from 'next/navigation'
import Nav from '../../components/Nav'
import AdminClient from './AdminClient'
import { getAdminSession } from '@/lib/admin'

export const metadata = {
  title: 'New post — Punk Dewds',
}

export const dynamic = 'force-dynamic'

export default async function FeedAdminPage() {
  const session = await getAdminSession()
  if (!session) {
    return (
      <>
        <Nav />
        <main className="pd-container">
          <div style={{ padding: 'var(--space-2xl) 0', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-md)' }}>Admin only</h1>
            <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-lg)' }}>
              Sign in on the <a href="/daily" style={{ color: 'var(--color-accent)' }}>daily page</a> first.
            </p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="pd-container">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 500, marginBottom: 'var(--space-lg)', letterSpacing: '-0.02em' }}>
          New post
        </h1>
        <AdminClient />
      </main>
    </>
  )
}
