import { areaAccents } from '@/components/sections/delivery/accents'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import type { DeliveryArea } from '@/types/content'
import { cn } from '@/utils/cn'

interface AreaCardsProps {
  areas: DeliveryArea[]
}

/**
 * The areas of responsibility, one card each: icon, title and the list of
 * items with fine markers.
 *
 * From `lg` the cards sit side by side and share their rows (CSS subgrid), so
 * the lists start on the same line however the titles wrap. Below that each
 * card takes the full width and its list runs in two columns where it fits.
 */
export function AreaCards({ areas }: AreaCardsProps) {
  return (
    <RevealGroup className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3">
      {areas.map((area, index) => {
        const accent = areaAccents[index % areaAccents.length]
        const titleId = `delivery-area-${area.id}`

        return (
          <RevealItem key={area.id} className="lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-y-0">
            {/* The hover lift is written out here (not `interactive`) so each card keeps its own accent border. */}
            <Card
              as="article"
              aria-labelledby={titleId}
              className={cn(
                'group overflow-hidden transition duration-300 ease-out hover:-translate-y-1 hover:shadow-elevated',
                'lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-y-0',
                accent.hover,
              )}
            >
              <span
                aria-hidden="true"
                className={cn('absolute inset-x-0 top-0 h-px bg-linear-to-r to-transparent', accent.rule)}
              />
              <span
                aria-hidden="true"
                className={cn('pointer-events-none absolute -top-28 -right-28 size-64', accent.glow)}
              />

              {/* Icon beside the title, except in the narrow three-column cards between `lg` and `xl`. */}
              <div className="relative flex items-center gap-4 px-6 pt-6 pb-5 sm:px-7 sm:pt-7 lg:flex-col lg:items-start lg:gap-5 xl:flex-row xl:items-center xl:gap-4 xl:px-8 xl:pt-8 xl:pb-6">
                <span
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-xl border transition duration-300 group-hover:scale-105',
                    accent.tile,
                  )}
                >
                  <Icon name={area.icon} size={22} />
                </span>
                <h3
                  id={titleId}
                  className="min-w-0 text-lg leading-snug font-bold tracking-tight text-balance break-words text-ink xl:text-xl"
                >
                  {area.title}
                </h3>
              </div>

              <ul
                role="list"
                className="relative grid content-start gap-x-8 px-6 pb-4 sm:grid-cols-2 sm:px-7 sm:pb-5 lg:grid-cols-1 xl:px-8 xl:pb-6"
              >
                {area.items.map((item) => (
                  <li
                    key={item}
                    className="flex min-w-0 items-center gap-3 border-t border-line py-3 text-[0.95rem] leading-snug text-ink/90"
                  >
                    <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', accent.marker)} />
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </RevealItem>
        )
      })}
    </RevealGroup>
  )
}
