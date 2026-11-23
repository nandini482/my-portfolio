/**
 * ───────────────────────────────────────────────────────────────
 *  ALL PERSONAL CONTENT LIVES HERE.
 *
 *  • Anything inside [square brackets] is an EDITABLE PLACEHOLDER and is
 *    highlighted on the page so you can't miss it. Replace it, then delete
 *    the brackets.
 *  • Empty link strings ('') render as clearly-marked "add your link" slots.
 *    Nothing here is an invented URL or contact detail.
 *  • Skill `status` values are conservative defaults — set each one to
 *    what is honestly true for you.
 * ───────────────────────────────────────────────────────────────
 */

export type Status = 'known' | 'learning' | 'exploring'
export type CategoryId = 'programming' | 'web' | 'ai' | 'core'
export type V3 = [number, number, number]

export const PROFILE = {
  name: 'Nandini Mishra',
  role: 'Computer Science Engineering Student',
  roles: ['Aspiring Software Developer', 'AI/ML Enthusiast'],
  availability: 'Available for opportunities',
  lookingFor: ['Software Development internships', 'AI/ML internships', 'Full-stack development', 'Building practical technology products'],
}

export const CONTACT = {
  /** e.g. 'you@example.com' — leave '' until you add yours. Enables the contact form's mailto. */
  email: '',
  github: '', // e.g. 'https://github.com/your-username'
  linkedin: '', // e.g. 'https://www.linkedin.com/in/your-handle'
  /** Extra socials: { label: 'X', href: 'https://…' } */
  socials: [] as { label: string; href: string }[],
}

/* ───────────── Tech universe ───────────── */

export const STATUS_META: Record<Status, { label: string; color: string; glyph: string; blurb: string }> = {
  known: { label: 'Know', color: '#3ce6ff', glyph: '●', blurb: 'Working knowledge — used in coursework or projects, still sharpening.' },
  learning: { label: 'Learning', color: '#4f86ff', glyph: '◆', blurb: 'Actively studying and practising.' },
  exploring: { label: 'Exploring', color: '#a89bff', glyph: '◇', blurb: 'Early experiments and curiosity.' },
}

export const CATEGORIES: { id: CategoryId; label: string; color: string; center: V3 }[] = [
  { id: 'programming', label: 'Programming', color: '#3ce6ff', center: [-3.3, 1.3, 0] },
  { id: 'web', label: 'Web Development', color: '#4f86ff', center: [3.3, 1.5, 0.5] },
  { id: 'ai', label: 'AI & Machine Learning', color: '#a89bff', center: [3.1, -1.9, -0.4] },
  { id: 'core', label: 'Core Computer Science', color: '#7fb4ff', center: [-3.1, -1.9, 0.5] },
]

export interface Skill {
  id: string
  name: string
  category: CategoryId
  status: Status
  note: string
}

// React / MERN are intentionally NOT listed — add them only once they're verified for you.
export const SKILLS: Skill[] = [
  { id: 'python', name: 'Python', category: 'programming', status: 'known', note: 'General-purpose programming and AI/ML groundwork.' },
  { id: 'java', name: 'Java', category: 'programming', status: 'known', note: 'Object-oriented programming and coursework.' },
  { id: 'html', name: 'HTML', category: 'web', status: 'known', note: 'Semantic page structure.' },
  { id: 'css', name: 'CSS', category: 'web', status: 'known', note: 'Layout, responsiveness and styling.' },
  { id: 'js', name: 'JavaScript', category: 'web', status: 'learning', note: 'Interactivity and front-end logic.' },
  { id: 'three', name: 'Three.js', category: 'web', status: 'learning', note: 'Used to build the SeismoKavach AI 3D prototype.' },
  { id: 'aitools', name: 'AI tools', category: 'ai', status: 'known', note: 'Using AI tools to learn, prototype and build faster.' },
  { id: 'genai', name: 'Generative AI', category: 'ai', status: 'exploring', note: 'Exploring what generative models can do.' },
  { id: 'ml', name: 'ML fundamentals', category: 'ai', status: 'learning', note: 'Core machine learning concepts.' },
  { id: 'prompt', name: 'Prompt Engineering', category: 'ai', status: 'exploring', note: 'Getting reliable results from language models.' },
  { id: 'dsa', name: 'Data Structures & Algorithms', category: 'core', status: 'learning', note: 'Problem solving fundamentals.' },
  { id: 'dbms', name: 'DBMS', category: 'core', status: 'learning', note: 'Databases and query fundamentals.' },
  { id: 'os', name: 'Operating Systems', category: 'core', status: 'learning', note: 'Processes, memory and scheduling concepts.' },
  { id: 'cn', name: 'Computer Networks', category: 'core', status: 'learning', note: 'How systems communicate.' },
  { id: 'cyber', name: 'Cybersecurity fundamentals', category: 'core', status: 'exploring', note: 'Security basics and threat awareness.' },
]

/* ───────────── About ───────────── */

export const ABOUT = {
  headline: 'Not just learning technology. Exploring what I can build with it.',
  paragraphs: [
    "I'm a Computer Science Engineering student drawn to the place where software engineering meets AI. I like taking a rough idea and turning it into something people can actually see, touch and use.",
    "Problem-solving is what keeps me going — whether that's visualising structural risk in a building or shaping the brand of a handmade product. I learn by building, and I'm looking for internships where I can contribute and keep growing.",
  ],
  pillars: [
    { title: 'Software Development', text: 'Clean, usable products — from interfaces to full-stack thinking.' },
    { title: 'AI & Emerging Tech', text: 'Curious about how intelligent systems can solve real problems.' },
    { title: 'Practical Problem Solving', text: 'Starting from a real-world need, then building towards it.' },
  ],
  now: [
    { key: 'Now', text: 'Studying core CS, building 3D and web prototypes, exploring AI.' },
    { key: 'Next', text: 'Software Development and AI/ML internships; deeper full-stack skills.' },
    { key: 'Always', text: 'Curious, experimenting, shipping ideas — and learning from each one.' },
  ],
}

/* ───────────── Projects ───────────── */

export interface Project {
  id: 'seismokavach' | 'nivora'
  index: string
  title: string
  tagline: string
  badge: string
  description: string
  disclaimer?: string
  problem: string
  solution: string
  features: string[]
  stack: string[]
  contribution: string[]
  future?: string[]
  github: string
  demo: string
  accent: string
}

export const PROJECTS: Project[] = [
  {
    id: 'seismokavach',
    index: '01',
    title: 'SeismoKavach AI',
    tagline: 'A 3D digital-twin concept for structural risk visualisation.',
    badge: 'Prototype · Concept',
    description:
      'An AI-powered 3D digital twin concept for structural risk visualisation and building-safety awareness, with a Three.js prototype of the 3D building and interface.',
    disclaimer:
      'Concept prototype. Stress points shown are illustrative — there are no live AI predictions and no deployed backend.',
    problem:
      'Structural risk in buildings is hard for non-experts to see and understand, which makes safety awareness difficult to build.',
    solution:
      'A visual concept that shows a building in 3D, highlights stress points, and projects 3D into 2D so risk can be read at a glance.',
    features: ['3D building visualisation', 'Structural stress-point highlighting', '3D-to-2D projection', 'Risk visualisation concept'],
    stack: ['Three.js', 'Frontend development', 'Interface design', '[Add the frameworks/tools you used]'],
    contribution: ['Concept development', 'Problem identification', 'Three.js-based 3D building prototype', 'Frontend implementation', 'Interface design'],
    future: ['Satellite / open-data integration', 'Sensor inputs', 'AI-assisted risk modelling'],
    github: '',
    demo: '',
    accent: '#3ce6ff',
  },
  {
    id: 'nivora',
    index: '02',
    title: 'Nivora',
    tagline: 'A handmade clay home-décor brand concept.',
    badge: 'Brand · Concept',
    description:
      'A creative brand concept for handmade clay home décor — from identity and product presentation to a digital storefront vision and customer experience.',
    problem: 'Handmade décor needs a brand and an online presence that communicate craft and warmth, not just a product catalogue.',
    solution: 'A cohesive brand identity with considered product presentation and a storefront vision built around the customer experience.',
    features: ['Brand identity', 'Product presentation', 'Digital storefront vision', 'Customer experience', 'Creative entrepreneurship'],
    stack: ['Brand design', 'Storefront concept', '[Add the tools you used]'],
    contribution: ['Brand concept and identity', 'Product presentation', 'Digital storefront vision', '[Confirm and add specifics of what you did]'],
    github: '',
    demo: '',
    accent: '#ff9d6b',
  },
]

/* ───────────── Journey ───────────── */

export interface JourneyItem {
  icon: 'grad' | 'book' | 'trophy' | 'building' | 'shield' | 'spark'
  tag: string
  when: string
  title: string
  text: string
}

export const JOURNEY: JourneyItem[] = [
  {
    icon: 'grad',
    tag: 'Education',
    when: '[Add year]',
    title: 'B.Tech — Computer Science Engineering',
    text: 'Began the CSE journey, building the foundations for a career in software and AI. [Add your college / university]',
  },
  {
    icon: 'book',
    tag: 'Academics',
    when: '[Add period]',
    title: 'Building the core',
    text: 'Developing strength in data structures, DBMS, operating systems, networks and security fundamentals.',
  },
  {
    icon: 'trophy',
    tag: 'Hackathon',
    when: '2026',
    title: 'HackIndia — AI & CyberTech Hackathon 2026',
    text: 'A milestone at the intersection of AI and cybersecurity. [Add your team, role and outcome]',
  },
  {
    icon: 'building',
    tag: 'Project',
    when: '[Add date]',
    title: 'SeismoKavach AI',
    text: 'Developed the concept and a Three.js 3D prototype for structural-risk visualisation.',
  },
  {
    icon: 'shield',
    tag: 'Opportunity',
    when: '[Add date]',
    title: 'Cyber Suraksha',
    text: '[Describe the Cyber Suraksha-related opportunity and your involvement]',
  },
  {
    icon: 'spark',
    tag: 'Ongoing',
    when: 'Now',
    title: 'Learning AI & software development',
    text: 'Exploring AI, strengthening full-stack skills and turning ideas into working prototypes.',
  },
]

/* ───────────── Playground ───────────── */

export const CODE_LINES = [
  '// beyond the screen',
  'const me = new Developer("Nandini");',
  'me.curiosity = Infinity;',
  '',
  'while (me.isLearning) {',
  '  build(idea).iterate();',
  '}',
  '',
  '// ideas → intelligent experiences',
]
