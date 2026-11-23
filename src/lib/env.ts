import { useEffect, useState } from 'react'

/** Subscribe to a CSS media query. Client-only app, so the initial value is read synchronously. */
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** True for mouse/trackpad devices on wider screens — gates the custom cursor and tilt effects. */
export const useIsDesktop = () => useMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)')
export const useIsWide = () => useMedia('(min-width: 900px)')
export const usePrefersReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
  } catch {
    return false
  }
}

/**
 * Whether it's appropriate to mount WebGL scenes.
 * Falls back to the 2D experience when WebGL is missing, the device looks low-powered,
 * or the visitor prefers reduced motion.
 */
export function useCan3D(): boolean {
  const reduced = usePrefersReducedMotion()
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number }
    const lowMemory = (nav.deviceMemory ?? 8) <= 2
    const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 2
    setOk(hasWebGL() && !lowMemory && !lowCpu)
  }, [])
  return ok && !reduced
}
