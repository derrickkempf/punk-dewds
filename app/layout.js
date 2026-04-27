import './globals.css'

export const metadata = {
  title: 'Punk Dewds — 10,000 hand-drawn crypto punks',
  description: 'Every original CryptoPunk, redrawn by hand.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
