import { useRef, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useInView } from 'framer-motion'

interface Props {
  children: ReactNode
  camera?: { position: [number, number, number]; fov?: number }
  className?: string
  onPointerMissed?: () => void
}

/**
 * Shared canvas wrapper. The render loop only runs while the canvas is near the viewport,
 * which keeps GPU work low on long pages.
 */
export default function SceneCanvas({ children, camera, className = 'h-full w-full', onPointerMissed }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '200px' })
  return (
    <div ref={ref} className={className}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: camera?.position ?? [0, 0, 6], fov: camera?.fov ?? 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onPointerMissed={onPointerMissed}
      >
        {children}
      </Canvas>
    </div>
  )
}
