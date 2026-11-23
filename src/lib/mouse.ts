/**
 * Global, normalised pointer position (-1..1, y up). Read inside useFrame loops
 * so 3D scenes react to the mouse even when the canvas sits behind page content.
 */
export const mouse = { x: 0, y: 0 }

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true },
  )
}
