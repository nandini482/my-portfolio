import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowUpRight, Github, Linkedin, Mail, Send } from 'lucide-react'
import { Section } from '../components/Section'
import Reveal from '../components/Reveal'
import RichText from '../components/RichText'
import { CONTACT } from '../data/content'

function ContactLink({ href, label, icon, placeholder }: { href: string; label: string; icon: ReactNode; placeholder: string }) {
  const base = 'glass flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-sm transition'
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
        className={`${base} hover:border-aqua/50 hover:bg-white/10`}
      >
        <span className="flex items-center gap-3">
          <span className="text-aqua">{icon}</span>
          {label}
        </span>
        <ArrowUpRight size={16} className="text-white/40" />
      </a>
    )
  }
  return (
    <div aria-disabled="true" className={`${base} border-dashed !border-amber-300/30 text-white/60`}>
      <span className="flex items-center gap-3">
        <span className="text-white/40">{icon}</span>
        {label}
      </span>
      <RichText text={placeholder} />
    </div>
  )
}

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'no-email' | 'sent'>('idle')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    if (!CONTACT.email) {
      setStatus('no-email')
      return
    }
    const subject = `Portfolio message from ${data.get('name')}`
    const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('sent')
  }

  const field =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-aqua/60 focus:bg-white/[0.07]'

  return (
    <Section id="contact" className="pb-28">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-navy via-ink to-ink p-6 sm:p-12 lg:p-16">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-electric/25 blur-[110px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-soft/15 blur-[120px]" aria-hidden="true" />

        <div className="relative grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-aqua/60" />
              06 — Contact
            </p>
            <h2 id="contact-title" className="h2">
              Have something interesting in mind?
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg">Let&apos;s create something meaningful together.</p>

            <div className="mt-10 space-y-3">
              <ContactLink
                href={CONTACT.email ? `mailto:${CONTACT.email}` : ''}
                label={CONTACT.email || 'Email'}
                icon={<Mail size={18} />}
                placeholder="[add your email]"
              />
              <ContactLink href={CONTACT.github} label="GitHub" icon={<Github size={18} />} placeholder="[add GitHub URL]" />
              <ContactLink href={CONTACT.linkedin} label="LinkedIn" icon={<Linkedin size={18} />} placeholder="[add LinkedIn URL]" />
              {CONTACT.socials.map((s) => (
                <ContactLink key={s.label} href={s.href} label={s.label} icon={<ArrowUpRight size={18} />} placeholder="" />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="glass space-y-4 rounded-3xl p-6 sm:p-8" aria-labelledby="contact-title">
              <div>
                <label htmlFor="c-name" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                  Name
                </label>
                <input id="c-name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="c-email" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                  Email
                </label>
                <input id="c-email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="c-msg" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                  Message
                </label>
                <textarea id="c-msg" name="message" required rows={5} className={`${field} resize-none`} placeholder="What's on your mind?" />
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Send message <Send size={15} />
              </button>
              <p role="status" className="min-h-[1.25rem] text-xs text-white/50">
                {status === 'no-email' && (
                  <RichText text="This form opens your email app, but no address is set yet. [Set CONTACT.email in src/data/content.ts]" />
                )}
                {status === 'sent' && 'Opening your email app…'}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
