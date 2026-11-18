import type { Skill, SkillCategory } from '@/types/content'

/**
 * Bento layout for the skill cards.
 *
 * Nothing here depends on a card's position in the list. The rows, and the
 * width of every card inside its row, are worked out from the content: a
 * category with more (or longer) skills gets a wider card, so the cards that
 * share a row end up about the same height, and every row is filled from edge
 * to edge. Adding or removing a category or a skill simply produces a new
 * arrangement: there is never a ragged last row to fix by hand.
 */

/** The card grid has twelve columns from the `md` breakpoint (a single column below it). */
const COLUMNS = 12

interface RowRules {
  /** Most cards allowed side by side. */
  maxPerRow: number
  /** Narrowest card, in grid columns. `maxPerRow * minSpan` must not exceed COLUMNS. */
  minSpan: number
}

/** `md` up to `xl`: two cards per row. */
const MEDIUM: RowRules = { maxPerRow: 2, minSpan: 5 }

/** `xl` and wider: three cards per row. */
const WIDE: RowRules = { maxPerRow: 3, minSpan: 4 }

export interface BentoSpan {
  /** Columns (of twelve) the card spans from the `md` breakpoint. */
  medium: number
  /** Columns (of twelve) the card spans from the `xl` breakpoint. */
  wide: number
}

/** Approximate width of one chip in pixels: its lettering, its padding and the gap to the next chip. */
function chipWidth(skill: Skill): number {
  const characters = skill.name.length + (skill.note ? skill.note.length + 2 : 0)
  return characters * 7 + 30
}

/** How much room the chips of a category need: the basis for the width of its card. */
function categoryWeight(category: SkillCategory): number {
  return Math.max(
    1,
    category.skills.reduce((total, skill) => total + chipWidth(skill), 0),
  )
}

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0)

/**
 * Shares the grid columns between the cards of one row in proportion to their
 * weight. Spans are whole columns, never below `minSpan`, and always add up to
 * the full width of the grid.
 */
function shareColumns(weights: readonly number[], minSpan: number): number[] {
  const total = sum(weights)
  const ideal = weights.map((weight) => (weight / total) * COLUMNS)
  const spans = ideal.map((value) => Math.max(minSpan, Math.floor(value)))
  let used = sum(spans)

  // Columns left over go to the cards furthest below their ideal width.
  while (used < COLUMNS) {
    let pick = 0
    for (let index = 1; index < spans.length; index++) {
      if (ideal[index] - spans[index] > ideal[pick] - spans[pick]) pick = index
    }
    spans[pick] += 1
    used += 1
  }

  // The minimum width can push a row over: take columns back from the cards furthest above their ideal width.
  while (used > COLUMNS) {
    let pick = -1
    for (let index = 0; index < spans.length; index++) {
      if (spans[index] <= minSpan) continue
      if (pick === -1 || spans[index] - ideal[index] > spans[pick] - ideal[pick]) pick = index
    }
    if (pick === -1) break
    spans[pick] -= 1
    used -= 1
  }

  return spans
}

/**
 * Empty space a row would leave inside its cards. A card's chips need about
 * `weight / span` lines; the fullest card sets the height of the row, and every
 * other card is left with the difference.
 */
function rowWaste(weights: readonly number[], spans: readonly number[]): number {
  const density = weights.map((weight, index) => weight / spans[index])
  const fullest = Math.max(...density)
  return sum(density.map((value, index) => (fullest - value) * spans[index]))
}

/** Every way to split `count` cards, in order, into `rows` rows of 1 to `maxPerRow` cards. */
function rowSizes(count: number, rows: number, maxPerRow: number): number[][] {
  if (rows === 1) return count >= 1 && count <= maxPerRow ? [[count]] : []

  const options: number[][] = []
  const largestFirst = Math.min(maxPerRow, count - (rows - 1))
  for (let first = 1; first <= largestFirst; first++) {
    for (const rest of rowSizes(count - first, rows - 1, maxPerRow)) options.push([first, ...rest])
  }
  return options
}

/**
 * Arranges the cards in as few rows as the rules allow, then picks the split
 * that wastes the least space. A card alone on a row is avoided when another
 * split is possible, and rows of similar weight win a tie.
 */
function arrange(weights: readonly number[], rules: RowRules): number[] {
  const count = weights.length
  if (count === 0) return []

  const rows = Math.ceil(count / rules.maxPerRow)
  const loneCardPenalty = sum(weights) / count / 2

  let best: number[] = []
  let bestCost = Number.POSITIVE_INFINITY

  for (const sizes of rowSizes(count, rows, rules.maxPerRow)) {
    const spans: number[] = []
    let cost = 0
    let start = 0

    for (const size of sizes) {
      const rowWeights = weights.slice(start, start + size)
      const rowSpans = shareColumns(rowWeights, rules.minSpan)
      spans.push(...rowSpans)
      cost += rowWaste(rowWeights, rowSpans)
      if (size === 1 && count > 1) cost += loneCardPenalty
      cost += sum(rowWeights) ** 2 * 1e-9
      start += size
    }

    if (cost < bestCost) {
      best = spans
      bestCost = cost
    }
  }

  return best
}

/** The column span of every category card, in the order of `categories`. */
export function bentoSpans(categories: readonly SkillCategory[]): BentoSpan[] {
  const weights = categories.map(categoryWeight)
  const medium = arrange(weights, MEDIUM)
  const wide = arrange(weights, WIDE)

  return categories.map((_, index) => ({ medium: medium[index], wide: wide[index] }))
}

/** Most buttons the category index puts in one row from the `lg` breakpoint. */
const INDEX_MAX_PER_ROW = 8

/**
 * Grid of the category index from the `lg` breakpoint: equal cells in as few
 * rows as possible. When the buttons do not fill the last row, the first
 * button ("All categories") takes the spare cells, so the grid is always a
 * complete rectangle.
 */
export function indexGrid(buttonCount: number): { columns: number; leadSpan: number } {
  const rows = Math.max(1, Math.ceil(buttonCount / INDEX_MAX_PER_ROW))
  const columns = Math.max(1, Math.ceil(buttonCount / rows))
  return { columns, leadSpan: rows * columns - buttonCount + 1 }
}
