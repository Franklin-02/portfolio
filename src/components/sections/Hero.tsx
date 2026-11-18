import '@/components/sections/hero/hero.css'

import { ArrowRight, Mail } from 'lucide-react'
import { useMotionValue, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import type { CSSProperties, PointerEvent } from 'react'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { Container } from '@/components/ui/Container'
import { ResumeButton } from '@/components/ui/ResumeButton'
import { SectionLink } from '@/components/ui/SectionLink'
import { hero, profile } from '@/data/profile'
import type { HeroAction } from '@/types/content'
import { cn } from '@/utils/cn'
import { EASE_OUT } from '@/utils/motion'
import { OrbitVisual } from '@/components/sections/hero/OrbitVisual'
import { StatsStrip } from '@/components/sections/hero/StatsStrip'

/**
 * Entrance on load: a short rise, staggered through `delay`. The last element
 * settles within 0.9s.
 *
 * The headline passes a barely-there starting opacity instead of 0 so the
 * browser counts it as painted on the first frame (it is the largest
 * contentful paint) while still easing in with everything else.
 */
function rise(delay: number, fromOpacity = 0) {
  return {
    initial: { opacity: fromOpacity, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: EASE_OUT, delay },
  }
}

/** Splits the greeting around the name so the name can be set in the primary text colour. */
function Greeting() {
  const [before, ...rest] = hero.greeting.split(profile.name)
  const hasName = rest.length > 0

  return (
    <m.p
      {...rise(0)}
      className="flex items-center gap-3 text-[0.6875rem] font-semibold tracking-[0.2em] text-primary-soft uppercase sm:text-xs"
    >
      <span aria-hidden="true" className="h-px w-7 shrink-0 bg-linear-to-r from-primary to-secondary sm:w-8" />
      <span>
        {before}
        {hasName ? <span className="text-ink">{profile.name}</span> : null}
        {rest.join(profile.name)}
      </span>
    </m.p>
  )
}

type ActionTier = 'primary' | 'secondary' | 'quiet'

interface HeroActionButtonProps {
  action: HeroAction
  tier: ActionTier
}

/** One call to action. The tier, not the content, decides how loud it is. */
function HeroActionButton({ action, tier }: HeroActionButtonProps) {
  const variant = tier === 'quiet' ? 'outline' : tier
  const size = tier === 'quiet' ? 'sm' : 'lg'
  // Quiet actions use the compact size but keep a 44px touch target.
  const layout = tier === 'quiet' ? 'min-h-11 grow sm:grow-0' : 'w-full sm:w-auto'

  if (action.kind === 'resume') {
    return <ResumeButton variant={variant} size={size} label={action.label} className={layout} />
  }

  if (!action.section) return null

  return (
    <SectionLink section={action.section} className={buttonClasses({ variant, size, className: cn('group', layout) })}>
      {tier === 'quiet' && action.section === 'contact' ? (
        <Mail aria-hidden="true" size={16} strokeWidth={2} className="max-sm:hidden" />
      ) : null}
      {action.label}
      {tier === 'primary' ? (
        <ArrowRight
          aria-hidden="true"
          size={18}
          strokeWidth={2.25}
          className="transition-transform duration-200 ease-out group-hover:translate-x-1"
        />
      ) : null}
    </SectionLink>
  )
}

/**
 * Hero — "Orbit".
 *
 * One professional at the centre, three disciplines revolving around it.
 * Desktop: copy on the left, the full orbital system on the right, figures
 * docked along the bottom of the first screen. Tablet and phone: copy first,
 * then a horizontal slice through the system, then the figures.
 */
export function Hero() {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const [primaryAction, secondaryAction, ...quietActions] = hero.actions
  const lastLine = hero.headline.length - 1

  /* The chips in the visual drift a few pixels with the mouse. Motion values
     update the transform directly, so moving the pointer never re-renders. */
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
  }

  function handlePointerLeave() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      tabIndex={-1}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate flex flex-col overflow-hidden bg-canvas outline-none lg:min-h-[min(100svh,70rem)]"
    >
      {/* Backdrop: ambient light and a faint grid, running up behind the navigation bar */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      </div>

      <Container className="hero-shell relative flex flex-1 flex-col pt-28 pb-14 lg:pt-36 lg:pb-10">
        <div className="grid flex-1 items-center gap-y-4 md:gap-y-2 lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] lg:gap-x-12 min-[90rem]:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] min-[90rem]:gap-x-8">
          {/* Copy */}
          <div className="@container min-w-0">
            <Greeting />

            {/* Sized from the column width, so the longest line always fills it without wrapping. */}
            <h1
              id="home-heading"
              className="mt-5 text-[length:clamp(1.5rem,8.5cqw,4.25rem)] leading-[1.06] font-extrabold tracking-[-0.035em] text-ink sm:mt-6"
            >
              {hero.headline.map((line, index) => (
                <m.span key={line.emphasis} {...rise(index * 0.05, 0.01)} className="block">
                  {line.lead}{' '}
                  <span
                    className="hero-emphasis animate-gradient-pan text-gradient"
                    style={
                      {
                        '--hero-pan': `${lastLine > 0 ? (index / lastLine) * 100 : 0}%`,
                        animationDelay: `${index * -3}s`,
                      } as CSSProperties
                    }
                  >
                    {line.emphasis}
                  </span>{' '}
                </m.span>
              ))}
            </h1>

            <m.p {...rise(0.16)} className="mt-6 font-display text-lg font-semibold text-ink sm:text-xl lg:mt-7">
              {hero.designation}
            </m.p>

            <m.p
              {...rise(0.21)}
              className="mt-3 max-w-[35rem] text-[0.95rem] leading-relaxed text-pretty text-muted sm:text-base lg:text-[1.0625rem]"
            >
              {hero.description}
            </m.p>

            <m.div {...rise(0.27)} className="mt-8 flex flex-col gap-3 lg:mt-9">
              <div className="flex flex-col gap-3 sm:flex-row">
                {primaryAction ? <HeroActionButton action={primaryAction} tier="primary" /> : null}
                {secondaryAction ? <HeroActionButton action={secondaryAction} tier="secondary" /> : null}
              </div>
              {quietActions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                  {quietActions.map((action) => (
                    <HeroActionButton key={action.id} action={action} tier="quiet" />
                  ))}
                </div>
              ) : null}
            </m.div>
          </div>

          {/* Visual: a slice through the system below the copy, the full system beside it on desktop */}
          <div
            aria-hidden="true"
            className="relative mx-auto aspect-[1.85/1] w-full max-w-[26rem] md:aspect-[2.6/1] md:max-w-[37.5rem] lg:mx-0 lg:aspect-auto lg:max-w-none lg:self-stretch"
          >
            <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 lg:w-[42vw] xl:w-[min(43vw,42rem)] min-[90rem]:left-[56%] 2xl:left-[62%]">
              <OrbitVisual pointerX={pointerX} pointerY={pointerY} />
            </div>
          </div>
        </div>

        <StatsStrip delay={0.36} className="mt-4 md:mt-2 lg:mt-12" />
      </Container>
    </section>
  )
}
