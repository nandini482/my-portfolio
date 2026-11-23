import { lazy, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Box, Github, Palette, Plus } from 'lucide-react'
import { Section, SectionHeading } from '../components/Section'
import Reveal from '../components/Reveal'
import Lazy3D from '../components/Lazy3D'
import TiltCard from '../components/TiltCard'
import RichText from '../components/RichText'
import { PROJECTS, type Project } from '../data/content'
import { EASE } from '../lib/motion'

const ProjectScene = lazy(() => import('../three/ProjectScene'))

function PreviewFallback({ project }: { project: Project }) {
  const Icon = project.id === 'seismokavach' ? Box : Palette
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 text-center"
      style={{ background: `radial-gradient(circle at 50% 40%, ${project.accent}22, transparent 65%)` }}
    >
      <Icon size={44} style={{ color: project.accent }} aria-hidden="true" />
      <p className="font-display text-2xl font-semibold">{project.title}</p>
      <p className="max-w-xs text-xs text-white/45">3D preview unavailable on this device.</p>
    </div>
  )
}

function LinkSlot({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-5 !py-3">
        {icon} {label} <ArrowUpRight size={14} />
      </a>
    )
  }
  return (
    <span
      aria-disabled="true"
      title="Add this link in src/data/content.ts"
      className="inline-flex items-center gap-2 rounded-full border border-dashed border-amber-300/40 px-5 py-3 text-sm text-amber-300/80"
    >
      {icon} {label} — <span className="editable !border-0">[add link]</span>
    </span>
  )
}

export default function Projects() {
  const [i, setI] = useState(0)
  const [mode, setMode] = useState<'3d' | '2d'>('3d')
  const [stress, setStress] = useState(true)
  const project = PROJECTS[i]

  return (
    <Section id="projects">
      <SectionHeading
        id="projects"
        index="03"
        label="Projects"
        title="Things I've been building"
        intro="Concept-stage work I'm proud of — presented as exactly what it is."
      />

      {/* Project switcher */}
      <Reveal>
        <div role="tablist" aria-label="Projects" className="mb-8 flex flex-wrap gap-3">
          {PROJECTS.map((p, idx) => (
            <button
              key={p.id}
              role="tab"
              id={`proj-tab-${p.id}`}
              aria-selected={i === idx}
              aria-controls="proj-panel"
              onClick={() => {
                setI(idx)
                setMode('3d')
                setStress(true)
              }}
              className={`group glass flex items-center gap-3 rounded-2xl px-5 py-3 text-left transition ${i === idx ? '!border-aqua/60 bg-white/10' : 'hover:bg-white/[0.07]'}`}
            >
              <span className="font-mono text-xs text-white/40">{p.index}</span>
              <span className="font-display text-base font-semibold">{p.title}</span>
            </button>
          ))}
          <div className="flex items-center gap-2 rounded-2xl border border-dashed border-white/15 px-5 py-3 text-sm text-white/35">
            <Plus size={14} aria-hidden="true" /> Next project{' '}
            <span className="hidden sm:inline">
              <RichText text="[add in src/data/content.ts]" />
            </span>
          </div>
        </div>
      </Reveal>

      <div id="proj-panel" role="tabpanel" aria-labelledby={`proj-tab-${project.id}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* 3D preview */}
            <TiltCard>
              <div className="glass relative h-[22rem] overflow-hidden rounded-3xl sm:h-[30rem]">
                <div className="absolute inset-0" role="img" aria-label={`3D preview of ${project.title}`}>
                  <Lazy3D fallback={<PreviewFallback project={project} />}>
                    <ProjectScene id={project.id} mode={mode} stress={stress} />
                  </Lazy3D>
                </div>

                <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-3">
                  <span className="glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: project.accent }}>
                    {project.badge}
                  </span>
                </div>

                {project.id === 'seismokavach' && (
                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2">
                    <div className="glass inline-flex rounded-full p-1 text-xs">
                      {(['3d', '2d'] as const).map((m) => (
                        <button
                          key={m}
                          aria-pressed={mode === m}
                          onClick={() => setMode(m)}
                          className={`rounded-full px-4 py-1.5 transition ${mode === m ? 'bg-aqua text-ink' : 'text-white/70 hover:text-white'}`}
                        >
                          {m === '3d' ? '3D view' : '2D projection'}
                        </button>
                      ))}
                    </div>
                    <button
                      aria-pressed={stress}
                      onClick={() => setStress((v) => !v)}
                      className={`glass rounded-full px-4 py-2 text-xs transition ${stress ? '!border-[#ff6b5a]/60 text-[#ff9a8d]' : 'text-white/60'}`}
                    >
                      Stress points: {stress ? 'on' : 'off'}
                    </button>
                  </div>
                )}
              </div>
            </TiltCard>

            {/* Details */}
            <div className="mt-10 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="font-mono text-xs text-white/40">PROJECT {project.index}</p>
                <h3 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h3>
                <p className="mt-3 font-display text-lg" style={{ color: project.accent }}>
                  {project.tagline}
                </p>
                <p className="mt-5 text-base leading-relaxed text-white/70">{project.description}</p>

                {project.disclaimer && (
                  <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/55">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-aqua/80">Honest note · </span>
                    {project.disclaimer}
                  </p>
                )}

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="eyebrow mb-2">Problem</h4>
                    <p className="text-sm leading-relaxed text-white/65">{project.problem}</p>
                  </div>
                  <div>
                    <h4 className="eyebrow mb-2">Solution</h4>
                    <p className="text-sm leading-relaxed text-white/65">{project.solution}</p>
                  </div>
                </div>

                <h4 className="eyebrow mb-3 mt-8">Concept features</h4>
                <ul className="flex flex-wrap gap-2">
                  {project.features.map((f) => (
                    <li key={f} className="chip">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8 lg:col-span-5">
                <div>
                  <h4 className="eyebrow mb-3">Technologies &amp; focus</h4>
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((t) => (
                      <li key={t} className="chip">
                        <RichText text={t} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="eyebrow mb-3">My contribution</h4>
                  <ul className="space-y-2 text-sm text-white/70">
                    {project.contribution.map((c) => (
                      <li key={c} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-aqua" aria-hidden="true" />
                        <span>
                          <RichText text={c} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {project.future && (
                  <div>
                    <h4 className="eyebrow mb-3">Future scope — not built yet</h4>
                    <ul className="space-y-2 text-sm text-white/50">
                      {project.future.map((f) => (
                        <li key={f} className="flex gap-3">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full border border-white/40" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <LinkSlot href={project.github} label="GitHub" icon={<Github size={16} />} />
                  <LinkSlot href={project.demo} label="Live demo" icon={<ArrowUpRight size={16} />} />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  )
}
