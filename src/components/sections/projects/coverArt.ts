/**
 * Generative cover art for the project cards.
 *
 * There are no screenshots to show, so every project gets an original abstract
 * emblem instead. Nothing here knows how many projects exist: the palette, the
 * ring shape, the background texture and the lighting are all derived from the
 * project's position in the list, and the emblem carries one node per listed
 * feature. A project added to `src/data/projects.ts` gets its own cover
 * automatically.
 */

const TAU = Math.PI * 2

/** Spreads the nodes around the emblem without a visible pattern. */
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

/** The emblem is drawn in a square viewBox of this size, centred in it. */
export const COVER_VIEWBOX = 320
const CENTER = COVER_VIEWBOX / 2

/** Ring radii, from the one around the icon tile to the one that bleeds off the cover. */
const RING_RADII = [52, 84, 116, 148, 182] as const

const MIN_NODES = 3
const MAX_NODES = 12

export interface CoverPalette {
  /** Colour of the glow, the highlighted arcs and the nodes. */
  accent: string
  /** Second colour blended into the background gradient. */
  blend: string
  /* Utilities in the same accent. They are written out in full so Tailwind can find them. */
  text: string
  bullet: string
  tile: string
  hoverBorder: string
  /** Start colour of the hairline along the top edge of a card. */
  rule: string
}

const PALETTES: readonly CoverPalette[] = [
  {
    accent: 'var(--primary)',
    blend: 'var(--secondary)',
    text: 'text-primary-soft',
    bullet: 'bg-primary',
    tile: 'border-primary/25 bg-primary/10 text-primary-soft',
    hoverBorder: 'hover:border-primary/45',
    rule: 'from-primary',
  },
  {
    accent: 'var(--secondary)',
    blend: 'var(--highlight)',
    text: 'text-secondary-soft',
    bullet: 'bg-secondary',
    tile: 'border-secondary/25 bg-secondary/10 text-secondary-soft',
    hoverBorder: 'hover:border-secondary/45',
    rule: 'from-secondary',
  },
  {
    accent: 'var(--highlight)',
    blend: 'var(--primary)',
    text: 'text-highlight',
    bullet: 'bg-highlight',
    tile: 'border-highlight/25 bg-highlight/10 text-highlight',
    hoverBorder: 'hover:border-highlight/45',
    rule: 'from-highlight',
  },
]

interface CoverShape {
  /** Number of sides; 0 draws circles. */
  sides: number
  /** Direction of the first corner, in radians. */
  rotation: number
  /** Evens out the optical size of the different shapes. */
  scale: number
}

const SHAPES: readonly CoverShape[] = [
  { sides: 0, rotation: 0, scale: 1 },
  { sides: 4, rotation: -Math.PI / 2, scale: 1.2 },
  { sides: 6, rotation: -Math.PI / 2, scale: 1.08 },
  { sides: 4, rotation: -Math.PI / 4, scale: 1.26 },
  { sides: 8, rotation: -Math.PI / 8, scale: 1.04 },
]

const TEXTURES = ['dots', 'grid', 'hatch', 'rules'] as const
export type CoverTexture = (typeof TEXTURES)[number]

const NODE_KINDS = ['solid', 'hollow', 'blend'] as const

export interface CoverRing {
  /** Path data for the ring outline. */
  d: string
  dashed: boolean
  /** Highlighted stretch of the ring, as percentages of its length. */
  arc: { length: number; offset: number } | null
}

export interface CoverNode {
  x: number
  y: number
  kind: (typeof NODE_KINDS)[number]
}

export interface CoverArt {
  palette: CoverPalette
  texture: CoverTexture
  rings: CoverRing[]
  nodes: CoverNode[]
  /** Position of the background glow. */
  glowX: string
  glowY: string
  /** Direction of the background gradient. */
  angle: string
}

/** Accent colours for a project, shared by its cover, its card and its detail view. */
export function coverPalette(index: number): CoverPalette {
  return PALETTES[index % PALETTES.length]
}

/** Small deterministic random number generator (mulberry32), so a cover never changes between renders. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}

function ringPath(shape: CoverShape, radius: number): string {
  if (shape.sides === 0) {
    return `M${round(CENTER - radius)} ${CENTER}a${radius} ${radius} 0 1 1 ${round(radius * 2)} 0a${radius} ${radius} 0 1 1 ${round(-radius * 2)} 0Z`
  }

  const corners = Array.from({ length: shape.sides }, (_, corner) => {
    const angle = shape.rotation + (corner * TAU) / shape.sides
    return `${round(CENTER + radius * Math.cos(angle))} ${round(CENTER + radius * Math.sin(angle))}`
  })
  return `M${corners.join('L')}Z`
}

/** Distance from the centre to the ring outline in a given direction. */
function ringDistance(shape: CoverShape, radius: number, angle: number): number {
  if (shape.sides === 0) return radius

  const sector = TAU / shape.sides
  const turned = (((angle - shape.rotation) % sector) + sector) % sector
  return (radius * Math.cos(sector / 2)) / Math.cos(turned - sector / 2)
}

/**
 * Describes the cover for the project at `index`.
 * `featureCount` sets how many nodes sit on the rings.
 */
export function createCoverArt(index: number, featureCount: number): CoverArt {
  const random = createRandom((index + 1) * 0x9e3779b1)
  const shape = SHAPES[index % SHAPES.length]

  const rings: CoverRing[] = RING_RADII.map((radius, ringIndex) => ({
    d: ringPath(shape, round(radius * shape.scale)),
    dashed: (ringIndex + index) % 2 === 1,
    arc:
      ringIndex >= 1 && ringIndex <= 3
        ? { length: round(9 + random() * 13), offset: round(random() * 100) }
        : null,
  }))

  const nodeCount = Math.min(Math.max(featureCount, MIN_NODES), MAX_NODES)
  const firstAngle = random() * TAU
  const nodes: CoverNode[] = Array.from({ length: nodeCount }, (_, nodeIndex) => {
    const radius = RING_RADII[1 + (nodeIndex % 3)] * shape.scale
    const angle = firstAngle + nodeIndex * GOLDEN_ANGLE
    const distance = ringDistance(shape, radius, angle)
    return {
      x: round(CENTER + distance * Math.cos(angle)),
      y: round(CENTER + distance * Math.sin(angle)),
      kind: NODE_KINDS[nodeIndex % NODE_KINDS.length],
    }
  })

  const glowAngle = 0.9 + index * GOLDEN_ANGLE

  return {
    palette: coverPalette(index),
    texture: TEXTURES[index % TEXTURES.length],
    rings,
    nodes,
    glowX: `${Math.round(68 + 26 * Math.cos(glowAngle))}%`,
    glowY: `${Math.round(50 + 64 * Math.sin(glowAngle))}%`,
    angle: `${(135 + index * 47) % 360}deg`,
  }
}
