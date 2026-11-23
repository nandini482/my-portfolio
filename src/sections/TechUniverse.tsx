import { lazy, useState } from 'react'
import { Section, SectionHeading } from '../components/Section'
import Reveal from '../components/Reveal'
import Lazy3D from '../components/Lazy3D'
import { CATEGORIES, SKILLS, STATUS_META, type Status } from '../data/content'
import { useIsDesktop } from '../lib/env'

const TechScene = lazy(() => import('../three/TechScene'))

const ORDER: Status[] = ['known', 'learning', 'exploring']

export default function TechUniverse() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const interactive = useIsDesktop()
  const active = SKILLS.find((s) => s.id === activeId)

  return (
    <Section id="tech">
      <SectionHeading
        id="tech"
        index="02"
        label="Tech Universe"
        title="My tech universe"
        intro="An honest map of what I know, what I'm learning and what I'm still exploring — hover or tap a node."
      />

      {/* Legend */}
      <Reveal className="mb-6 flex flex-wrap gap-3" delay={0.05}>
        {ORDER.map((s) => (
          <div key={s} className="glass flex items-center gap-2.5 rounded-full px-4 py-2 text-xs">
            <span style={{ color: STATUS_META[s].color }} aria-hidden="true">
              {STATUS_META[s].glyph}
            </span>
            <span className="font-medium text-white">{STATUS_META[s].label}</span>
            <span className="hidden text-white/45 sm:inline">— {STATUS_META[s].blurb}</span>
          </div>
        ))}
      </Reveal>

      {/* Constellation */}
      <Reveal>
        <div className="glass relative h-[26rem] overflow-hidden rounded-3xl sm:h-[34rem]">
          <div className="absolute inset-0" aria-hidden="true">
            <Lazy3D
              fallback={
                <div className="flex h-full items-center justify-center p-8 text-center text-sm text-white/50">
                  The 3D constellation is switched off on this device — the full skill list is just below.
                </div>
              }
            >
              <TechScene activeId={activeId} onActive={setActiveId} interactive={interactive} />
            </Lazy3D>
          </div>
        </div>
      </Reveal>

      {/* Readout + accessible skill list (works with keyboard, touch and screen readers) */}
      <div className="mt-6 min-h-[3.5rem]" aria-live="polite">
        {active ? (
          <p className="text-sm text-white/70">
            <span className="font-display text-lg font-semibold text-white">{active.name}</span>{' '}
            <span style={{ color: STATUS_META[active.status].color }}>
              {STATUS_META[active.status].glyph} {STATUS_META[active.status].label}
            </span>{' '}
            — {active.note}
          </p>
        ) : (
          <p className="text-sm text-white/40">Pick a skill to see its category and level.</p>
        )}
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c, ci) => (
          <Reveal key={c.id} delay={ci * 0.06}>
            <div className="glass h-full rounded-2xl p-5">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: c.color }}>
                {c.label}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SKILLS.filter((s) => s.category === c.id).map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="chip"
                      aria-pressed={activeId === s.id}
                      onMouseEnter={() => setActiveId(s.id)}
                      onMouseLeave={() => setActiveId(null)}
                      onFocus={() => setActiveId(s.id)}
                      onBlur={() => setActiveId(null)}
                      onClick={() => setActiveId(activeId === s.id ? null : s.id)}
                    >
                      <span style={{ color: STATUS_META[s.status].color }} aria-hidden="true">
                        {STATUS_META[s.status].glyph}
                      </span>
                      {s.name}
                      <span className="sr-only"> — {STATUS_META[s.status].label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
