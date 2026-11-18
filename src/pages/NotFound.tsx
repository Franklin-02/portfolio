import { ArrowLeft, Mail } from 'lucide-react'
import * as m from 'motion/react-m'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { Container } from '@/components/ui/Container'
import { SectionLink } from '@/components/ui/SectionLink'
import { navItems } from '@/data/navigation'
import { profile } from '@/data/profile'
import { usePageMeta } from '@/hooks/usePageMeta'
import type { SectionId } from '@/types/content'
import { fadeUpItem, staggerContainer } from '@/utils/motion'

/** Sections offered as shortcuts, labelled as in the navigation bar. */
const shortcutIds = ['about', 'experience', 'projects'] as const satisfies readonly SectionId[]

const shortcuts = shortcutIds.map((id) => ({
  id,
  label: navItems.find((item) => item.id === id)?.label ?? id,
}))

/**
 * Abstract backdrop for the numerals: concentric orbits with a few markers,
 * two of which travel slowly along their orbit. The mask keeps only the band
 * beside the numerals, so nothing shows behind the navigation bar above or the
 * text below. Purely decorative.
 */
function Orbits() {
  return (
    <svg
      viewBox="0 0 800 800"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="absolute top-1/2 left-1/2 -z-10 size-[min(170vw,54rem)] max-w-none -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,#000_55%,transparent_100%),linear-gradient(to_bottom,transparent_30%,#000_38%,#000_47%,transparent_62%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
    >
      <circle cx="400" cy="400" r="150" stroke="var(--line-strong)" />
      <circle cx="400" cy="400" r="232" stroke="var(--line-strong)" strokeDasharray="2 10" strokeLinecap="round" />
      <circle cx="400" cy="400" r="314" stroke="var(--line-strong)" />
      <circle cx="400" cy="400" r="396" stroke="var(--line-strong)" />

      {/* Fixed markers on the third orbit, either side of the numerals */}
      <circle cx="89" cy="356" r="4" fill="var(--highlight)" />
      <circle cx="711" cy="356" r="5" stroke="var(--line-strong)" strokeWidth="1.5" />

      {/* Travelling markers: one on the dotted orbit, one that passes behind the numerals */}
      <g className="origin-center animate-spin-slow">
        <circle cx="171.5" cy="360" r="11" fill="var(--primary)" opacity="0.2" />
        <circle cx="171.5" cy="360" r="4.5" fill="var(--primary)" />
      </g>
      <g className="origin-center animate-spin-slow [animation-direction:reverse] [animation-duration:44s]">
        <circle cx="548" cy="374" r="9" fill="var(--secondary)" opacity="0.2" />
        <circle cx="548" cy="374" r="3.5" fill="var(--secondary)" />
      </g>
    </svg>
  )
}

/**
 * The 404 page. It is rendered inside the shared layout, so the padding at the
 * top clears the fixed navigation bar.
 */
export default function NotFound() {
  usePageMeta({
    title: `Page not found | ${profile.name}`,
    description: 'The page you were looking for could not be found.',
  })

  return (
    <section aria-labelledby="not-found-title" className="relative isolate overflow-hidden">
      {/* Ambient lighting, faded out towards the footer so the section has no hard lower edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]"
      >
        <div className="bg-aurora absolute inset-0" />
        <div className="bg-grid absolute inset-0" />
      </div>

      <Container>
        <m.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex min-h-[max(44rem,90dvh)] flex-col items-center justify-center pt-32 pb-20 text-center sm:pb-24"
        >
          <m.div variants={fadeUpItem} className="relative">
            <Orbits />
            <p
              aria-hidden="true"
              className="text-gradient font-display text-[length:clamp(8rem,30vw,15rem)] leading-[0.9] font-extrabold tracking-[-0.045em] select-none [mask-image:linear-gradient(to_bottom,#000_35%,transparent_108%)]"
            >
              404
            </p>
          </m.div>

          <m.div variants={fadeUpItem}>
            <p className="sr-only">Error 404</p>
            <h1
              id="not-found-title"
              className="mt-3 text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem]"
            >
              Page not found
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
              The page you are looking for does not exist or may have been moved, but the rest of the portfolio is
              right where it should be.
            </p>
          </m.div>

          <m.div variants={fadeUpItem} className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <a href={import.meta.env.BASE_URL} className={buttonClasses({ size: 'lg' })}>
              <ArrowLeft aria-hidden="true" focusable="false" size={17} strokeWidth={2} />
              Back to home
            </a>
            <SectionLink section="contact" className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
              <Mail aria-hidden="true" focusable="false" size={17} strokeWidth={2} />
              Contact me
            </SectionLink>
          </m.div>

          <m.nav variants={fadeUpItem} aria-label="Main sections" className="mt-12">
            <p className="text-xs font-semibold tracking-[0.18em] text-faint uppercase">Or go straight to</p>
            <ul className="mt-2 flex flex-wrap items-center justify-center">
              {shortcuts.map((shortcut, index) => (
                <li key={shortcut.id} className="flex items-center">
                  {index > 0 ? <span aria-hidden="true" className="h-3.5 w-px bg-line-strong" /> : null}
                  <SectionLink section={shortcut.id} className={buttonClasses({ variant: 'ghost', size: 'md' })}>
                    {shortcut.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </m.nav>
        </m.div>
      </Container>
    </section>
  )
}
