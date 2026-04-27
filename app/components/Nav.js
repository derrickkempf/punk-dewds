'use client'
import { usePathname } from 'next/navigation'

// Mirrors the nav in /public/app.html so that /daily and /feed look identical
// to the punks tracker. Logo + tagline left, pills on the right.
//
// The dotlottie-wc web component is loaded from the layout's <Script>.
export default function Nav() {
  const pathname = usePathname() || ''
  const isDaily = pathname.startsWith('/daily')
  const isFeed  = pathname.startsWith('/feed')

  return (
    <nav>
      <div className="nav-left">
        <a className="logo" href="/app.html" aria-label="Punks">
          {/* dotlottie-wc is registered as a web component; React just renders it */}
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
        <a className="nav-pill" href="/app.html" title="Punks tracker">
          <b>0</b> / 10,000
        </a>
        <a
          className="nav-about-btn"
          href="/app.html"
          title="About this project"
          aria-label="About"
        >?</a>
      </div>
    </nav>
  )
}
