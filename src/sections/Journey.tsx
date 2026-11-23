import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BookOpen, Building2, GraduationCap, ShieldCheck, Sparkles, Trophy } from 'lucide-react'
import { Section, SectionHeading } from '../components/Section'
import Reveal from '../components/Reveal'
import RichText from '../components/RichText'
import { JOURNEY, type JourneyItem } from '../data/content'
import { usePrefersReducedMotion } from '../lib/env'

const ICONS: Record<JourneyItem['icon'], typeof Trophy> = {
  grad: GraduationCap,
  book: BookOpen,
  trophy: Trophy,
  building: Building2,
  shield: ShieldCheck,
  spark: Sparkles,
}

export default function Journey() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <Section id="journey">
      <SectionHeading id="journey" index="04" label="Journey" title="The path so far" intro="Milestones, in the order they happened — more to come." />

      <ol ref={ref} className="relative">
        {/* Rail */}
        <div className="absolute bottom-0 left-4 top-0 w-px -translate-x-1/2 bg-white/10 md:left-1/2" aria-hidden="true" />
        <motion.div
          aria-hidden="true"
          style={{ height: reduce ? '100%' : height }}
          className="absolute left-4 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-aqua via-electric to-soft md:left-1/2"
        />

        {JOURNEY.map((item, i) => {
          const Icon = ICONS[item.icon]
          const left = i % 2 === 0
          return (
            <li key={item.title} className="relative grid pb-12 pl-12 last:pb-0 md:grid-cols-2 md:gap-20 md:pl-0">
              <span
                aria-hidden="true"
                className="absolute left-4 top-6 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-aqua/50 bg-ink text-aqua md:left-1/2"
              >
                <Icon size={15} />
              </span>
              <Reveal className={left ? 'md:col-start-1 md:text-right' : 'md:col-start-2'} y={36}>
                <article className="glass rounded-2xl p-6 transition hover:border-aqua/40">
                  <div className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] ${left ? 'md:justify-end' : ''}`}>
                    <span className="text-aqua">{item.tag}</span>
                    <span className="text-white/35">
                      <RichText text={item.when} />
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    <RichText text={item.text} />
                  </p>
                </article>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
