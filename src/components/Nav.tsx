import { useEffect, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { scrollToId, setScrollLocked } from '../lib/scroll'
import { PROFILE } from '../data/content'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'tech', label: 'Tech' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'playground', label: 'Playground' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    setScrollLocked(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    // wait a frame so the scroll lock is released before scrolling
    requestAnimationFrame(() => scrollToId(id))
  }

  const goTo = (id: string) => (e: MouseEvent) => {
    e.preventDefault()
    go(id)
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[120] flex justify-center px-4 pt-4">
        <nav aria-label="Primary" className="glass pointer-events-auto flex w-full max-w-3xl items-center justify-between rounded-full py-2 pl-5 pr-2 md:w-auto md:gap-2 md:pl-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              scrollToId('top')
            }}
            className="font-display text-sm font-semibold tracking-wide md:px-3"
            aria-label={`${PROFILE.name} — back to top`}
          >
            NM<span className="text-aqua">.</span>
          </a>

          <ul className="hidden items-center md:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={goTo(l.id)}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm transition ${active === l.id ? 'text-white' : 'text-white/55 hover:text-white'}`}
                >
                  {active === l.id && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/10" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                  )}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[110] flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                  <a href={`#${l.id}`} onClick={goTo(l.id)} className="flex items-baseline gap-4 py-3 font-display text-4xl font-semibold tracking-tight">
                    <span className="font-mono text-xs text-aqua/70">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="mt-10 flex items-center gap-2 font-mono text-xs text-white/50">
              <span className="h-2 w-2 rounded-full bg-aqua" /> {PROFILE.availability}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
