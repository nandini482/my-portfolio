import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import MouseGlow from './components/MouseGlow'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import TechUniverse from './sections/TechUniverse'
import Projects from './sections/Projects'
import Journey from './sections/Journey'
import Beyond from './sections/Beyond'
import Contact from './sections/Contact'
import { initScroll } from './lib/scroll'

export default function App() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  // Warm the hero scene chunk while the loader plays.
  useEffect(() => {
    void import('./three/HeroScene')
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = ready ? '' : 'hidden'
  }, [ready])

  useEffect(() => {
    if (!ready) return
    return initScroll()
  }, [ready])

  return (
    <div className="grain">
      <a href="#about" className="skip">
        Skip to content
      </a>
      <AnimatePresence>{!ready && <Loader onDone={onDone} />}</AnimatePresence>
      <MouseGlow />
      <Cursor />
      <Nav />
      <main className="relative z-10">
        <Hero ready={ready} />
        <About />
        <TechUniverse />
        <Projects />
        <Journey />
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
