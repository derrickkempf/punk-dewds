import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Punk Dewds — 10,000 hand-drawn crypto punks',
  description: 'Every original CryptoPunk, redrawn by hand.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* dotlottie-wc registers <dotlottie-wc> as a custom element so the
            logo in the nav animates the same way it does on /app.html. */}
        <Script
          src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.10/dist/dotlottie-wc.js"
          type="module"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  )
}
