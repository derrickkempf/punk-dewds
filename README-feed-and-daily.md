# Daily tracker + Feed — install guide

Two features added to `punk-dewds`:

1. **`/daily`** — vv.xyz-inspired one-day-at-a-time tracker for "100 faces", "100 pushups", "100 crunches". Each row is a checkbox plus an optional count input. Arrow keys flip days. Streak counter at the top.
2. **`/feed`** — public, scrollable feed of sketches, images, videos, and text posts. Admin-only composer at `/feed/admin`.

The existing `/app.html` (10,000 punks tracker) is unchanged except for two new nav links: **Daily** and **Feed**.

**Storage:** Postgres for daily + feed entries (uses your existing `POSTGRES_URL`). Vercel Blob for media in production; falls back to local filesystem in dev.

---

## Files

Copy every file/folder from this bundle into the matching path in `punk-dewds/`. These four files **replace** existing ones:

```
package.json                         (REPLACES — adds @vercel/blob dependency)
app/layout.js                        (REPLACES — adds globals.css import + html/body wrapper)
public/app.html                      (REPLACES — only adds two nav pills)
lib/db-setup.mjs                     (REPLACES — adds kv_store table to existing schema)
```

Everything else is new:

```
app/globals.css                      (NEW)
app/components/Nav.js                (NEW)
app/daily/page.js                    (NEW)
app/daily/DailyClient.js             (NEW)
app/feed/page.js                     (NEW)
app/feed/admin/page.js               (NEW)
app/feed/admin/AdminClient.js        (NEW)
app/api/daily/route.js               (NEW)
app/api/feed/route.js                (NEW)
app/api/feed/upload/route.js         (NEW)
app/api/admin/login/route.js         (NEW)
app/api/admin/session/route.js       (NEW)
lib/storage.js                       (NEW — Postgres-backed)
lib/admin.js                         (NEW)
public/uploads/feed/.gitkeep         (NEW — only used in dev fallback)
```

> Note: this bundle still contains `data/daily.json` and `data/feed.json` from an earlier iteration. They are **not used** by the Postgres storage layer; you can delete the `data/` folder.

---

## Install steps

```bash
# 1. Pull in the new files (above).

# 2. Install the one new dep.
npm install

# 3. Re-run db:setup to add the kv_store table.
#    Safe to re-run — uses CREATE TABLE IF NOT EXISTS.
npm run db:setup

# 4. (Production only) Add a Vercel Blob store and pull the token.
#    In Vercel dashboard: Storage → Create → Blob.
#    The BLOB_READ_WRITE_TOKEN env var is added automatically.
#    `vercel env pull .env.local` to sync locally if you want.

# 5. Start the app.
npm run dev      # local
# or
npm run build && npm start
```

---

## Env vars

| Variable | Required where | Purpose |
|---|---|---|
| `POSTGRES_URL` | everywhere | already set; used by daily + feed |
| `ADMIN_HASH` | everywhere | already set; gates `/daily` writes and `/feed/admin` |
| `SESSION_SECRET` | everywhere | already set; signs the admin cookie |
| `BLOB_READ_WRITE_TOKEN` | production | Vercel Blob token. If unset, uploads go to `public/uploads/feed/` (fine for dev, fails on Vercel) |

The default password (per `DEPLOY.md`) is `punkdewds`. To change:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('your-new-password').digest('hex'))"
```

Put the output in `ADMIN_HASH`.

---

## Data shapes

`kv_store` row with `key = 'daily'`:

```json
{
  "2026-04-27": {
    "drawing":  { "done": true,  "count": 100 },
    "pushups":  { "done": true,  "count": 100 },
    "crunches": { "done": false, "count": 60  }
  }
}
```

The streak counts consecutive days where all three are `done: true`, working backward from today (today only counts if fully done; otherwise the streak walks back from yesterday).

`kv_store` row with `key = 'feed'`:

```json
[
  {
    "id": "uuid",
    "kind": "sketch | image | video | text",
    "title": "optional",
    "body": "optional text",
    "mediaUrl": "/uploads/feed/...   (dev) or https://*.public.blob.vercel-storage.com/feed/... (prod)",
    "createdAt": "2026-04-27T10:00:00.000Z"
  }
]
```

---

## UI map

- **/app.html** punks tracker has new `Daily` and `Feed` pills in the nav.
- **/daily**: arrow buttons + ← → keys flip days, three task rows, streak at top. Sign in / out from the top-right button.
- **/feed**: public read; if you're signed in, a `+ New post` button takes you to `/feed/admin`.
- **/feed/admin**: title + body + file picker. Type selector controls which file types are allowed (image vs video).

That's it.
