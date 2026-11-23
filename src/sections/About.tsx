import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Brain, Code2, Puzzle } from 'lucide-react'
import { Section, SectionHeading } from '../components/Section'
import Reveal from '../components/Reveal'
import { ABOUT, PROFILE } from '../data/content'
import { usePrefersReducedMotion } from '../lib/env'

const ICONS = [Code2, Brain, Puzzle]

/** Pure-CSS 3D wireframe cube — a subtle 3D accent without a second WebGL context. */
function GlassCube() {
  const reduce = usePrefersReducedMotion()
  const faces = [
    'translateZ(48px)',
    'rotateY(180deg) translateZ(48px)',
    'rotateY(90deg) translateZ(48px)',
    'rotateY(-90deg) translateZ(48px)',
    'rotateX(90deg) translateZ(48px)',
    'rotateX(-90deg) translateZ(48px)',
  ]
  return (
    <div className="h-24 w-24" style={{ perspective: 600 }} aria-hidden="true">
      <motion.div
        className="relative h-24 w-24"
        style={{ transformStyle: 'preserve-3d' }}
        animate={reduce ? undefined : { rotateX: 360, rotateY: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      >
        {faces.map((f) => (
          <div key={f} className="absolute inset-0 border border-aqua/40 bg-aqua/[0.05]" style={{ transform: f }} />
        ))}
      </motion.div>
    </div>
  )
}

export default function About() {
  const [tab, setTab] = useState(0)
  const reduce = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40])
  const yB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 50])

  return (
    <Section id="about">
      <SectionHeading id="about" index="01" label="About" title={ABOUT.headline} />

      <div ref={ref} className="grid items-start gap-14 lg:grid-cols-12">
        {/* Story + interactive timeline */}
        <div className="lg:col-span-7">
          <div className="space-y-5 text-base leading-relaxed text-white/70 sm:text-lg">
            {ABOUT.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10" delay={0.1}>
            <div role="tablist" aria-label="Where I am" className="glass inline-flex rounded-full p-1">
              {ABOUT.now.map((n, i) => (
                <button
                  key={n.key}
                  role="tab"
                  id={`about-tab-${i}`}
                  aria-selected={tab === i}
                  aria-controls="about-panel"
                  onClick={() => setTab(i)}
                  className={`relative rounded-full px-5 py-2 text-sm transition ${tab === i ? 'text-ink' : 'text-white/60 hover:text-white'}`}
                >
                  {tab === i && <motion.span layoutId="about-pill" className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-aqua to-soft" />}
                  {n.key}
                </button>
              ))}
            </div>
            <div id="about-panel" role="tabpanel" aria-labelledby={`about-tab-${tab}`} className="mt-5 min-h-[4.5rem] max-w-lg">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-display text-xl leading-snug text-white sm:text-2xl"
                >
                  {ABOUT.now[tab].text}
                </motion.p>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* Profile card + floating info cards */}
        <div className="relative lg:col-span-5">
          <Reveal>
            <div className="glass relative overflow-hidden rounded-3xl p-7">
              <div className="absolute -right-6 -top-6 opacity-80">
                <GlassCube />
              </div>
              <p className="eyebrow mb-6">Profile</p>
              <h3 className="font-display text-3xl font-semibold tracking-tight">{PROFILE.name}</h3>
              <p className="mt-2 text-sm text-white/60">{PROFILE.role}</p>
              <dl className="mt-7 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Aspiring</dt>
                  <dd className="mt-1 text-white/85">{PROFILE.roles.join(' · ')}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Looking for</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {PROFILE.lookingFor.map((l) => (
                      <span key={l} className="chip">
                        {l}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:mt-8 lg:block lg:space-y-4">
            {ABOUT.pillars.map((p, i) => {
              const Icon = ICONS[i]
              return (
                <motion.div
                  key={p.title}
                  style={{ y: i === 1 ? yB : yA }}
                  className={`glass rounded-2xl p-5 lg:max-w-[16.5rem] ${i === 1 ? 'lg:ml-auto lg:-mt-2' : ''} ${i === 2 ? 'lg:ml-6' : ''}`}
                >
                  <Icon size={18} className="text-aqua" aria-hidden="true" />
                  <p className="mt-3 font-display text-base font-semibold">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{p.text}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}
