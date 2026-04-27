'use client'
import { useEffect, useState, useCallback } from 'react'

const ACTIVITIES = [
  { key: 'drawing',  label: 'Draw 100 faces',   target: 100 },
  { key: 'pushups',  label: '100 pushups',      target: 100 },
  { key: 'crunches', label: '100 crunches',     target: 100 },
]

function todayISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

function shiftDate(iso, days) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    timeZone: 'UTC',
  })
}

const EMPTY_DAY = () => ({
  drawing:  { done: false, count: 0 },
  pushups:  { done: false, count: 0 },
  crunches: { done: false, count: 0 },
})

export default function DailyClient() {
  const [date, setDate] = useState(todayISO())
  const [day, setDay]   = useState(EMPTY_DAY())
  const [streak, setStreak] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const isToday  = date === todayISO()
  const isFuture = date > todayISO()

  const showToast = (msg, isError = false) => {
    setToast({ msg, error: isError })
    setTimeout(() => setToast(null), 2200)
  }

  const loadDay = useCallback(async (iso) => {
    setLoading(true)
    try {
      const r = await fetch(`/api/daily?date=${iso}`, { cache: 'no-store' })
      const json = await r.json()
      setDay(json.day || EMPTY_DAY())
      setStreak(json.streak ?? 0)
    } catch {
      setDay(EMPTY_DAY())
    } finally {
      setLoading(false)
    }
  }, [])

  // Check admin status (cookie set by /app.html admin login)
  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => setIsAdmin(!!j.isAdmin))
      .catch(() => {})
  }, [])

  useEffect(() => { loadDay(date) }, [date, loadDay])

  // Keyboard: ← / → to flip days
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowLeft')  setDate(d => shiftDate(d, -1))
      if (e.key === 'ArrowRight') setDate(d => isToday ? d : shiftDate(d, 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isToday])

  const persist = async (next) => {
    setDay(next)
    try {
      const r = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, day: next }),
      })
      if (r.status === 401) {
        // Cookie expired or got cleared — silently re-lock
        setIsAdmin(false)
        return false
      }
      if (!r.ok) {
        showToast('Save failed', true)
        return false
      }
      const json = await r.json()
      setStreak(json.streak ?? 0)
      return true
    } catch {
      showToast('Save failed', true)
      return false
    }
  }

  const toggle = (key) => {
    if (!isAdmin) return
    const a = day[key]
    const nextDone = !a.done
    persist({
      ...day,
      [key]: { done: nextDone, count: nextDone && a.count === 0 ? 100 : a.count },
    })
  }

  const setCount = (key, value) => {
    if (!isAdmin) return
    const n = Math.max(0, Math.min(9999, parseInt(value || '0', 10) || 0))
    persist({
      ...day,
      [key]: { done: n >= 100 ? true : day[key].done, count: n },
    })
  }

  return (
    <div className="daily">
      {/* Date strip */}
      <div className="day-strip">
        <button className="pd-btn pd-btn--ghost" onClick={() => setDate(d => shiftDate(d, -1))} aria-label="Previous day">←</button>
        <div className="day-label">
          <div className="day-eyebrow">
            {isToday ? 'TODAY' : isFuture ? 'FUTURE' : 'PAST'}
          </div>
          <div className="day-date">{formatDate(date)}</div>
        </div>
        <button
          className="pd-btn pd-btn--ghost"
          onClick={() => setDate(d => isToday ? d : shiftDate(d, 1))}
          disabled={isToday}
          aria-label="Next day"
        >→</button>
      </div>

      {/* Streak */}
      <div className="streak-row">
        <div className="streak">
          <span className="streak-dot" />
          {streak} day streak
        </div>
      </div>

      {/* Tasks */}
      <ul className="tasks" aria-busy={loading}>
        {ACTIVITIES.map((a, i) => {
          const v = day[a.key]
          return (
            <li key={a.key} className={`task ${v.done ? 'done' : ''} ${isAdmin ? '' : 'readonly'}`}>
              <span className="task-num">{i + 1}.</span>
              <button
                className={`check ${v.done ? 'on' : ''}`}
                onClick={() => toggle(a.key)}
                disabled={!isAdmin}
                aria-label={`${v.done ? 'Completed' : 'Not yet'}: ${a.label}`}
              >
                {v.done ? '✓' : ''}
              </button>
              <span className="task-label">{a.label}</span>
              <input
                className="task-count"
                type="number"
                min="0"
                max="9999"
                placeholder="0"
                value={v.count || ''}
                onChange={(e) => setCount(a.key, e.target.value)}
                readOnly={!isAdmin}
                disabled={!isAdmin}
                aria-label={`${a.label} count`}
              />
              <span className="task-target">/ {a.target}</span>
            </li>
          )
        })}
      </ul>

      <p className="hint">Use ← → to flip between days.</p>

      {/* Toast */}
      {toast && <div className={`pd-toast show ${toast.error ? 'error' : ''}`}>{toast.msg}</div>}

      <style jsx>{`
        .daily { padding-top: var(--space-md); }

        .day-strip {
          display: flex; align-items: center; justify-content: space-between;
          gap: var(--space-md);
          padding: var(--space-lg) 0;
          border-bottom: 1px solid var(--color-border);
        }
        .day-label { text-align: center; }
        .day-eyebrow {
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
          color: var(--color-muted);
          letter-spacing: .14em;
          margin-bottom: 4px;
        }
        .day-date {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-medium);
          letter-spacing: -0.01em;
        }

        .streak-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--space-md) 0;
        }
        .streak {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-muted);
        }
        .streak-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--color-accent);
        }

        .tasks {
          list-style: none;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-top: var(--space-md);
        }
        .task {
          display: grid;
          grid-template-columns: 32px 36px 1fr auto auto;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid var(--color-border);
          transition: background .12s;
        }
        .task:last-child { border-bottom: none; }
        .task:not(.readonly):hover { background: var(--color-surface); }
        .task.done .task-label { color: var(--color-muted); }

        .task-num {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-muted);
        }
        .check {
          width: 28px; height: 28px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-bg);
          font-size: 16px;
          font-weight: var(--font-weight-bold);
          color: var(--color-bg);
          transition: all .12s;
          cursor: pointer;
        }
        .check:not(:disabled):hover { border-color: var(--color-fg); }
        .check.on {
          background: var(--color-fg);
          border-color: var(--color-fg);
          color: var(--color-bg);
        }
        .check:disabled { cursor: default; }
        .task-label {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-medium);
          color: var(--color-accent);
        }
        .task-count {
          width: 64px;
          padding: 6px 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
          text-align: right;
          background: var(--color-bg);
          color: var(--color-fg);
          outline: none;
        }
        .task-count:focus { border-color: var(--color-fg); }
        .task-count:disabled {
          background: var(--color-surface);
          color: var(--color-muted);
          cursor: default;
        }
        .task-target {
          font-size: var(--font-size-xs);
          color: var(--color-muted);
          letter-spacing: .04em;
        }

        .hint {
          margin-top: var(--space-md);
          text-align: center;
          font-size: var(--font-size-xs);
          color: var(--color-muted);
        }

        @media (max-width: 520px) {
          .task {
            grid-template-columns: 28px 32px 1fr auto;
            gap: var(--space-sm);
          }
          .task-target { display: none; }
        }
      `}</style>
    </div>
  )
}
