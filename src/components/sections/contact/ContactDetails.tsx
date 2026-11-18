import { ArrowUpRight, UserRound } from 'lucide-react'
import * as m from 'motion/react-m'
import type { ReactNode } from 'react'
import { BreakableText } from '@/components/sections/contact/BreakableText'
import { LinkedInIcon } from '@/components/ui/BrandIcons'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { Icon } from '@/components/ui/Icon'
import { profile } from '@/data/profile'
import { cn } from '@/utils/cn'
import { buildMailtoUrl } from '@/utils/mailto'
import { fadeUpItem, staggerContainer, VIEWPORT_ONCE } from '@/utils/motion'

interface ContactDetail {
  id: string
  label: string
  value: ReactNode
  icon: ReactNode
  /** Makes the whole row a link. */
  href?: string
  /** Opens in a new tab. */
  external?: boolean
}

const details: ContactDetail[] = [
  {
    id: 'name',
    label: 'Name',
    value: profile.name,
    icon: <UserRound aria-hidden="true" focusable="false" size={19} strokeWidth={1.75} />,
  },
  {
    id: 'email',
    label: 'Email',
    value: <BreakableText text={profile.email} />,
    icon: <Icon name="mail" size={19} />,
    href: buildMailtoUrl({ to: profile.email }),
  },
  {
    id: 'phone',
    label: 'Phone',
    value: profile.phone.display,
    icon: <Icon name="phone" size={19} />,
    href: profile.phone.href,
  },
  {
    id: 'location',
    label: 'Location',
    value: profile.location,
    icon: <Icon name="map-pin" size={19} />,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: <BreakableText text={profile.linkedin.label} />,
    icon: <LinkedInIcon size={16} />,
    href: profile.linkedin.url,
    external: true,
  },
]

/** `h-full` keeps a row centred when its neighbour in the two-column layout wraps onto a second line. */
const rowClasses = 'flex h-full items-center gap-4 py-4'

function DetailContent({ detail, interactive }: { detail: ContactDetail; interactive: boolean }) {
  return (
    <>
      <span
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-card text-primary-soft transition duration-300',
          interactive && 'group-hover:border-primary/40 group-hover:bg-primary/10',
        )}
      >
        {detail.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.6875rem] font-semibold tracking-[0.18em] text-faint uppercase">
          {detail.label}
        </span>
        <span
          className={cn(
            'mt-1 block text-base leading-snug font-medium break-words text-ink transition duration-300',
            interactive && 'group-hover:text-primary-soft',
          )}
        >
          {detail.value}
        </span>
      </span>
      {interactive ? (
        <ArrowUpRight
          aria-hidden="true"
          focusable="false"
          size={20}
          strokeWidth={1.75}
          className="shrink-0 text-faint transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-soft"
        />
      ) : null}
    </>
  )
}

interface ContactDetailsProps {
  className?: string
}

/**
 * Name, email, phone, location and LinkedIn as a list of rows. Email, phone
 * and LinkedIn are links that cover the whole row. On tablets the rows sit in
 * two columns under the full-width name row.
 */
export function ContactDetails({ className }: ContactDetailsProps) {
  return (
    <address className={cn('not-italic', className)}>
      <m.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-1"
      >
        {details.map((detail) => {
          const linkClasses = cn(rowClasses, 'group rounded-lg')

          return (
            <m.li
              key={detail.id}
              variants={fadeUpItem}
              className={cn('border-b border-line', detail.id === 'name' && 'sm:col-span-2 lg:col-span-1')}
            >
              {detail.href && detail.external ? (
                <ExternalLink href={detail.href} className={linkClasses}>
                  <DetailContent detail={detail} interactive />
                </ExternalLink>
              ) : detail.href ? (
                <a href={detail.href} className={linkClasses}>
                  <DetailContent detail={detail} interactive />
                </a>
              ) : (
                <div className={rowClasses}>
                  <DetailContent detail={detail} interactive={false} />
                </div>
              )}
            </m.li>
          )
        })}
      </m.ul>
    </address>
  )
}
