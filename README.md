# Punk Dewds

10,000 hand-drawn crypto punks by Derrick Kempf.

## Stack

Next.js (API routes only), single-file HTML front-end, Vercel Postgres, Resend, Stripe, ethers.js, svgo.

## Setup

```bash
npm install
cp .env.example .env.local
# fill in your values
npm run db:setup
npm run dev
```

## Environment Variables

See `.env.example` for the full list. You'll need Vercel Postgres, Resend, and Stripe credentials.

## Deploy

See [DEPLOY.md](DEPLOY.md).

## License

All artwork © Derrick Kempf.
