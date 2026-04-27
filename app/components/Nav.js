'use client'
import { usePathname } from 'next/navigation'

// Mirrors the nav in /public/app.html so /daily and /feed look identical.
// Logo + tagline left, pills right. Count pill toggles a stats drawer and
// the ? button opens the About modal — both rendered by <Chrome>.
export default function Nav({ statsCount = 0, onToggleStats, onOpenAbout }) {
  const pathname = usePathname() || ''
  const isDaily = pathname.startsWith('/daily')
  const isFeed  = pathname.startsWith('/feed')

  return (
    <nav>
      <div className="nav-left">
        <a className="logo" href="/app.html" aria-label="Punks">
          <dotlottie-wc
            src="/punk-dewds-logo.lottie"
            style={{ width: '154px', height: '35px' }}
            autoplay="true"
            loop="true"
          />
        </a>
        <span className="tagline">10,000 hand-drawn crypto punks by Derrick Kempf.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <a
          className={`nav-pill${isDaily ? ' active' : ''}`}
          href="/daily"
          title="Daily tracker"
        >Daily</a>
        <a
          className={`nav-pill${isFeed ? ' active' : ''}`}
          href="/feed"
          title="Feed"
        >Feed</a>
        <button
          className="nav-pill"
          onClick={onToggleStats}
          title="Punks tracker stats"
          type="button"
        >
          <b>{statsCount.toLocaleString()}</b> / 10,000
        </button>
        <button
          className="nav-about-btn"
          onClick={onOpenAbout}
          title="About this project"
          aria-label="About"
          type="button"
        >?</button>
      </div>
    </nav>
  )
}
