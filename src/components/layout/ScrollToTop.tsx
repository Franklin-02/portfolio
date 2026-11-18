import { ArrowUp } from 'lucide-react'
import { AnimatePresence, useScroll } from 'motion/react'
import * as m from 'motion/react-m'
import { useId } from 'react'
import { useScrollLockGap } from '@/components/layout/useScrollLockGap'
import { useScrolled } from '@/hooks/useScrolled'
import { EASE_OUT } from '@/utils/motion'
import { scrollToTop } from '@/utils/scroll'

/** Distance scrolled, in pixels, before the button appears. */
const SHOW_AFTER = 600

function handleClick() {
  scrollToTop()
  // The button disappears near the top of the page, so focus continues from the top section.
  const top = document.getElementById('home') ?? document.getElementById('main-content')
  top?.focus({ preventScroll: true })
}

/** Floating "Back to top" button. Its ring fills as the page is read. */
export function ScrollToTop() {
  const visible = useScrolled(SHOW_AFTER)
  // Keeps the button in place while a scroll lock (menu, dialog) has removed the page scrollbar.
  const lockGap = useScrollLockGap()

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          key="scroll-to-top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          style={{ marginRight: lockGap }}
          className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] lg:right-8 lg:bottom-[calc(2rem+env(safe-area-inset-bottom))]"
        >
          <button
            type="button"
            onClick={handleClick}
            aria-label="Back to top"
            className="group relative flex size-11 items-center justify-center rounded-full border border-line-strong bg-glass text-ink shadow-elevated backdrop-blur-xl transition-colors duration-200 hover:border-primary/50 hover:text-primary-soft lg:size-12"
          >
            <ProgressRing />
            <ArrowUp
              aria-hidden="true"
              size={18}
              strokeWidth={2}
              className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
            />
          </button>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}

/** Reading progress drawn over the button's border. Mounted only while the button is shown. */
function ProgressRing() {
  const gradientId = `scroll-progress-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const { scrollYProgress } = useScroll()

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 44 44"
      fill="none"
      className="pointer-events-none absolute -inset-px size-[calc(100%+2px)] -rotate-90"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>
      <m.circle
        cx="22"
        cy="22"
        r="21.25"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ pathLength: scrollYProgress }}
      />
    </svg>
  )
}
