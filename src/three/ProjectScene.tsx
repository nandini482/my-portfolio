import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Edges, Float } from '@react-three/drei'
import * as THREE from 'three'
import SceneCanvas from '../components/SceneCanvas'
import { mouse } from '../lib/mouse'

type Mode = '3d' | '2d'

/* ───────────── SeismoKavach AI — illustrative 3D building concept ───────────── */

const FLOORS = 9
const FLOOR_H = 0.46
const CAM_3D = new THREE.Vector3(5.4, 3.6, 6.4)
const CAM_2D = new THREE.Vector3(0, 8, 0.01)

// Illustrative stress points only — not real analysis.
const STRESS: { floor: number; pos: [number, number] }[] = [
  { floor: 1, pos: [-1.0, 0.83] },
  { floor: 4, pos: [1.12, 0.3] },
  { floor: 6, pos: [-1.0, -0.83] },
  { floor: 2, pos: [1.0, -0.83] },
]

function StressPoint({ floor, pos, mode, visible }: { floor: number; pos: [number, number]; mode: Mode; visible: boolean }) {
  const core = useRef<THREE.Mesh>(null)
  const halo = useRef<THREE.Mesh>(null)
  const heat = useRef<THREE.Mesh>(null)
  const y = floor * FLOOR_H + FLOOR_H / 2
  useFrame((s) => {
    const k = 1 + 0.28 * Math.sin(s.clock.elapsedTime * 3 + floor)
    core.current?.scale.setScalar(k)
    halo.current?.scale.setScalar(k * 1.8)
    const mat = heat.current?.material as THREE.MeshBasicMaterial | undefined
    if (mat) mat.opacity = THREE.MathUtils.damp(mat.opacity, mode === '2d' && visible ? 0.4 : 0, 4, 0.016)
  })
  return (
    <>
      <group position={[pos[0], y, pos[1]]} visible={visible}>
        <mesh ref={core}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ff6b5a" />
        </mesh>
        <mesh ref={halo}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ff6b5a" transparent opacity={0.22} depthWrite={false} />
        </mesh>
      </group>
      {/* Ground "projection" of the risk, visible in the 2D view */}
      <mesh ref={heat} rotation-x={-Math.PI / 2} position={[pos[0], 0.02, pos[1]]}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial color="#ff6b5a" transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  )
}

function Seismo({ mode, stress }: { mode: Mode; stress: boolean }) {
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)

  useFrame((s, dt) => {
    const r = root.current
    const b = body.current
    if (!r || !b) return
    const flat = mode === '2d'
    b.scale.y = THREE.MathUtils.damp(b.scale.y, flat ? 0.02 : 1, 4, dt)
    if (flat) {
      const turn = Math.PI * 2
      r.rotation.y = THREE.MathUtils.damp(r.rotation.y, Math.round(r.rotation.y / turn) * turn, 4, dt)
    } else {
      r.rotation.y += dt * 0.18 + mouse.x * dt * 0.3
    }
    s.camera.position.lerp(flat ? CAM_2D : CAM_3D, 0.06)
    s.camera.lookAt(0, flat ? 0 : 1.7, 0)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 6, 4]} intensity={60} color="#3ce6ff" />
      <pointLight position={[-5, 3, -3]} intensity={40} color="#9b8cff" />
      <gridHelper args={[14, 28, '#2f6bff', '#10204f']} />

      <group ref={root}>
        <group ref={body}>
          {Array.from({ length: FLOORS }).map((_, i) => (
            <mesh key={i} position={[0, i * FLOOR_H + FLOOR_H / 2, 0]}>
              <boxGeometry args={[2.2, FLOOR_H - 0.03, 1.6]} />
              <meshPhysicalMaterial color="#0f1e4a" transparent opacity={0.55} metalness={0.3} roughness={0.2} />
              <Edges color="#3ce6ff" threshold={15} />
            </mesh>
          ))}
          <mesh position={[0, FLOORS * FLOOR_H + 0.35, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
            <meshBasicMaterial color="#9b8cff" />
          </mesh>
          {STRESS.map((p) => (
            <StressPoint key={p.floor} floor={p.floor} pos={p.pos} mode={mode} visible={stress} />
          ))}
        </group>
      </group>
    </>
  )
}

/* ───────────── Nivora — handmade clay décor concept ───────────── */

const PROFILES: [number, number][][] = [
  [[0.001, 0], [0.5, 0], [0.56, 0.1], [0.78, 0.6], [0.7, 1.1], [0.32, 1.5], [0.28, 1.75], [0.4, 1.88]],
  [[0.001, 0], [0.42, 0], [0.48, 0.1], [0.55, 0.5], [0.4, 0.95], [0.34, 1.35], [0.4, 1.5]],
  [[0.001, 0], [0.45, 0], [0.5, 0.05], [0.72, 0.3], [0.72, 0.55], [0.5, 0.8], [0.46, 0.9]],
]

function Vase({ profile, color, position, scale = 1 }: { profile: [number, number][]; color: string; position: [number, number, number]; scale?: number }) {
  const pts = useMemo(() => profile.map(([x, y]) => new THREE.Vector2(x, y)), [profile])
  return (
    <Float speed={1.2} floatIntensity={0.25} rotationIntensity={0}>
      <mesh position={position} scale={scale}>
        <latheGeometry args={[pts, 56]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0} side={THREE.DoubleSide} />
      </mesh>
    </Float>
  )
}

function Nivora() {
  const root = useRef<THREE.Group>(null)
  useFrame((s, dt) => {
    const r = root.current
    if (r) {
      r.rotation.y += dt * 0.25
      r.rotation.x = THREE.MathUtils.damp(r.rotation.x, -mouse.y * 0.12, 3, dt)
    }
    s.camera.lookAt(0, 0.9, 0)
  })
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#ffd9bd" />
      <pointLight position={[-4, 2, -2]} intensity={40} color="#3ce6ff" />
      <pointLight position={[4, 1, -3]} intensity={25} color="#9b8cff" />
      <group ref={root}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[2.6, 2.8, 0.3, 64]} />
          <meshStandardMaterial color="#101a3a" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[2.62, 0.015, 8, 96]} />
          <meshBasicMaterial color="#3ce6ff" />
        </mesh>
        <Vase profile={PROFILES[0]} color="#c58b66" position={[-1.1, 0, 0.2]} />
        <Vase profile={PROFILES[1]} color="#e3b79e" position={[0.9, 0, 0.5]} scale={1.1} />
        <Vase profile={PROFILES[2]} color="#8f5f4a" position={[0.1, 0, -1.0]} scale={1.25} />
      </group>
    </>
  )
}

/* ───────────── Entry ───────────── */

interface Props {
  id: 'seismokavach' | 'nivora'
  mode: Mode
  stress: boolean
}

export default function ProjectScene({ id, mode, stress }: Props) {
  return (
    <SceneCanvas camera={id === 'seismokavach' ? { position: [5.4, 3.6, 6.4], fov: 40 } : { position: [0, 2.2, 6.6], fov: 40 }}>
      {id === 'seismokavach' ? <Seismo mode={mode} stress={stress} /> : <Nivora />}
    </SceneCanvas>
  )
}
