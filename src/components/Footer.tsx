import { PROFILE } from '../data/content'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 font-mono text-xs text-white/40 sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <p>Designed &amp; built with React, Three.js and a lot of curiosity.</p>
      </div>
    </footer>
  )
}
