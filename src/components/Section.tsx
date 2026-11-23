import type { ReactNode } from 'react'
import Reveal from './Reveal'

export function Section({ id, className = '', children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`section-pad relative scroll-mt-4 ${className}`}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  )
}

interface HeadingProps {
  id: string
  index: string
  label: string
  title: ReactNode
  intro?: ReactNode
  className?: string
}

export function SectionHeading({ id, index, label, title, intro, className = '' }: HeadingProps) {
  return (
    <Reveal className={`mb-12 max-w-3xl sm:mb-16 ${className}`}>
      <p className="eyebrow mb-5 flex items-center gap-3">
        <span className="h-px w-8 bg-aqua/60" />
        {index} — {label}
      </p>
      <h2 id={`${id}-title`} className="h2">
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">{intro}</p>}
    </Reveal>
  )
}
