import { lazy, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import SplitText from '../components/SplitText'
import Lazy3D from '../components/Lazy3D'
import OrbFallback from '../components/OrbFallback'
import { scrollToId } from '../lib/scroll'
import { gradientAt, EASE } from '../lib/motion'
import { useIsWide, usePrefersReducedMotion } from '../lib/env'
import { PROFILE } from '../data/content'

const HeroScene = lazy(() => import('../three/HeroScene'))

export default function Hero({ ready }: { ready: boolean }) {
  const wide = useIsWide()
  const reduce = usePrefersReducedMotion()
  const fade = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 24 } as const),
    animate: ready || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.9, delay, ease: EASE },
  })

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate min-h-[100svh] overflow-hidden">
      {/* 3D stage */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[62svh] md:inset-0 md:h-auto" aria-hidden="true">
        <Lazy3D fallback={<OrbFallback className="h-full w-full md:translate-x-[22%]" />}>
          <HeroScene compact={!wide} />
        </Lazy3D>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-end px-5 pb-28 pt-28 sm:px-8 md:justify-center lg:px-12">
        <motion.div {...fade(0.1)} className="glass mb-8 inline-flex w-fit items-center gap-3 rounded-full py-2 pl-3 pr-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping2 rounded-full bg-aqua" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-aqua" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/80">{PROFILE.availability}</span>
        </motion.div>

        <h1
          id="hero-title"
          aria-label={PROFILE.name}
          className="font-display text-[clamp(3.1rem,13vw,9.5rem)] font-bold leading-[0.9] tracking-[-0.03em]"
        >
          <span className="block text-white">
            <SplitText text="NANDINI" ready={ready} />
          </span>
          <span className="block">
            <SplitText text="MISHRA" ready={ready} delay={0.3} colorFn={gradientAt} />
          </span>
        </h1>

        <motion.p {...fade(0.9)} className="mt-8 max-w-xl font-display text-xl font-medium leading-snug text-white sm:text-2xl md:text-[1.7rem]">
          Turning curiosity into code.
          <br />
          <span className="text-white/60">Ideas into intelligent experiences.</span>
        </motion.p>

        <motion.p {...fade(1.05)} className="mt-5 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
          Computer Science Engineering student exploring Software Development, AI and emerging technologies.
        </motion.p>

        <motion.div {...fade(1.2)} className="mt-9 flex flex-wrap gap-3">
          <a href="#projects" onClick={go('projects')} className="btn-primary">
            Explore My Work <ArrowUpRight size={16} />
          </a>
          <a href="#contact" onClick={go('contact')} className="btn-ghost">
            Let&apos;s Connect
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        {...fade(1.5)}
        href="#about"
        onClick={go('about')}
        aria-label="Scroll to About section"
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">Scroll</span>
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-white/25 pt-2">
          <span className="h-1.5 w-1 animate-scrolldot rounded-full bg-aqua" />
        </span>
      </motion.a>
    </section>
  )
}
