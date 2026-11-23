import { lazy, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { Section, SectionHeading } from '../components/Section'
import Reveal from '../components/Reveal'
import Lazy3D from '../components/Lazy3D'
import { CODE_LINES } from '../data/content'
import { useIsDesktop, usePrefersReducedMotion } from '../lib/env'

const PlaygroundScene = lazy(() => import('../three/PlaygroundScene'))

const FULL_TEXT = CODE_LINES.join('\n')

/** Small code-inspired typing animation. Shows the full text immediately for reduced-motion visitors. */
function CodeTyper() {
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (reduce) {
      setN(FULL_TEXT.length)
      return
    }
    if (!inView) return
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= FULL_TEXT.length) {
          window.clearInterval(id)
          return v
        }
        return v + 1
      })
    }, 32)
    return () => window.clearInterval(id)
  }, [inView, reduce])

  const lines = FULL_TEXT.slice(0, n).split('\n')

  return (
    <div ref={ref} className="glass h-full rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="ml-3 font-mono text-[10px] text-white/30">curiosity.ts</span>
      </div>
      <pre className="min-h-[13rem] overflow-hidden whitespace-pre-wrap font-mono text-[13px] leading-6 text-white/80" aria-label={FULL_TEXT}>
        <code aria-hidden="true">
          {lines.map((l, i) => (
            <span key={i} className={`block ${l.trim().startsWith('//') ? 'text-white/35' : ''}`}>
              {l || ' '}
              {i === lines.length - 1 && n < FULL_TEXT.length && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-caret bg-aqua" />}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
}

export default function Beyond() {
  const [mode, setMode] = useState<'field' | 'orb'>('field')
  const desktop = useIsDesktop()

  return (
    <Section id="playground">
      <SectionHeading
        id="playground"
        index="05"
        label="Experiments"
        title="Beyond the Screen"
        intro="A small digital playground. Move your pointer through the particles, or switch to the holographic orb and click it."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="glass relative h-[22rem] overflow-hidden rounded-3xl sm:h-[28rem]">
            <div className="absolute inset-0" role="img" aria-label={mode === 'field' ? 'Interactive particle field' : 'Interactive holographic orb'}>
              <Lazy3D
                fallback={
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(47,107,255,0.18),transparent_65%)] p-8 text-center text-sm text-white/50">
                    The interactive playground is switched off on this device.
                  </div>
                }
              >
                <PlaygroundScene mode={mode} lite={!desktop} />
              </Lazy3D>
            </div>
            <div className="absolute bottom-4 left-4 flex gap-2">
              <div className="glass inline-flex rounded-full p-1 text-xs">
                {(
                  [
                    ['field', 'Particle field'],
                    ['orb', 'Holo orb'],
                  ] as const
                ).map(([m, label]) => (
                  <button
                    key={m}
                    aria-pressed={mode === m}
                    onClick={() => setMode(m)}
                    className={`rounded-full px-4 py-1.5 transition ${mode === m ? 'bg-aqua text-ink' : 'text-white/70 hover:text-white'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.1}>
          <CodeTyper />
        </Reveal>
      </div>
    </Section>
  )
}
