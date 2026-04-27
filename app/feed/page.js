import Link from 'next/link'
import { readJSON } from '@/lib/storage'
import { getAdminSession } from '@/lib/admin'

export const metadata = {
  title: 'Feed — Punk Dewds',
  description: 'Sketches, videos, and posts from the daily practice.',
}

export const dynamic = 'force-dynamic'

function formatRelative(iso) {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const day = 86_400_000
  const min = 60_000
  if (diff < min)        return 'just now'
  if (diff < 60 * min)   return `${Math.floor(diff / min)}m ago`
  if (diff < 24 * 60 * min) return `${Math.floor(diff / 3_600_000)}h ago`
  if (diff < 7 * day)    return `${Math.floor(diff / day)}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function PostCard({ post }) {
  return (
    <article className="post">
      <header className="post-head">
        <span className={`post-kind k-${post.kind}`}>{post.kind}</span>
        <span className="post-time">{formatRelative(post.createdAt)}</span>
      </header>
      {post.title && <h2 className="post-title">{post.title}</h2>}
      {post.body && <p className="post-body">{post.body}</p>}
      {post.mediaUrl && post.kind === 'video' && (
        <video className="post-media" src={post.mediaUrl} controls preload="metadata" />
      )}
      {post.mediaUrl && post.kind !== 'video' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="post-media" src={post.mediaUrl} alt={post.title || 'post'} />
      )}
    </article>
  )
}

export default async function FeedPage() {
  const posts = (await readJSON('feed', [])) || []
  posts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  const adminSession = await getAdminSession()
  const isAdmin = !!adminSession

  return (
    <>
      <main className="pd-container">
        <div className="feed-head">
          <div>
            <h1 className="feed-title">Feed</h1>
            <p className="feed-sub">Sketches, videos, and posts from the daily practice.</p>
          </div>
          {isAdmin && (
            <Link href="/feed/admin" className="pd-btn pd-btn--primary">+ New post</Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="empty">
            <p>Nothing here yet.</p>
            {isAdmin && <p className="empty-sub"><Link href="/feed/admin">Write the first post →</Link></p>}
          </div>
        ) : (
          <div className="posts">
            {posts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </main>

      <style>{`
        .feed-head {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: var(--space-md);
          padding: var(--space-md) 0 var(--space-lg);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-lg);
        }
        .feed-title {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-medium);
          letter-spacing: -0.02em;
        }
        .feed-sub {
          margin-top: 4px;
          font-size: var(--font-size-sm);
          color: var(--color-muted);
        }
        .empty {
          text-align: center;
          padding: var(--space-2xl) var(--space-lg);
          color: var(--color-muted);
        }
        .empty-sub { margin-top: var(--space-sm); font-size: var(--font-size-sm); }
        .empty-sub a { color: var(--color-accent); }

        .posts {
          display: flex; flex-direction: column;
          gap: var(--space-lg);
        }
        .post {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-lg);
          background: var(--color-bg);
        }
        .post-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: var(--space-sm);
        }
        .post-kind {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
          text-transform: uppercase;
          letter-spacing: .08em;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          background: var(--color-surface);
          color: var(--color-muted);
          border: 1px solid var(--color-border);
        }
        .post-kind.k-sketch { color: var(--color-accent); border-color: var(--color-accent); background: var(--color-accent-bg); }
        .post-kind.k-video  { color: #2b7bf2; border-color: #2b7bf2; background: rgba(43,123,242,.06); }
        .post-kind.k-image  { color: #1aa260; border-color: #1aa260; background: rgba(26,162,96,.06); }
        .post-kind.k-text   { color: var(--color-fg); border-color: var(--color-fg); background: var(--color-bg); }

        .post-time {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
        }
        .post-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--space-sm);
          letter-spacing: -0.01em;
        }
        .post-body {
          font-size: var(--font-size-base);
          color: var(--color-fg);
          white-space: pre-wrap;
          margin-bottom: var(--space-md);
        }
        .post-body:last-child { margin-bottom: 0; }
        .post-media {
          display: block;
          width: 100%;
          height: auto;
          margin-top: var(--space-sm);
          border-radius: var(--radius-sm);
          background: var(--color-surface);
        }
        video.post-media { max-height: 70vh; }
      `}</style>
    </>
  )
}
