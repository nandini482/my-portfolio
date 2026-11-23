import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Float, Html, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import SceneCanvas from '../components/SceneCanvas'
import { mouse } from '../lib/mouse'

type V3 = [number, number, number]

const LABELS: { text: string; pos: V3 }[] = [
  { text: 'Python', pos: [-2.5, 1.5, 0.6] },
  { text: 'Java', pos: [2.6, 1.1, 0.4] },
  { text: 'AI / ML', pos: [2.4, -1.6, 0.8] },
  { text: 'Three.js', pos: [-2.7, -1.2, 0.5] },
  { text: 'DSA', pos: [0.4, 2.3, 0.2] },
  { text: 'Cybersecurity', pos: [-0.6, -2.4, 0.4] },
]

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 16
      a[i * 3 + 1] = (Math.random() - 0.5) * 10
      a[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1
    }
    return a
  }, [count])
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.02
      ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, mouse.y * 0.08, 2, dt)
    }
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#9fdcff" transparent opacity={0.7} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function GlassPanel({ position, rotation, size, speed }: { position: V3; rotation: V3; size: [number, number]; speed: number }) {
  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[size[0], size[1], 0.04]} />
        <meshPhysicalMaterial color="#9bb8ff" transparent opacity={0.14} roughness={0.08} metalness={0.2} clearcoat={1} />
      </mesh>
    </Float>
  )
}

function Stage({ compact }: { compact: boolean }) {
  const group = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const core = useRef<THREE.Mesh>(null)

  useFrame((_, dt) => {
    const g = group.current
    if (g) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, mouse.x * 0.5, 3, dt)
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -mouse.y * 0.3, 3, dt)
    }
    const l = light.current
    if (l) {
      l.position.x = THREE.MathUtils.damp(l.position.x, mouse.x * 5, 4, dt)
      l.position.y = THREE.MathUtils.damp(l.position.y, mouse.y * 3, 4, dt)
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.25
    if (ringB.current) ringB.current.rotation.y += dt * 0.3
    if (core.current) {
      core.current.rotation.x += dt * 0.5
      core.current.rotation.y += dt * 0.7
    }
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight ref={light} position={[0, 0, 3.5]} intensity={55} distance={14} color="#3ce6ff" />
      <pointLight position={[-4, -2, 2]} intensity={30} distance={12} color="#9b8cff" />
      <pointLight position={[4, 3, -2]} intensity={34} distance={12} color="#2f6bff" />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.2} color="#3ce6ff" position={[-5, 2, -3]} scale={[8, 3, 1]} rotation-y={Math.PI / 2} />
        <Lightformer intensity={2} color="#9b8cff" position={[5, -1, -3]} scale={[8, 3, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer intensity={1.4} color="#cfe0ff" position={[0, 5, 2]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
      </Environment>

      <Particles count={compact ? 350 : 700} />

      <GlassPanel position={[-4.2, 0.6, -1.5]} rotation={[0.1, 0.5, 0.05]} size={[1.6, 2.2]} speed={1.2} />
      <GlassPanel position={[4.6, -1.2, -2]} rotation={[-0.05, -0.55, 0.1]} size={[1.9, 1.3]} speed={1.5} />
      <GlassPanel position={[-1.2, 2.6, -2.5]} rotation={[0.2, 0.2, -0.1]} size={[1.2, 0.9]} speed={1} />

      <group position={compact ? [0, 0.3, 0] : [2.1, 0, 0]} scale={compact ? 0.72 : 1}>
        <group ref={group}>
          <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.8}>
            <mesh>
              <sphereGeometry args={[1.5, 64, 64]} />
              <MeshTransmissionMaterial
                transmission={1}
                thickness={0.9}
                roughness={0.06}
                ior={1.3}
                chromaticAberration={compact ? 0.02 : 0.06}
                anisotropicBlur={0.2}
                distortion={0.25}
                distortionScale={0.4}
                temporalDistortion={0.1}
                samples={compact ? 3 : 5}
                resolution={compact ? 256 : 512}
                color="#bcd4ff"
                backside={false}
              />
            </mesh>
            <mesh ref={core}>
              <icosahedronGeometry args={[0.45, 1]} />
              <meshStandardMaterial color="#3ce6ff" emissive="#3ce6ff" emissiveIntensity={2.2} wireframe />
            </mesh>
            <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
              <torusGeometry args={[2.05, 0.012, 12, 160]} />
              <meshBasicMaterial color="#9b8cff" />
            </mesh>
            <mesh ref={ringB} rotation={[Math.PI / 3, 0.6, 0]}>
              <torusGeometry args={[2.4, 0.008, 12, 160]} />
              <meshBasicMaterial color="#3ce6ff" transparent opacity={0.7} />
            </mesh>
          </Float>

          {LABELS.map((l) => (
            <Float key={l.text} speed={1.2} floatIntensity={0.6} rotationIntensity={0}>
              <Html position={l.pos} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
                <span className="glass whitespace-nowrap rounded-full px-3 py-1 font-mono text-[11px] text-white/85">{l.text}</span>
              </Html>
            </Float>
          ))}
        </group>
      </group>
    </>
  )
}

export default function HeroScene({ compact }: { compact: boolean }) {
  return (
    <SceneCanvas camera={{ position: [0, 0, 7], fov: 45 }}>
      <Stage compact={compact} />
    </SceneCanvas>
  )
}
