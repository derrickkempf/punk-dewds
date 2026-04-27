'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/app.html', label: 'Punks', external: true },
  { href: '/daily', label: 'Daily' },
  { href: '/feed', label: 'Feed' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="pd-nav">
      <div className="pd-nav-left">
        <Link href="/app.html" className="pd-nav-brand">Punk Dewds</Link>
      </div>
      <div className="pd-nav-links">
        {LINKS.map(({ href, label, external }) => {
          const active = !external && pathname?.startsWith(href)
          return external ? (
            <a key={href} href={href} className="pd-nav-link">{label}</a>
          ) : (
            <Link
              key={href}
              href={href}
              className={`pd-nav-link${active ? ' active' : ''}`}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
