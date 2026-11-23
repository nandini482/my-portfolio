import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../lib/env'
import { EASE } from '../lib/motion'

interface Props {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

/** Scroll-triggered fade + rise. Renders instantly for reduced-motion visitors. */
export default function Reveal({ children, delay = 0, y = 28, className }: Props) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
