import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import SceneCanvas from '../components/SceneCanvas'
import { CATEGORIES, SKILLS, STATUS_META, type Skill, type V3 } from '../data/content'

/** Place each skill on a loose ring around its category's centre. */
const POSITIONS: Record<string, V3> = (() => {
  const out: Record<string, V3> = {}
  for (const cat of CATEGORIES) {
    const items = SKILLS.filter((s) => s.category === cat.id)
    items.forEach((s, i) => {
      const a = (i / items.length) * Math.PI * 2 + 0.6
      out[s.id] = [cat.center[0] + Math.cos(a) * 1.35, cat.center[1] + Math.sin(a) * 1.0, cat.center[2] + Math.sin(i * 1.9) * 0.9]
    })
  }
  return out
})()

interface NodeProps {
  skill: Skill
  active: boolean
  dim: boolean
  onActive: (id: string | null) => void
}

function SkillNode({ skill, active, dim, onActive }: NodeProps) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const pos = POSITIONS[skill.id]
  const meta = STATUS_META[skill.status]
  const category = CATEGORIES.find((c) => c.id === skill.category)

  useFrame((s) => {
    const g = group.current
    const m = mesh.current
    if (!g || !m) return
    g.position.y = pos[1] + Math.sin(s.clock.elapsedTime * 0.9 + pos[0] * 2) * 0.09
    m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, active ? 1.8 : 1, 0.15))
    m.rotation.y += 0.01
  })

  return (
    <group ref={group} position={pos}>
      <mesh ref={mesh}>
        {/* Shape also encodes status so it isn't colour-only: sphere = know, octahedron = learning, wireframe = exploring */}
        {skill.status === 'known' ? (
          <sphereGeometry args={[0.17, 24, 24]} />
        ) : skill.status === 'learning' ? (
          <octahedronGeometry args={[0.24]} />
        ) : (
          <icosahedronGeometry args={[0.24, 1]} />
        )}
        <meshStandardMaterial
          color={meta.color}
          emissive={meta.color}
          emissiveIntensity={active ? 2.4 : 0.8}
          wireframe={skill.status === 'exploring'}
          roughness={0.3}
          metalness={0.2}
          transparent
          opacity={dim ? 0.3 : 1}
        />
      </mesh>

      {/* Larger invisible hit target */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          onActive(skill.id)
        }}
        onPointerOut={() => onActive(null)}
        onClick={(e) => {
          e.stopPropagation()
          onActive(skill.id)
        }}
      >
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html center position={[0, -0.48, 0]} distanceFactor={9} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        {active ? (
          <div className="w-44 rounded-xl border border-white/15 bg-ink/85 p-3 text-left backdrop-blur-xl">
            <div className="font-display text-sm font-semibold leading-tight text-white">{skill.name}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/50">{category?.label}</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: meta.color }}>
              <span aria-hidden="true">{meta.glyph}</span> {meta.label}
            </div>
          </div>
        ) : (
          <span className={`whitespace-nowrap rounded-full border border-white/10 bg-ink/60 px-2 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur ${dim ? 'opacity-40' : ''}`}>
            {skill.name}
          </span>
        )}
      </Html>
    </group>
  )
}

interface Props {
  activeId: string | null
  onActive: (id: string | null) => void
  interactive: boolean
}

function Constellation({ activeId, onActive, interactive }: Props) {
  const root = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    // Desktop uses OrbitControls auto-rotate; touch devices get a gentle idle spin instead.
    if (!interactive && root.current && !activeId) root.current.rotation.y += dt * 0.12
  })

  return (
    <group ref={root}>
      {CATEGORIES.map((c) => (
        <group key={c.id}>
          <mesh position={c.center}>
            <torusGeometry args={[0.28, 0.015, 8, 48]} />
            <meshBasicMaterial color={c.color} />
          </mesh>
          <Html center position={[c.center[0], c.center[1] + 0.55, c.center[2]]} zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
            <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: c.color }}>
              {c.label}
            </span>
          </Html>
          {SKILLS.filter((s) => s.category === c.id).map((s) => (
            <Line key={s.id} points={[c.center, POSITIONS[s.id]]} color={c.color} transparent opacity={0.28} lineWidth={1} />
          ))}
        </group>
      ))}
      {SKILLS.map((s) => (
        <SkillNode key={s.id} skill={s} active={activeId === s.id} dim={!!activeId && activeId !== s.id} onActive={onActive} />
      ))}
    </group>
  )
}

export default function TechScene(props: Props) {
  return (
    <SceneCanvas camera={{ position: [0, 0.5, props.interactive ? 11 : 14], fov: 50 }} onPointerMissed={() => props.onActive(null)}>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 6]} intensity={60} color="#9bd8ff" />
      <Constellation {...props} />
      {props.interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={!props.activeId}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.7}
        />
      )}
    </SceneCanvas>
  )
}
