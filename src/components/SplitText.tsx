import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../lib/env'
import { EASE } from '../lib/motion'

interface Props {
  text: string
  ready?: boolean
  delay?: number
  className?: string
  colorFn?: (index: number, total: number) => string
}

/** Letter-by-letter mask reveal. Decorative: the parent heading carries the accessible label. */
export default function SplitText({ text, ready = true, delay = 0, className, colorFn }: Props) {
  const reduce = usePrefersReducedMotion()
  const chars = text.split('')
  return (
    <span aria-hidden="true" className={className}>
      {chars.map((c, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            style={colorFn ? { color: colorFn(i, chars.length) } : undefined}
            initial={reduce ? false : { y: '115%' }}
            animate={{ y: ready || reduce ? '0%' : '115%' }}
            transition={{ duration: 0.9, delay: delay + i * 0.05, ease: EASE }}
          >
            {c === ' ' ? ' ' : c}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
