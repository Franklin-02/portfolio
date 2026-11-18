import '@/components/sections/articles/articles.css'

import { useId, useMemo, type CSSProperties } from 'react'
import { RouteStop } from '@/components/sections/articles/RouteStop'
import { createRoute, type SeriesPalette } from '@/components/sections/articles/seriesArt'
import type { Article } from '@/types/content'
import { cn } from '@/utils/cn'

/** Lattice the cover route is drawn on. Odd sizes keep a lattice point on the centre. */
const LATTICE = { cols: 11, rows: 5, pitch: 24, radius: 9 }

/** Half the size of the square the dot lattice is painted in: larger than any cover. */
const FIELD = 720

/** Radius at which the dot lattice has faded out. */
const FADE_RADIUS = 210

/** Seed offset for the faint second route behind the main one. */
const ECHO_OFFSET = 53

interface ArticleCoverProps {
  article: Article
  /** Position of the article in the list: selects the shape of its route. */
  index: number
  palette: SeriesPalette
  seriesTitle: string
  /** Total number of posts planned for the series. */
  plannedCount: number
  className?: string
}

/**
 * Original abstract cover for the featured article, shown where a post image
 * would normally go. It is generated from the article itself: its number, and
 * a route with one stop per listed topic whose shape comes from the article's
 * position in the series (see seriesArt.ts). While the article is still the
 * current topic, the last leg of the route is drawn as in progress.
 *
 * Purely decorative, so it is hidden from assistive technology: everything it
 * shows is also stated in the text of the card.
 */
export function ArticleCover({ article, index, palette, seriesTitle, plannedCount, className }: ArticleCoverProps) {
  const id = `articles-cover-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const stopCount = article.topics.length

  const route = useMemo(() => createRoute({ index, stops: stopCount, ...LATTICE }), [index, stopCount])
  const echo = useMemo(
    () => createRoute({ index: index + ECHO_OFFSET, stops: Math.max(2, stopCount - 1), ...LATTICE }),
    [index, stopCount],
  )

  const inProgress = article.status === 'current'
  const lastStop = route.stops.length - 1
  const numberWidth = Math.max(2, article.number.length)

  const style = {
    '--articles-accent': palette.accent,
    '--articles-blend': palette.blend,
  } as CSSProperties

  return (
    <div aria-hidden="true" className={cn('articles-cover', className)} style={style}>
      <div className="articles-cover-art">
        <svg width="1" height="1" fill="none" focusable="false">
          <defs>
            <pattern
              id={`${id}-dots`}
              x={-LATTICE.pitch / 2}
              y={-LATTICE.pitch / 2}
              width={LATTICE.pitch}
              height={LATTICE.pitch}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={LATTICE.pitch / 2} cy={LATTICE.pitch / 2} r={1.15} fill="var(--articles-dot)" />
            </pattern>
            <radialGradient
              id={`${id}-fade`}
              gradientUnits="userSpaceOnUse"
              cx={0}
              cy={0}
              r={FADE_RADIUS}
              gradientTransform="scale(1.5 1)"
            >
              <stop offset={0.3} stopColor="white" />
              <stop offset={1} stopColor="white" stopOpacity={0} />
            </radialGradient>
            <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={-FIELD} y={-FIELD} width={FIELD * 2} height={FIELD * 2}>
              <rect x={-FIELD} y={-FIELD} width={FIELD * 2} height={FIELD * 2} fill={`url(#${id}-fade)`} />
            </mask>
          </defs>

          {/* Dot lattice, fading out around the route */}
          <rect
            x={-FIELD}
            y={-FIELD}
            width={FIELD * 2}
            height={FIELD * 2}
            fill={`url(#${id}-dots)`}
            mask={`url(#${id}-mask)`}
          />

          {/* A faint second route gives the lattice some depth */}
          <path
            d={echo.lead + echo.finalLeg}
            stroke="var(--articles-echo)"
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray="1.5 5"
          />

          {/* The route: solid up to the last stop that has been reached */}
          {route.lead ? (
            <path
              d={route.lead}
              stroke="var(--articles-accent)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          <path
            d={route.finalLeg}
            stroke="var(--articles-accent)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={inProgress ? '4 8' : undefined}
            className={inProgress ? 'animate-dash' : undefined}
          />

          {route.stops.map((stop, stopIndex) => {
            // The route is generated once per article and never reordered, so the position is a stable key.
            if (stopIndex === lastStop) {
              return (
                <g key={stopIndex}>
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r={12}
                    fill="var(--articles-accent)"
                    fillOpacity={0.2}
                    className={inProgress ? 'animate-pulse-soft' : undefined}
                  />
                  {inProgress ? (
                    <>
                      <RouteStop
                        shape={route.shape}
                        x={stop.x}
                        y={stop.y}
                        size={5.4}
                        fill="var(--articles-base)"
                        stroke="var(--articles-accent)"
                        strokeWidth={2}
                      />
                      <RouteStop shape={route.shape} x={stop.x} y={stop.y} size={1.8} fill="var(--articles-accent)" />
                    </>
                  ) : (
                    <RouteStop shape={route.shape} x={stop.x} y={stop.y} size={5.4} fill="var(--articles-accent)" />
                  )}
                </g>
              )
            }

            return stopIndex === 0 ? (
              <RouteStop
                key={stopIndex}
                shape={route.shape}
                x={stop.x}
                y={stop.y}
                size={4.6}
                fill="var(--articles-base)"
                stroke="var(--articles-accent)"
                strokeWidth={2}
              />
            ) : (
              <RouteStop key={stopIndex} shape={route.shape} x={stop.x} y={stop.y} size={4} fill="var(--articles-accent)" />
            )
          })}
        </svg>
      </div>

      <p className="articles-cover-head">
        <span className="articles-cover-series">{seriesTitle}</span>
        <span className="shrink-0 tabular-nums">
          {article.number} / {String(plannedCount).padStart(numberWidth, '0')}
        </span>
      </p>

      <span className="articles-cover-number font-display font-extrabold tabular-nums">{article.number}</span>
    </div>
  )
}
