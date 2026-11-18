import type { CSSProperties } from 'react'
import { MenuToggle } from '@/components/layout/MenuToggle'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useMobileMenu } from '@/components/layout/useMobileMenu'
import { useScrollLockGap } from '@/components/layout/useScrollLockGap'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { ResumeButton } from '@/components/ui/ResumeButton'
import { SectionLink } from '@/components/ui/SectionLink'
import { navItems, pageSections } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrolled } from '@/hooks/useScrolled'
import type { NavId, SectionId } from '@/types/content'
import { cn } from '@/utils/cn'

/** Section ids in page order. Built once so the array stays stable for useActiveSection. */
const sectionIds: readonly SectionId[] = pageSections.map((section) => section.id)

/** The navigation entry each section highlights (several sections share one entry). */
const navBySection = new Map<SectionId, NavId>(pageSections.map((section) => [section.id, section.nav]))

const MENU_ID = 'site-menu'

/** Invisible ::after that grows a 36px-tall control's hit area to 44px (the element must be `relative`). */
const hitArea = 'after:absolute after:inset-x-0 after:-inset-y-1'

/**
 * Fixed navigation bar. Transparent over the hero, glass once the page scrolls.
 * The full link row is shown from the `xl` breakpoint; below it the links move
 * into the hamburger menu.
 */
export function Navbar() {
  const scrolled = useScrolled()
  const activeSection = useActiveSection(sectionIds)
  const activeNav = (activeSection ? navBySection.get(activeSection) : null) ?? null
  const { open, scopeRef, toggleRef, toggle, dismiss, beforeNavigate, afterNavigate } = useMobileMenu(MENU_ID)
  const lockGap = useScrollLockGap()

  // While the menu is open its own sheet sits behind the bar, so the glass is not needed.
  const glass = scrolled && !open

  // A scroll lock (this menu, or a dialog elsewhere) removes the page scrollbar. Padding
  // the bar by its width keeps the bar's content, and the menu that reads the same
  // variable, exactly where it was.
  const chromeGap = { '--chrome-gap': `${lockGap}px` } as CSSProperties

  return (
    <header ref={scopeRef} style={chromeGap} className="fixed inset-x-0 top-0 z-50 pr-(--chrome-gap)">
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 border-b border-line bg-glass shadow-card backdrop-blur-xl transition-opacity duration-300',
          glass ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        {/* A hint of the brand colours along the bar's lower edge. */}
        <div className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      {/* Only the controls take pointer events, so a click on the empty bar reaches what is behind it. */}
      <Container className="pointer-events-none relative z-20 flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <SectionLink
          section="home"
          onClick={beforeNavigate}
          onNavigate={afterNavigate}
          className="pointer-events-auto -my-1 shrink-0 rounded-lg py-1 transition-opacity duration-200 hover:opacity-85 max-[339px]:[&>span:first-child>span:last-child]:sr-only"
        >
          <Logo />
          {/* Added to the visible name and role, so the link's accessible name still matches what is shown. */}
          <span className="sr-only">, home</span>
        </SectionLink>

        <nav aria-label="Primary" className="pointer-events-auto hidden xl:block">
          <ul className="flex items-center">
            {navItems.map((item) => {
              const active = item.id === activeNav

              return (
                <li key={item.id}>
                  <SectionLink
                    section={item.id}
                    aria-current={active ? 'location' : undefined}
                    className={cn(
                      'group relative flex h-9 items-center rounded-lg px-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200',
                      hitArea,
                      active ? 'text-ink' : 'text-muted hover:text-ink',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg bg-ink/6 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                    <span className="relative">{item.label}</span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-linear-to-r from-primary to-secondary transition duration-300 ease-out',
                        active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0',
                      )}
                    />
                  </SectionLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1 xl:gap-2.5">
          {/* Compact layouts: the resume button stays in the bar from tablets up, and is always in the menu. */}
          <div
            className={cn(
              'pointer-events-auto mr-2 hidden transition-[opacity,visibility] duration-200 md:block xl:hidden',
              open && 'invisible opacity-0',
            )}
          >
            <ResumeButton size="sm" className={hitArea} />
          </div>
          <ThemeToggle className="pointer-events-auto" />
          <div className="pointer-events-auto hidden xl:block">
            <ResumeButton size="sm" className={hitArea} />
          </div>
          <MenuToggle
            ref={toggleRef}
            open={open}
            controls={MENU_ID}
            onToggle={toggle}
            className="pointer-events-auto -mr-1 xl:hidden"
          />
        </div>
      </Container>

      <MobileMenu
        id={MENU_ID}
        open={open}
        activeNav={activeNav}
        onDismiss={dismiss}
        onBeforeNavigate={beforeNavigate}
        onNavigate={afterNavigate}
      />
    </header>
  )
}
