import { Component, Suspense, type ReactNode } from 'react'
import { useCan3D } from '../lib/env'

class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Gate for every WebGL scene: renders the 2D fallback when 3D isn't appropriate
 * (no WebGL, low-powered device, reduced motion) or if the scene throws.
 * Pass lazily-imported scene components as children.
 */
export default function Lazy3D({ fallback, children }: { fallback: ReactNode; children: ReactNode }) {
  const can3D = useCan3D()
  if (!can3D) return <>{fallback}</>
  return (
    <SceneBoundary fallback={fallback}>
      <Suspense fallback={<div className="h-full w-full animate-pulse rounded-3xl bg-white/[0.02]" aria-hidden="true" />}>
        {children}
      </Suspense>
    </SceneBoundary>
  )
}
