# Punk Dewds

**10,000 hand-drawn CryptoPunks.**

Every original CryptoPunk, redrawn by hand, one at a time. The goal: 100 days. That's 100 drawings a day. This app tracks progress from punk #0000 to punk #9999.

**Live site:** [punk.dewd.cool](https://punk.dewd.cool/app.html)

---

## What It Does

Punk Dewds is a progress tracker and gallery for hand-drawing all 10,000 CryptoPunks. Visitors can browse the full collection, see which punks have been drawn, vote for favorites, and leave comments. An admin panel powers the drawing workflow with batch upload tools, status tracking, and a daily practice log.

### Features

- **10K punk grid** — browse, search, filter, and sort all 10,000 punks
- **Drawing uploads** — individual or batch upload via a grid cropper tool that slices scanned sheets into individual tiles
- **SVG optimization** — auto-optimizes uploaded SVGs via SVGO for on-chain minting
- **Voting and comments** — email-authenticated community interaction on each punk
- **Daily tracker** — log daily drawing sessions with streak tracking
- **Feed** — post text, sketch, image, and video updates on the creative process
- **Admin panel** — password-gated upload, status management, and batch tools

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Frontend | Vanilla JS single-page app (`public/app.html`) |
| Database | [Neon Postgres](https://neon.tech) (KV store + user tables) |
| File storage | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| Auth | HMAC-signed httpOnly cookies (admin), email verification codes (users) |
| Email | [Resend](https://resend.com) |
| Hosting | [Vercel](https://vercel.com) behind [Cloudflare](https://cloudflare.com) proxy |
| Blockchain | [ethers.js](https://ethers.org) (future on-chain minting) |

## Project Structure

```
punk-dewds/
├── public/
│   └── app.html              # Main UI — all HTML/CSS/JS in one file
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.js    # POST — admin password auth
│   │   │   └── session/route.js  # GET — check admin session
│   │   ├── daily/route.js        # GET/POST — daily task tracker
│   │   ├── feed/
│   │   │   ├── route.js          # GET/POST/DELETE — feed posts
│   │   │   └── upload/route.js   # POST — file uploads to Vercel Blob
│   │   └── punks/route.js        # GET/POST — punk data (art URLs, status, votes)
│   ├── layout.js                 # Root layout (nav, footer, lottie logo)
│   └── globals.css               # Shared styles
├── lib/
│   ├── db.js                 # Postgres pool + auto-migration
│   ├── db-setup.mjs          # Manual table creation script
│   ├── storage.js            # KV read/write + Blob uploads
│   └── admin.js              # HMAC cookie auth
├── middleware.js              # CORS for Cloudflare proxy
├── next.config.mjs
└── package.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up local environment
cp .env.example .env.local
# Fill in your environment variables

# Create database tables
npm run db:setup

# Start dev server
npm run dev
```

The app will be available at `http://localhost:3000/app.html`.

## How the Grid Cropper Works

The admin panel includes a batch cropper for processing scanned sheets of hand-drawn punks:

1. Upload a scanned image (e.g. a 12x9 inch sheet)
2. Set the grid dimensions (columns x rows) and starting punk number
3. Click "Crop & Preview" to slice the sheet into individual tiles
4. Select/deselect tiles you want to keep
5. Download as ZIP or upload directly — each tile auto-links to its punk by filename (e.g. `0042.png` maps to punk #42)

## License

All content, drawings, and code are property of Derrick Kempf / [dewd.cool](https://dewd.cool). CryptoPunks intellectual property is held by Infinite NODE Foundation. This project documents the work-in-progress of drawing all CryptoPunks by hand and is not affiliated with NODE or CryptoPunks.
