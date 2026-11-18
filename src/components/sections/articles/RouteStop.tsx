import type { SVGAttributes } from 'react'
import type { StopShape } from '@/components/sections/articles/seriesArt'

type Paint = Pick<
  SVGAttributes<SVGElement>,
  'fill' | 'fillOpacity' | 'stroke' | 'strokeWidth' | 'opacity' | 'className'
>

interface RouteStopProps extends Paint {
  shape: StopShape
  x: number
  y: number
  /** Half the width of the mark, before the optical correction for each shape. */
  size: number
}

/** One stop on an article's route, drawn in the shape chosen for that article. Use inside an <svg>. */
export function RouteStop({ shape, x, y, size, ...paint }: RouteStopProps) {
  if (shape === 'circle') return <circle cx={x} cy={y} r={size} {...paint} />

  // Squares and diamonds are drawn slightly smaller so all three shapes look the same size.
  const half = size * (shape === 'diamond' ? 0.84 : 0.88)

  return (
    <rect
      x={x - half}
      y={y - half}
      width={half * 2}
      height={half * 2}
      rx={half * 0.28}
      transform={shape === 'diamond' ? `rotate(45 ${x} ${y})` : undefined}
      {...paint}
    />
  )
}
