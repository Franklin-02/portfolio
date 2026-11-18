/**
 * Content model for the portfolio.
 *
 * Everything the site says lives in `src/data/*` and is typed here, so content
 * can be updated without touching UI components.
 */

/** Keys of the icons available to content (mapped to components in components/ui/Icon.tsx). */
export type IconName =
  | 'award'
  | 'badge-check'
  | 'book-open'
  | 'bot'
  | 'braces'
  | 'briefcase'
  | 'bug'
  | 'building'
  | 'calendar'
  | 'clipboard-check'
  | 'code'
  | 'file-search'
  | 'file-text'
  | 'flask'
  | 'git-branch'
  | 'globe'
  | 'graduation-cap'
  | 'kanban'
  | 'languages'
  | 'layers'
  | 'list-checks'
  | 'mail'
  | 'map-pin'
  | 'map-pinned'
  | 'message-square'
  | 'network'
  | 'phone'
  | 'receipt'
  | 'repeat'
  | 'rocket'
  | 'scan-search'
  | 'search'
  | 'shield-check'
  | 'shopping-bag'
  | 'target'
  | 'thumbs-up'
  | 'timer'
  | 'trending-up'
  | 'umbrella'
  | 'users'
  | 'workflow'

/* ---------------------------------------------------------------- Navigation */

/** Entries shown in the navigation bar. */
export type NavId =
  | 'home'
  | 'about'
  | 'experience'
  | 'expertise'
  | 'projects'
  | 'achievements'
  | 'education'
  | 'contact'

/** DOM ids of the sections rendered on the home page, in page order. */
export type SectionId =
  | 'home'
  | 'about'
  | 'experience'
  | 'expertise'
  | 'insurance-technology'
  | 'delivery'
  | 'projects'
  | 'achievements'
  | 'education'
  | 'insights'
  | 'contact'

export interface NavItem {
  id: NavId
  label: string
}

export interface PageSection {
  /** DOM id of the section. */
  id: SectionId
  /** Navigation entry highlighted while this section is in view. */
  nav: NavId
}

/* ------------------------------------------------------------------- Profile */

export interface Language {
  name: string
  level: string
}

export interface Profile {
  name: string
  /** Initials used for the logo and favicon. */
  initials: string
  designation: string
  headline: string
  disciplines: string[]
  location: string
  email: string
  phone: { display: string; href: string }
  linkedin: { url: string; label: string }
  organization: string
  experience: string
  employmentPeriod: string
  certification: string
  languages: Language[]
}

/** A headline figure. Use `value` for animated numbers or `text` for words. */
export interface Metric {
  id: string
  value?: number
  text?: string
  prefix?: string
  suffix?: string
  label: string
  description?: string
  icon: IconName
}

export interface HeroAction {
  id: string
  label: string
  /** `section` scrolls to a page section, `resume` renders the resume download button. */
  kind: 'section' | 'resume'
  section?: SectionId
}

export interface HeroContent {
  greeting: string
  /** Each line pairs a lead-in word with the word to emphasise. */
  headline: { lead: string; emphasis: string }[]
  designation: string
  description: string
  actions: HeroAction[]
  /** Short labels for the floating chips in the hero visual. */
  focusAreas: string[]
  stats: Metric[]
  statsNote: string
}

/* --------------------------------------------------------------------- About */

export interface Capability {
  number: string
  title: string
  description: string
  icon: IconName
}

export interface AboutContent {
  eyebrow: string
  heading: string
  paragraphs: string[]
  capabilities: Capability[]
}

/* ---------------------------------------------------------------- Experience */

export interface EngagementHighlight {
  value: string
  label: string
}

export interface Engagement {
  id: string
  /** e.g. "Project A" */
  label: string
  name: string
  /** Marks the engagement being worked on now: shows a "Current project" badge. */
  current?: boolean
  /** Optional one-sentence description shown under the name. */
  summary?: string
  /** Leave empty when no platform applies: the group is then not shown. */
  platforms: string[]
  tools: string[]
  highlights: EngagementHighlight[]
  responsibilities: string[]
  /** Which original illustration accompanies the engagement. */
  visual: 'policy-lifecycle' | 'api-validation' | 'application-analysis'
}

export interface ExperienceContent {
  eyebrow: string
  heading: string
  description: string
  company: string
  designation: string
  duration: string
  location: string
  engagements: Engagement[]
  confidentialityNote: string
}

/* -------------------------------------------------------------- Achievements */

export interface AchievementGroup {
  id: string
  title: string
  description: string
  metrics: Metric[]
}

export interface AchievementsContent {
  eyebrow: string
  heading: string
  description: string
  groups: AchievementGroup[]
  /** Makes clear the figures are self-reported. */
  disclaimer: string
}

/* -------------------------------------------------------------------- Skills */

export interface Skill {
  name: string
  /** Optional qualifier shown next to the skill, e.g. "Basic". */
  note?: string
}

export interface SkillCategory {
  id: string
  title: string
  summary: string
  icon: IconName
  skills: Skill[]
}

export interface SkillsContent {
  eyebrow: string
  heading: string
  description: string
  categories: SkillCategory[]
}

/* ------------------------------------------------------------------ Projects */

/** Controls the colour of the status badge. */
export type ProjectStatusTone = 'professional' | 'in-progress' | 'concept' | 'planned'

export interface ProjectLinks {
  /** Public repository URL. Leave undefined until a real repository exists. */
  github?: string
  /** Live demo URL. Leave undefined until the project is actually deployed. */
  demo?: string
}

export interface Project {
  /** Identifier used in the shareable detail link: /?project=<slug>. Lowercase letters, digits and hyphens. */
  slug: string
  /** Display order label, e.g. "01". */
  number: string
  title: string
  category: string
  /** One or two sentences shown on the card. */
  description: string
  /** Extra paragraphs shown in the detail view. */
  overview: string[]
  status: {
    /** Short badge text, e.g. "In Development". */
    label: string
    /** Optional clarification shown next to the badge, e.g. "Completion to be confirmed". */
    detail?: string
    tone: ProjectStatusTone
  }
  /** Heading for the feature list, e.g. "Activities" or "Potential capabilities". */
  featuresLabel: string
  features: string[]
  technologies: {
    /** Heading for the list, e.g. "Tools" or "Potential stack". */
    label: string
    items: string[]
    /** Clarifies stacks that are not final yet. */
    note?: string
  }
  links: ProjectLinks
  /** Shown where links would be when none are available, e.g. "Links coming soon". */
  linksNote: string
  /** Confidentiality or honesty notice shown in the detail view. */
  notice?: string
  icon: IconName
}

export interface ProjectsContent {
  eyebrow: string
  heading: string
  description: string
}

/* ------------------------------------------------- Delivery (BA & PMO) section */

export interface DeliveryArea {
  id: string
  title: string
  icon: IconName
  items: string[]
}

export interface DeliveryStep {
  id: string
  title: string
  description: string
  /** What I contribute at this stage. */
  activities: string[]
  icon: IconName
}

export interface DeliveryContent {
  eyebrow: string
  heading: string
  description: string
  areas: DeliveryArea[]
  processTitle: string
  processDescription: string
  steps: DeliveryStep[]
}

/* ------------------------------------------------ Insurance technology section */

export interface InsuranceProduct {
  id: string
  name: string
  /** Honest description of the depth of experience. */
  level: string
  levelTone: 'hands-on' | 'basic'
  points: string[]
}

export interface EcosystemNode {
  id: 'policycenter' | 'billingcenter' | 'claimcenter'
  name: string
  role: string
}

export interface EcosystemFlow {
  from: EcosystemNode['id']
  to: EcosystemNode['id']
  label: string
}

export interface InsuranceContent {
  eyebrow: string
  heading: string
  description: string
  products: InsuranceProduct[]
  ecosystem: {
    title: string
    caption: string
    nodes: EcosystemNode[]
    flows: EcosystemFlow[]
    disclaimer: string
  }
}

/* ----------------------------------------------- Education and certifications */

export interface Certification {
  id: string
  name: string
  shortName: string
  issuer: string
  description: string
}

export interface EducationEntry {
  id: string
  degree: string
  field?: string
  institution: string
  completed: string
}

export interface EducationContent {
  eyebrow: string
  heading: string
  description: string
  certificationsTitle: string
  educationTitle: string
  certifications: Certification[]
  education: EducationEntry[]
}

/* ------------------------------------------------------------------ Articles */

export type ArticleStatus = 'published' | 'current'

export interface Article {
  number: string
  title: string
  description: string
  status: ArticleStatus
  topics: string[]
  /** LinkedIn post URL. Leave undefined until the real link is available. */
  url?: string
}

export interface ArticlesContent {
  eyebrow: string
  heading: string
  description: string
  series: {
    title: string
    description: string
    /** Total number of posts planned for the series. */
    plannedCount: number
  }
  articles: Article[]
  /** Label for the profile link, e.g. "Follow the series on LinkedIn". */
  followLabel: string
}

/* ------------------------------------------------------------------- Contact */

export interface ContactContent {
  eyebrow: string
  heading: string
  description: string
}
