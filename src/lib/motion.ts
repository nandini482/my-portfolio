export const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1]

const STOPS = ['#3ce6ff', '#2f6bff', '#9b8cff']

const parse = (hex: string): number[] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

/** Colour along the brand gradient (cyan → electric blue → soft violet) for letter i of n. */
export function gradientAt(i: number, n: number): string {
  const t = n <= 1 ? 0 : i / (n - 1)
  const seg = t * (STOPS.length - 1)
  const a = Math.min(Math.floor(seg), STOPS.length - 2)
  const f = seg - a
  const c1 = parse(STOPS[a])
  const c2 = parse(STOPS[a + 1])
  const mix = c1.map((v, k) => Math.round(v + (c2[k] - v) * f))
  return `rgb(${mix.join(',')})`
}
