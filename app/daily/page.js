import DailyClient from './DailyClient'

export const metadata = {
  title: 'Daily — Punk Dewds',
  description: 'Drawing 100 faces, 100 pushups, 100 crunches. One day at a time.',
}

export const dynamic = 'force-dynamic'

export default function DailyPage() {
  return (
    <main className="pd-container">
      <DailyClient />
    </main>
  )
}
