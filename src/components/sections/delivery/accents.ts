/**
 * One accent per area card (primary / secondary / highlight), so the three
 * areas read as distinct — the same idea as the capability cards in About.
 * Cards beyond the third reuse the accents in order.
 */
export interface AreaAccent {
  /** Icon tile: border, tint and icon colour. */
  tile: string
  /** Start colour of the hairline along the top edge of the card. */
  rule: string
  /** Border colour while the card is hovered. */
  hover: string
  /** Fill of the fine marker in front of each list item. */
  marker: string
  /** Soft light in the top corner of the card. */
  glow: string
}

export const areaAccents: readonly AreaAccent[] = [
  {
    tile: 'border-primary/25 bg-primary/10 text-primary-soft',
    rule: 'from-primary',
    hover: 'hover:border-primary/45',
    marker: 'bg-primary',
    glow: 'bg-[radial-gradient(closest-side,var(--glow-primary),transparent)]',
  },
  {
    tile: 'border-secondary/25 bg-secondary/10 text-secondary-soft',
    rule: 'from-secondary',
    hover: 'hover:border-secondary/45',
    marker: 'bg-secondary',
    glow: 'bg-[radial-gradient(closest-side,var(--glow-secondary),transparent)]',
  },
  {
    tile: 'border-highlight/25 bg-highlight/10 text-highlight',
    rule: 'from-highlight',
    hover: 'hover:border-highlight/45',
    marker: 'bg-highlight',
    glow: 'bg-[radial-gradient(closest-side,var(--glow-highlight),transparent)]',
  },
]
