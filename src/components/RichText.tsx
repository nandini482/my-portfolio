/** Renders text, highlighting any [bracketed placeholder] so it's obvious what still needs editing. */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g)
  return (
    <>
      {parts.map((part, i) =>
        /^\[[^\]]+\]$/.test(part) ? (
          <mark key={i} className="editable" title="Editable placeholder — see src/data/content.ts">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}
