import { useMemo } from 'react'
import { RouteStop } from '@/components/sections/articles/RouteStop'
import { createRoute, seriesPalette } from '@/components/sections/articles/seriesArt'
import { cn } from '@/utils/cn'

/** The tile is drawn in a square viewBox of this size, centred on the origin. */
const VIEWBOX = 56

const LATTICE = { cols: 4, rows: 4, pitch: 11, radius: 4 }

interface ArticleGlyphProps {
  /** Position of the article in the list: selects the route, the stop shape and the accent. */
  index: number
  /** Number of topics the article lists: one stop each, up to the width of the lattice. */
  topicCount: number
  className?: string
}

/**
 * Small original mark for an article card: the article's route (see
 * seriesArt.ts) on a tinted tile, in the accent chosen for its position in the
 * series. Decorative, so it is hidden from assistive technology.
 */
export function ArticleGlyph({ index, topicCount, className }: ArticleGlyphProps) {
  const route = useMemo(() => createRoute({ index, stops: topicCount, ...LATTICE }), [index, topicCount])
  const lastStop = route.stops.length - 1

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-14 shrink-0 items-center justify-center rounded-xl border transition duration-300 group-hover:scale-105',
        seriesPalette(index).tile,
        className,
      )}
    >
      <svg
        viewBox={`${-VIEWBOX / 2} ${-VIEWBOX / 2} ${VIEWBOX} ${VIEWBOX}`}
        fill="none"
        focusable="false"
        className="size-full"
      >
        {route.lattice.map((point) => (
          <circle key={`${point.x} ${point.y}`} cx={point.x} cy={point.y} r={0.85} fill="currentColor" opacity={0.32} />
        ))}

        <path
          d={route.lead + route.finalLeg}
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {route.stops.map((stop, stopIndex) => {
          // The route is generated once per article and never reordered, so the position is a stable key.
          if (stopIndex === lastStop) {
            return (
              <g key={stopIndex}>
                <circle cx={stop.x} cy={stop.y} r={5.4} fill="currentColor" opacity={0.22} />
                <RouteStop shape={route.shape} x={stop.x} y={stop.y} size={2.7} fill="currentColor" />
              </g>
            )
          }

          return stopIndex === 0 ? (
            <RouteStop
              key={stopIndex}
              shape={route.shape}
              x={stop.x}
              y={stop.y}
              size={2.4}
              fill="var(--card)"
              stroke="currentColor"
              strokeWidth={1.4}
            />
          ) : (
            <RouteStop key={stopIndex} shape={route.shape} x={stop.x} y={stop.y} size={2.1} fill="currentColor" />
          )
        })}
      </svg>
    </span>
  )
}
