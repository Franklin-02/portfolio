import { ArrowUpRight, Mail } from 'lucide-react'
import { AnimatePresence, useIsPresent, type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import { useEffect, useRef } from 'react'
import { LinkedInIcon } from '@/components/ui/BrandIcons'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { ResumeButton } from '@/components/ui/ResumeButton'
import { SectionLink } from '@/components/ui/SectionLink'
import { navItems } from '@/data/navigation'
import { profile } from '@/data/profile'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { NavId } from '@/types/content'
import { cn } from '@/utils/cn'
import { buildMailtoUrl } from '@/utils/mailto'
import { EASE_OUT } from '@/utils/motion'

interface MobileMenuProps {
  /** DOM id referenced by the toggle button's aria-controls. */
  id: string
  open: boolean
  /** Navigation entry of the section currently being read, if any. */
  activeNav: NavId | null
  /** Closes the menu and returns focus to the toggle. */
  onDismiss: () => void
  /** Runs just before a link is followed. */
  onBeforeNavigate: () => void
  /** Runs after a link was followed. */
  onNavigate: () => void
}

/** From Tailwind's `md` breakpoint the sheet becomes a drawer on the right. */
const DRAWER_QUERY = '(min-width: 48rem)'

/** The sheet turns solid quickly, then its rows follow one after another. */
const panelVariants: Variants = {
  closed: (drawer: boolean) => ({
    opacity: 0,
    x: drawer ? 24 : 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  }),
  open: {
    opacity: 1,
    x: 0,
    transition: {
      opacity: { duration: 0.2, ease: 'easeOut' },
      x: { duration: 0.4, ease: EASE_OUT },
      staggerChildren: 0.03,
      delayChildren: 0.06,
    },
  },
}

const itemVariants: Variants = {
  closed: { opacity: 0, y: 10, transition: { duration: 0.15 } },
  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
}

const contactLink =
  'group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted transition-colors duration-200 hover:bg-ink/5 hover:text-ink'

/**
 * Navigation for layouts below the desktop breakpoint: a full-screen sheet on
 * phones and a drawer on the right from tablets up, over a dimmed backdrop.
 * The navigation bar stays above it, so the toggle button doubles as the close
 * button. Focus handling and the scroll lock live in `useMobileMenu`.
 *
 * The content lines up with the bar: its side padding follows the bar's
 * container, and `--chrome-gap` (set by the Navbar) is the width of the page
 * scrollbar that the scroll lock removed.
 */
export function MobileMenu({ id, open, activeNav, onDismiss, onBeforeNavigate, onNavigate }: MobileMenuProps) {
  return (
    <div id={id} className="xl:hidden">
      <AnimatePresence>
        {open ? <MenuBackdrop key="backdrop" onDismiss={onDismiss} /> : null}
        {open ? (
          <MenuPanel key="panel" activeNav={activeNav} onBeforeNavigate={onBeforeNavigate} onNavigate={onNavigate} />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function MenuBackdrop({ onDismiss }: Pick<MobileMenuProps, 'onDismiss'>) {
  const isPresent = useIsPresent()

  return (
    <m.div
      aria-hidden="true"
      onClick={onDismiss}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'fixed inset-0 z-0 touch-none bg-black/60 backdrop-blur-sm light:bg-ink/25',
        !isPresent && 'pointer-events-none',
      )}
    />
  )
}

function MenuPanel({
  activeNav,
  onBeforeNavigate,
  onNavigate,
}: Pick<MobileMenuProps, 'activeNav' | 'onBeforeNavigate' | 'onNavigate'>) {
  const panelRef = useRef<HTMLDivElement>(null)
  const isPresent = useIsPresent()
  const isDrawer = useMediaQuery(DRAWER_QUERY)

  // Focus moves into the menu as soon as it opens.
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus({ preventScroll: true })
  }, [])

  return (
    <m.div
      ref={panelRef}
      variants={panelVariants}
      custom={isDrawer}
      initial="closed"
      animate="open"
      exit="closed"
      className={cn(
        'fixed top-0 right-0 left-0 z-10 flex h-dvh flex-col bg-canvas pt-16 md:left-auto md:w-[calc(24rem+var(--chrome-gap,0px))] md:border-l md:border-line md:shadow-elevated lg:w-[calc(26rem+var(--chrome-gap,0px))] lg:pt-[4.5rem]',
        !isPresent && 'pointer-events-none',
      )}
    >
      {/* Ambient lighting, as on the page sections. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-glow-primary absolute -top-40 -right-40 size-[28rem]" />
        <div className="bg-glow-secondary absolute -bottom-48 -left-40 size-[28rem]" />
      </div>

      {/* On phones the logo sits in this bar-height strip; in the drawer this label does. */}
      <p
        aria-hidden="true"
        className="absolute top-0 left-8 hidden h-16 items-center text-xs font-semibold tracking-[0.18em] text-faint uppercase md:flex lg:left-10 lg:h-[4.5rem]"
      >
        Menu
      </p>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain border-t border-line">
        <div className="flex flex-1 flex-col pr-[var(--chrome-gap,0px)]">
          <nav aria-label="Primary" className="px-2 py-2 sm:px-5 lg:px-7 [@media(min-height:46rem)]:py-3">
            <ul className="flex flex-col gap-0.5">
              {navItems.map((item, index) => {
                const active = item.id === activeNav

                return (
                  <m.li key={item.id} variants={itemVariants}>
                    <SectionLink
                      section={item.id}
                      onClick={onBeforeNavigate}
                      onNavigate={onNavigate}
                      aria-current={active ? 'location' : undefined}
                      className={cn(
                        'group flex h-12 items-center gap-4 rounded-xl border px-3 transition-colors duration-200 [@media(min-height:46rem)]:h-[3.25rem]',
                        active
                          ? 'border-primary/20 bg-primary/10 text-ink'
                          : 'border-transparent text-muted hover:bg-ink/5 hover:text-ink',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'w-5 font-display text-[0.6875rem] font-bold tracking-[0.12em] tabular-nums transition-colors duration-200',
                          active ? 'text-primary-soft' : 'text-faint',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-[1.0625rem] font-semibold tracking-tight">{item.label}</span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'bg-brand-gradient ml-auto size-1.5 rounded-full transition duration-300',
                          active ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                        )}
                      />
                    </SectionLink>
                  </m.li>
                )
              })}
            </ul>
          </nav>

          {/* The divider is drawn edge to edge, across the scrollbar gap as well. */}
          <m.div
            variants={itemVariants}
            className="relative mt-auto px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] before:absolute before:top-0 before:right-[calc(var(--chrome-gap,0px)*-1)] before:left-0 before:h-px before:bg-line sm:px-8 lg:px-10 [@media(min-height:46rem)]:pt-5 [@media(min-height:46rem)]:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          >
            <ResumeButton className="w-full" />

            <ul className="-mx-3 mt-2">
              <li>
                <a href={buildMailtoUrl({ to: profile.email })} className={contactLink}>
                  <Mail aria-hidden="true" size={17} strokeWidth={1.75} className="shrink-0 text-primary-soft" />
                  <span className="sr-only">Email: </span>
                  <span className="min-w-0 truncate">{profile.email}</span>
                </a>
              </li>
              <li>
                <ExternalLink href={profile.linkedin.url} className={contactLink}>
                  <LinkedInIcon size={16} className="shrink-0 text-primary-soft" />
                  <span className="sr-only">LinkedIn: </span>
                  <span className="min-w-0 truncate">{profile.linkedin.label}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    size={15}
                    strokeWidth={1.75}
                    className="ml-auto shrink-0 text-faint transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                  />
                </ExternalLink>
              </li>
            </ul>
          </m.div>
        </div>
      </div>
    </m.div>
  )
}
