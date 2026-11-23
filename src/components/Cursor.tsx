import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsDesktop, usePrefersReducedMotion } from '../lib/env'

/** Custom cursor — mounted on desktop pointer devices only, and never for reduced-motion visitors. */
export default function Cursor() {
  const desktop = useIsDesktop()
  const reduce = usePrefersReducedMotion()
  const enabled = desktop && !reduce

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const dotX = useSpring(x, { stiffness: 600, damping: 40, mass: 0.3 })
  const dotY = useSpring(y, { stiffness: 600, damping: 40, mass: 0.3 })
  const ringX = useSpring(x, { stiffness: 150, damping: 18 })
  const ringY = useSpring(y, { stiffness: 150, damping: 18 })
  const [big, setBig] = useState(false)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement | null
      setBig(!!t?.closest('a,button,input,textarea,[data-cursor]'))
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[250] -ml-1 -mt-1 h-2 w-2 rounded-full bg-aqua"
        style={{ x: dotX, y: dotY }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[250] -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border border-aqua/70"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: big ? 1.8 : 1, opacity: big ? 0.95 : 0.55 }}
        transition={{ duration: 0.25 }}
      />
    </>
  )
}
