import { Check } from 'lucide-react'
import { productIcon } from '@/components/sections/insurance/productIcons'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Tag, type TagTone } from '@/components/ui/Tag'
import type { InsuranceProduct } from '@/types/content'
import { cn } from '@/utils/cn'

/** One accent per hands-on product, so the two primary cards read as distinct. */
const accents: { tile: string; check: string; tag: TagTone }[] = [
  { tile: 'border-primary/25 bg-primary/10 text-primary-soft', check: 'text-primary-soft', tag: 'primary' },
  { tile: 'border-secondary/25 bg-secondary/10 text-secondary-soft', check: 'text-secondary-soft', tag: 'secondary' },
]

interface ProductCardProps {
  product: InsuranceProduct
  /** Position among the hands-on products: picks the accent colour. */
  accentIndex?: number
}

/**
 * One insurance application. Hands-on products get a full card with their
 * focus areas; products known at a basic level get a quieter card that says so.
 */
export function ProductCard({ product, accentIndex = 0 }: ProductCardProps) {
  const handsOn = product.levelTone === 'hands-on'
  const accent = accents[accentIndex % accents.length]

  return (
    <Card
      as="article"
      interactive={handsOn}
      className={cn('flex h-full flex-col', handsOn ? 'card-sheen p-7 sm:p-8' : 'p-6')}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden="true"
          className={cn(
            'flex shrink-0 items-center justify-center rounded-xl border',
            handsOn ? cn('size-12', accent.tile) : 'size-11 border-line bg-ink/4 text-muted',
          )}
        >
          <Icon name={productIcon(product.id)} size={handsOn ? 22 : 20} />
        </span>
        <Tag tone={handsOn ? accent.tag : 'neutral'}>{product.level}</Tag>
      </div>

      <h3 className={cn('font-bold tracking-tight text-ink', handsOn ? 'mt-6 text-xl' : 'mt-5 text-lg')}>
        {product.name}
      </h3>

      {handsOn ? (
        <ul className="mt-5 space-y-3">
          {product.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-[0.95rem] leading-snug text-muted">
              <Check aria-hidden="true" size={17} strokeWidth={2.25} className={cn('mt-0.5 shrink-0', accent.check)} />
              <span className="min-w-0">{point}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{product.points.join(' · ')}</p>
      )}
    </Card>
  )
}
