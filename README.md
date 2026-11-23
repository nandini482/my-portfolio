# Nandini Mishra — 3D Developer Portfolio

React + Vite + TypeScript + Tailwind + Three.js (React Three Fiber) + Framer Motion + Lenis.

> **Status:** the full source is written, but it has **not been compiled or run yet** — the build environment it was
> authored in couldn't install npm packages. Expect to run the steps below once and fix any small type/dependency
> error that surfaces.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview
```

Needs Node 18+.

## Make it yours (everything is in `src/data/content.ts`)

Search the page or the file for `[square brackets]` — each one is an editable placeholder, highlighted in amber on the site.

- `CONTACT` — email, GitHub, LinkedIn, extra socials. Empty values render as clearly-marked "add your link" slots; nothing is invented. The contact form opens a `mailto:` once `CONTACT.email` is set.
- `SKILLS` — each skill's `status` is `known | learning | exploring`. The defaults are conservative guesses: **set each one to what is honestly true.** React/MERN are deliberately absent until verified.
- `JOURNEY` — add years, college name, your HackIndia role/outcome and the Cyber Suraksha details.
- `PROJECTS` — add GitHub/demo URLs and confirm your contribution (especially Nivora). Add a new object to the array for a new project; for a 3D preview, add a scene to `src/three/ProjectScene.tsx` (otherwise it uses the 2D fallback card).

## Structure

```
src/
  data/content.ts        all copy, skills, projects, journey, contact
  lib/                   env hooks (reduced motion, 3D capability), mouse, smooth scroll
  components/            Nav, Loader, Cursor, MouseGlow, Reveal, SplitText, TiltCard, Lazy3D, …
  sections/              Hero, About, TechUniverse, Projects, Journey, Beyond, Contact
  three/                 HeroScene, TechScene, ProjectScene, PlaygroundScene (all lazy-loaded)
```

## Performance, accessibility and fallbacks

- Every 3D scene is `React.lazy`-loaded and only renders while near the viewport (`SceneCanvas`).
- `Lazy3D` swaps in a 2D fallback when WebGL is missing, the device reports ≤2 GB RAM or ≤2 CPU cores, the visitor prefers reduced motion, or a scene throws.
- Custom cursor, mouse glow and tilt are desktop-pointer only. Touch devices get an intentional mobile layout (full-screen menu, sphere above the text, tap-to-select skills, no scroll-hijacking controls).
- Reduced motion: no smooth scrolling, instant reveals, static 2D fallbacks.
- Skills are also a keyboard-accessible button list; status is encoded by shape *and* colour.

## Honest-content rules built in

SeismoKavach AI is labelled a prototype/concept with an on-page note: stress points are illustrative, there are no live AI predictions and no deployed backend. Satellite/open-data and sensor integration appear only under "Future scope — not built yet".

## Deploy

Any static host works (Vercel, Netlify, GitHub Pages). Build command `npm run build`, output `dist`.
