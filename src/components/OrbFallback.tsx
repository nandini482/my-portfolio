/** Pure-CSS stand-in for the hero sphere (low-power devices, no WebGL, reduced motion). */
const LABELS = ['Python', 'Java', 'AI / ML', 'Three.js', 'DSA', 'Cybersecurity']

export default function OrbFallback({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden="true">
      <div className="absolute h-[22rem] w-[22rem] rounded-full bg-electric/25 blur-[90px]" />
      <div className="absolute h-72 w-72 translate-x-10 translate-y-6 rounded-full bg-soft/20 blur-[80px]" />
      <div
        className="relative h-64 w-64 animate-float-slow rounded-full border border-white/20 sm:h-80 sm:w-80"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55), rgba(120,180,255,0.18) 28%, rgba(47,107,255,0.1) 55%, rgba(4,6,15,0.5) 100%)',
          boxShadow: 'inset 0 0 60px rgba(60,230,255,0.25), 0 0 80px rgba(47,107,255,0.35)',
        }}
      >
        <div className="absolute inset-6 rounded-full border border-aqua/30" />
        <div className="absolute inset-0 rounded-full border border-soft/20 [transform:rotateX(70deg)]" />
      </div>
      {LABELS.map((label, i) => (
        <span
          key={label}
          className="glass absolute animate-float rounded-full px-3 py-1 font-mono text-[11px] text-white/80"
          style={{
            top: `${14 + ((i * 29) % 70)}%`,
            left: `${i % 2 === 0 ? 8 + i * 4 : 62 - i * 2}%`,
            animationDelay: `${i * -1.3}s`,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  )
}
