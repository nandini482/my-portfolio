import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsDesktop, usePrefersReducedMotion } from '../lib/env'

/** Soft cyan/blue light that trails the pointer behind page content (desktop only). */
export default function MouseGlow() {
  const desktop = useIsDesktop()
  const reduce = usePrefersReducedMotion()
  const enabled = desktop && !reduce
  const mx = useMotionValue(-600)
  const my = useMotionValue(-600)
  const x = useSpring(mx, { stiffness: 90, damping: 24 })
  const y = useSpring(my, { stiffness: 90, damping: 24 })

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      mx.set(e.clientX - 320)
      my.set(e.clientY - 320)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [enabled, mx, my])

  if (!enabled) return null
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[640px] w-[640px] rounded-full"
      style={{
        x,
        y,
        background: 'radial-gradient(circle, rgba(60,230,255,0.11), rgba(47,107,255,0.06) 40%, transparent 70%)',
      }}
    />
  )
}
