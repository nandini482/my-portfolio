import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import SceneCanvas from '../components/SceneCanvas'

/** Particle field that gently repels from the pointer. */
function Field({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const { home, pos } = useMemo(() => {
    const h = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      h[i * 3] = (Math.random() - 0.5) * 12
      h[i * 3 + 1] = (Math.random() - 0.5) * 7
      h[i * 3 + 2] = (Math.random() - 0.5) * 3
    }
    return { home: h, pos: h.slice() }
  }, [count])

  useFrame((state) => {
    const p = ref.current
    if (!p) return
    const attr = p.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const mx = (state.pointer.x * state.viewport.width) / 2
    const my = (state.pointer.y * state.viewport.height) / 2
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const dx = arr[ix] - mx
      const dy = arr[ix + 1] - my
      const d2 = dx * dx + dy * dy
      let tx = home[ix]
      let ty = home[ix + 1]
      if (d2 < 2.5) {
        const f = (2.5 - d2) / 2.5
        const inv = 1 / Math.sqrt(d2 + 0.0001)
        tx += dx * inv * f * 1.2
        ty += dy * inv * f * 1.2
      }
      arr[ix] += (tx - arr[ix]) * 0.08
      arr[ix + 1] += (ty - arr[ix + 1]) * 0.08
    }
    attr.needsUpdate = true
    p.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#7fe9ff" transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  )
}

/** Holographic orb: wireframe shell + point cloud. Click to pulse. */
function Orb() {
  const group = useRef<THREE.Group>(null)
  const pulse = useRef(0)
  const points = useMemo(() => {
    const n = 900
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = Math.PI * (3 - Math.sqrt(5)) * i
      a[i * 3] = Math.cos(th) * r * 1.6
      a[i * 3 + 1] = y * 1.6
      a[i * 3 + 2] = Math.sin(th) * r * 1.6
    }
    return a
  }, [])

  useFrame((s, dt) => {
    const o = group.current
    if (!o) return
    o.rotation.y += dt * (0.25 + Math.abs(s.pointer.x) * 0.8)
    o.rotation.x = THREE.MathUtils.damp(o.rotation.x, -s.pointer.y * 0.5, 4, dt)
    pulse.current = Math.max(0, pulse.current - dt * 1.6)
    o.scale.setScalar(1 + pulse.current * 0.18)
  })

  return (
    <group ref={group}>
      <mesh onClick={() => (pulse.current = 1)}>
        <icosahedronGeometry args={[1.55, 2]} />
        <meshBasicMaterial color="#2f6bff" wireframe transparent opacity={0.3} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={points} count={points.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.032} color="#3ce6ff" transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
      <mesh scale={0.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#9b8cff" wireframe transparent opacity={0.55} />
      </mesh>
    </group>
  )
}

export default function PlaygroundScene({ mode, lite }: { mode: 'field' | 'orb'; lite: boolean }) {
  return (
    <SceneCanvas camera={{ position: [0, 0, 6], fov: 50 }}>
      {mode === 'field' ? <Field count={lite ? 900 : 2200} /> : <Orb />}
    </SceneCanvas>
  )
}
