/**
 * Generative artwork for the article series.
 *
 * The posts have no cover images, so every article gets an original abstract
 * mark instead: a route across a small lattice of dots, with one stop per
 * listed topic. The series walks through its subject one topic at a time, and
 * the route is that idea drawn as a picture.
 *
 * Nothing here knows which articles exist. The shape of the route, the form of
 * its stops and the accent colour are derived from the article's position in
 * the list, so an article added to `src/data/articles.ts` gets its own mark.
 */

export interface SeriesPalette {
  /** Colour of the route and its stops. */
  accent: string
  /** Second colour blended into the cover background. */
  blend: string
  /* Utilities in the same accent. They are written out in full so Tailwind can find them. */
  text: string
  tile: string
  hoverBorder: string
}

const PALETTES: readonly SeriesPalette[] = [
  {
    accent: 'var(--primary)',
    blend: 'var(--secondary)',
    text: 'text-primary-soft',
    tile: 'border-primary/25 bg-primary/10 text-primary-soft',
    hoverBorder: 'hover:border-primary/45',
  },
  {
    accent: 'var(--secondary)',
    blend: 'var(--highlight)',
    text: 'text-secondary-soft',
    tile: 'border-secondary/25 bg-secondary/10 text-secondary-soft',
    hoverBorder: 'hover:border-secondary/45',
  },
  {
    accent: 'var(--highlight)',
    blend: 'var(--primary)',
    text: 'text-highlight',
    tile: 'border-highlight/25 bg-highlight/10 text-highlight',
    hoverBorder: 'hover:border-highlight/45',
  },
]

/** Accent colours for the article at `index`, shared by its mark and its card. */
export function seriesPalette(index: number): SeriesPalette {
  return PALETTES[index % PALETTES.length]
}

const STOP_SHAPES = ['circle', 'diamond', 'square'] as const
export type StopShape = (typeof STOP_SHAPES)[number]

export interface RoutePoint {
  x: number
  y: number
}

export interface SeriesRoute {
  /** Every point of the lattice the route is drawn on. */
  lattice: RoutePoint[]
  /** The stops, in order. There is one per topic, limited to what the lattice can hold. */
  stops: RoutePoint[]
  /** Path through every stop except for the last leg. Empty when the route has only two stops. */
  lead: string
  /** The last leg, kept apart so it can be drawn as still in progress. */
  finalLeg: string
  /** Form of the stops. */
  shape: StopShape
}

export interface RouteOptions {
  /** Position of the article in the list. */
  index: number
  /** Number of stops asked for: the article's topic count. */
  stops: number
  /** Lattice size. The lattice is centred on the origin. */
  cols: number
  rows: number
  /** Distance between neighbouring lattice points. */
  pitch: number
  /** Corner radius of the route. */
  radius: number
}

/** Small deterministic random number generator (mulberry32), so a mark never changes between renders. */
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

/**
 * One leg of the route: along the row, a rounded turn, up or down the jog
 * column, another rounded turn, then along the new row. Starts where the
 * previous leg ended.
 */
function legPath(from: RoutePoint, to: RoutePoint, jogX: number, radius: number): string {
  if (from.y === to.y) return `H${round(to.x)}`

  const direction = to.y > from.y ? 1 : -1
  const r = Math.max(0, Math.min(radius, Math.abs(to.y - from.y) / 2, jogX - from.x, to.x - jogX))

  return [
    `H${round(jogX - r)}`,
    `Q${round(jogX)} ${round(from.y)} ${round(jogX)} ${round(from.y + direction * r)}`,
    `V${round(to.y - direction * r)}`,
    `Q${round(jogX)} ${round(to.y)} ${round(jogX + r)} ${round(to.y)}`,
    `H${round(to.x)}`,
  ].join('')
}

/** Rows for the stops: neighbours never share a row, and the route uses most of the lattice height. */
function pickRows(random: () => number, count: number, rows: number): number[] {
  const wantedSpread = Math.min(rows - 1, Math.max(1, Math.ceil((rows - 1) * 0.75)))
  let best: number[] = []
  let bestSpread = -1

  for (let attempt = 0; attempt < 12; attempt++) {
    const picked: number[] = []
    for (let stop = 0; stop < count; stop++) {
      const previous = picked[stop - 1]
      let row = Math.floor(random() * rows)
      if (row === previous) row = (row + 1 + Math.floor(random() * (rows - 1))) % rows
      picked.push(row)
    }

    const spread = Math.max(...picked) - Math.min(...picked)
    if (spread > bestSpread) {
      best = picked
      bestSpread = spread
    }
    if (spread >= wantedSpread) break
  }

  return best
}

/** Describes the route for the article at `index`. */
export function createRoute({ index, stops, cols, rows, pitch, radius }: RouteOptions): SeriesRoute {
  const random = createRandom((index + 1) * 0x9e3779b1)
  const count = Math.min(Math.max(Math.floor(stops), 2), cols)

  const toX = (col: number) => (col - (cols - 1) / 2) * pitch
  const toY = (row: number) => (row - (rows - 1) / 2) * pitch

  const stopCols = Array.from({ length: count }, (_, stop) => Math.round((stop * (cols - 1)) / (count - 1)))
  const stopRows = rows > 1 ? pickRows(random, count, rows) : stopCols.map(() => 0)
  const points: RoutePoint[] = stopCols.map((col, stop) => ({ x: round(toX(col)), y: round(toY(stopRows[stop])) }))

  const legs = points.slice(0, -1).map((from, leg) => {
    const fromCol = stopCols[leg]
    const gap = stopCols[leg + 1] - fromCol
    // Turn on a lattice column when there is one between the stops, otherwise halfway.
    const jogCol = gap >= 2 ? fromCol + 1 + Math.floor(random() * (gap - 1)) : fromCol + gap / 2
    return legPath(from, points[leg + 1], toX(jogCol), radius)
  })

  const start = (point: RoutePoint) => `M${point.x} ${point.y}`
  const lastLeg = legs.length - 1

  const lattice: RoutePoint[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) lattice.push({ x: round(toX(col)), y: round(toY(row)) })
  }

  return {
    lattice,
    stops: points,
    lead: lastLeg > 0 ? start(points[0]) + legs.slice(0, lastLeg).join('') : '',
    finalLeg: start(points[lastLeg]) + legs[lastLeg],
    shape: STOP_SHAPES[index % STOP_SHAPES.length],
  }
}
