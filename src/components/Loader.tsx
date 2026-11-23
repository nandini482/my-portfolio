import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/env'

/** Opening loading experience. Calls onDone when the progress ring completes. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const reduce = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = reduce ? 400 : 1800
    const start = performance.now()
    let raf = 0
    let timeout = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setProgress(Math.round(100 * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
      else timeout = window.setTimeout(onDone, 260)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timeout)
    }
  }, [onDone, reduce])

  const R = 54
  const C = 2 * Math.PI * R

  return (
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <div className="relative h-36 w-36">
        <div className="absolute inset-0 rounded-full bg-electric/20 blur-2xl" />
        <svg viewBox="0 0 120 120" className="relative h-full w-full -rotate-90">
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3ce6ff" />
              <stop offset="0.55" stopColor="#2f6bff" />
              <stop offset="1" stopColor="#9b8cff" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="url(#ring)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress / 100)}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-2xl font-semibold tracking-tight">NM</span>
      </div>
      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.35em] text-white/50">Initialising universe</p>
      <p className="mt-2 font-mono text-sm text-aqua">{progress}%</p>
    </motion.div>
  )
}
