/**
 * One accent per category, cycling through the three brand colours in the same
 * order as the capability cards of the About section. Class names are written
 * out in full so Tailwind can find them.
 */
export interface SkillAccent {
  /** Icon tile of the card. */
  tile: string
  /** Hairline along the top edge of the card. */
  rule: string
  /** Card border on hover and while the card is spotlighted. */
  card: string
  /** Soft light in the corner of the card. */
  glow: string
  /** Chip hover. */
  chip: string
  /** Fill colour (a CSS variable) for the category's button in the index. */
  fill: string
  /** Text and icon colour (a CSS variable) for the category's button in the index. */
  text: string
}

const accents: readonly SkillAccent[] = [
  {
    tile: 'border-primary/25 bg-primary/10 text-primary-soft',
    rule: 'from-primary',
    card: 'hover:border-primary/45 data-[state=active]:border-primary/55',
    glow: 'bg-glow-primary',
    chip: 'hover:border-primary/40 hover:bg-primary/10',
    fill: 'var(--primary)',
    text: 'var(--primary-soft)',
  },
  {
    tile: 'border-secondary/25 bg-secondary/10 text-secondary-soft',
    rule: 'from-secondary',
    card: 'hover:border-secondary/45 data-[state=active]:border-secondary/55',
    glow: 'bg-glow-secondary',
    chip: 'hover:border-secondary/40 hover:bg-secondary/10',
    fill: 'var(--secondary)',
    text: 'var(--secondary-soft)',
  },
  {
    tile: 'border-highlight/25 bg-highlight/10 text-highlight',
    rule: 'from-highlight',
    card: 'hover:border-highlight/45 data-[state=active]:border-highlight/55',
    glow: 'bg-[radial-gradient(closest-side,var(--glow-highlight),transparent)]',
    chip: 'hover:border-highlight/40 hover:bg-highlight/10',
    fill: 'var(--highlight)',
    text: 'var(--highlight)',
  },
]

/** The accent of the category at `index` in the list. */
export function skillAccent(index: number): SkillAccent {
  return accents[index % accents.length]
}
