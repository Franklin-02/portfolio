import * as m from 'motion/react-m'
import { Card } from '@/components/ui/Card'
import { CountUp } from '@/components/ui/CountUp'
import { Icon } from '@/components/ui/Icon'
import { hero } from '@/data/profile'
import { cn } from '@/utils/cn'
import { EASE_OUT } from '@/utils/motion'

interface StatsStripProps {
  /** Seconds to wait before the strip joins the entrance sequence. */
  delay?: number
  className?: string
}

/**
 * The four headline figures from `hero.stats` as one glass strip: a 2x2 grid
 * on phones, a single row from tablets up. Numeric figures count up when they
 * scroll into view; the resume note stays next to them at every size.
 */
export function StatsStrip({ delay = 0, className }: StatsStripProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay }}
    >
      <Card glass className="card-sheen overflow-hidden">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {hero.stats.map((stat, index) => (
            <div
              key={stat.id}
              className={cn(
                'relative flex min-w-0 flex-col-reverse justify-end gap-2.5 border-line p-5 sm:p-6 xl:flex-row-reverse xl:items-center xl:gap-4 xl:px-7 xl:py-5',
                index % 2 === 1 && 'border-l',
                index >= 2 && 'border-t md:border-t-0',
                index === 2 && 'md:border-l',
              )}
            >
              <dt className="text-[0.8125rem] leading-snug text-pretty text-muted xl:max-w-[8.5rem] xl:text-sm">
                {/* The icon fills the free corner of the stacked cell; the desktop row is purely typographic. */}
                <Icon
                  name={stat.icon}
                  size={18}
                  className="absolute top-5 right-5 text-primary-soft/80 sm:top-6 sm:right-6 xl:hidden"
                />
                {stat.label}
              </dt>
              <dd className="font-display text-[1.75rem] leading-none font-extrabold tracking-tight text-ink min-[23.5rem]:text-[2rem] xl:text-[2.75rem]">
                {stat.value !== undefined ? (
                  <>
                    <CountUp value={stat.value} prefix={stat.prefix} />
                    {stat.suffix ? <span className="text-primary-soft">{stat.suffix}</span> : null}
                  </>
                ) : (
                  stat.text
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <p className="mt-3 text-xs text-faint">{hero.statsNote}</p>
    </m.div>
  )
}
