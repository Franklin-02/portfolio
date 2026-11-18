import type { NavItem, PageSection } from '@/types/content'

/** Links shown in the navigation bar, in order. */
export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Sections on the home page in the order they are rendered, and the navigation
 * entry each one highlights. Several sections can share one navigation entry.
 */
export const pageSections: PageSection[] = [
  { id: 'home', nav: 'home' },
  { id: 'about', nav: 'about' },
  { id: 'experience', nav: 'experience' },
  { id: 'expertise', nav: 'expertise' },
  { id: 'insurance-technology', nav: 'expertise' },
  { id: 'delivery', nav: 'expertise' },
  { id: 'projects', nav: 'projects' },
  { id: 'achievements', nav: 'achievements' },
  { id: 'education', nav: 'education' },
  { id: 'insights', nav: 'education' },
  { id: 'contact', nav: 'contact' },
]
