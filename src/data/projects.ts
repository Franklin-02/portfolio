import type { Project, ProjectsContent } from '@/types/content'

export const projectsContent: ProjectsContent = {
  eyebrow: 'Projects',
  heading: 'Featured Projects',
  description:
    'Independent work alongside my main role. Each entry states its real status: nothing is presented as more finished than it is.',
}

/**
 * HOW TO ADD A PROJECT
 * --------------------
 * Append an object to this array. The card and its detail view (shareable as
 * /?project=<slug>) are generated from it. No component changes are needed.
 *
 *  - `slug` must be unique, lowercase, and use only letters, digits and hyphens.
 *  - Only fill `links.github` / `links.demo` with real, working URLs. While they
 *    are undefined the UI shows `linksNote` instead of a button.
 *  - Keep `status` honest: "In Development", "Concept", "Completed", ...
 *
 * Work done for the employer (WRG, InsuranceNow, Orion) belongs in
 * src/data/experience.ts, not here.
 */
export const projects: Project[] = [
  {
    slug: 'billing-software',
    number: '01',
    title: 'Billing Software',
    category: 'Freelance Project',
    description: 'Desktop billing software developed as a freelance project and delivered to its users.',
    overview: [
      'Developed independently as freelance work, outside my main role, and delivered to the people who use it.',
      'It runs on the user’s own computer: when a user runs it, it creates a shortcut on their desktop.',
    ],
    status: { label: 'Delivered', detail: 'Freelance project, delivered to users', tone: 'professional' },
    featuresLabel: 'Scope',
    features: [
      'Billing management',
      'Invoice workflows',
      'Business-oriented user interface',
      'Runs on the user’s computer, with a desktop shortcut',
    ],
    technologies: {
      label: 'Platform',
      items: ['Desktop application'],
      note: 'Technology details to be added.',
    },
    links: {},
    linksNote: 'Delivered directly to users: no public link',
    icon: 'receipt',
  },
  {
    slug: 'ecommerce-application',
    number: '02',
    title: 'Ecommerce Application',
    category: 'Independent Web Application',
    description:
      'A demo user interface for a premium ecommerce application, developed through modular, AI-assisted development.',
    overview: [
      'An independent build of the user interface for an ecommerce application.',
      'It is a demonstration of the interface, not a live store.',
    ],
    status: { label: 'Demo UI', detail: 'Interface demo, not a live store', tone: 'planned' },
    // TO CONFIRM WITH THE OWNER: which of these areas the demo actually contains. Once confirmed,
    // list only those and change the label to "Interface areas".
    featuresLabel: 'Interface scope (to be confirmed)',
    features: [
      'Premium homepage',
      'Product listings',
      'Product cards',
      'Navigation',
      'Product browsing',
      'Responsive interface',
    ],
    // "Explored", not "used": the owner has not confirmed the stack of the demo yet.
    technologies: {
      label: 'Technologies explored',
      items: ['Node.js', 'Web technologies'],
      note: 'Node.js and related web technologies have been explored. The exact stack will be listed once confirmed.',
    },
    links: {},
    linksNote: 'No public link yet',
    icon: 'shopping-bag',
  },
]

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
