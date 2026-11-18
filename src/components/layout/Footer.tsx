import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { LinkedInIcon } from '@/components/ui/BrandIcons'
import { Container } from '@/components/ui/Container'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { Logo } from '@/components/ui/Logo'
import { ResumeButton } from '@/components/ui/ResumeButton'
import { SectionLink } from '@/components/ui/SectionLink'
import { navItems } from '@/data/navigation'
import { hero, profile } from '@/data/profile'
import { buildMailtoUrl } from '@/utils/mailto'

const TRADEMARK_NOTE =
  'Guidewire, PolicyCenter, BillingCenter, ClaimCenter, InsuranceSuite and InsuranceNow are trademarks of Guidewire Software, Inc. This is an independent personal portfolio and is not affiliated with or endorsed by Guidewire.'

/** "Quality Assurance | Business Analysis | Project Management" -> its three parts. */
const headlineParts = profile.headline.split('|').map((part) => part.trim())

/**
 * Column heading. From `xl` the three columns sit side by side, so the heading
 * is centred on the logo row and the list below it lines up with the headline.
 */
const columnTitle = 'font-sans text-xs font-semibold tracking-[0.18em] text-faint uppercase xl:pt-2.5'
const columnBody = 'mt-4 xl:mt-5.5'

const contactRow = 'flex min-h-11 items-center gap-3 text-sm text-muted'

/** Rows that are links also react to hover. */
const contactLink = `group ${contactRow}`

const contactText = 'min-w-0 break-words transition-colors duration-200 group-hover:text-ink'

function ContactTile({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-ink/4 text-primary-soft transition duration-200 group-hover:border-primary/40 group-hover:bg-primary/10"
    >
      {children}
    </span>
  )
}

/** Site footer: brand, navigation, contact details and the legal notes. */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-line bg-surface">
      {/* A brand-coloured hairline on the top border, with a faint glow falling from it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-px bottom-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
        <div className="bg-glow-primary absolute -top-44 left-1/2 h-88 w-[60rem] -translate-x-1/2 opacity-80" />
      </div>

      <Container className="relative">
        <div className="grid gap-x-10 gap-y-12 py-14 sm:py-16 md:grid-cols-2 xl:grid-cols-12 xl:py-20">
          {/* Brand. On tablets it spans the full width, with the resume button opposite the logo. */}
          <div className="md:col-span-2 md:flex md:items-start md:justify-between md:gap-10 xl:col-span-5 xl:block">
            <div className="min-w-0">
              <SectionLink
                section="home"
                className="inline-flex rounded-lg transition-opacity duration-200 hover:opacity-85"
              >
                <Logo />
                {/* Added to the visible name and role, so the link's accessible name still matches what is shown. */}
                <span className="sr-only">, home</span>
              </SectionLink>

              {/* The separators are clipped at the start of each line, so a wrapped line never begins with one. */}
              <p className="mt-6 overflow-hidden text-sm font-semibold text-ink">
                <span className="sr-only">{profile.headline}</span>
                <span aria-hidden="true" className="-ml-[1.5625rem] flex flex-wrap gap-y-1">
                  {headlineParts.map((part) => (
                    <span key={part} className="ml-3 border-l border-line-strong pl-3 leading-5 whitespace-nowrap">
                      {part}
                    </span>
                  ))}
                </span>
              </p>

              <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-pretty text-muted">{hero.description}</p>
            </div>

            <ResumeButton className="mt-7 md:-mt-1 xl:mt-7" />
          </div>

          {/* Navigation: two columns that read top to bottom, in page order. */}
          <nav aria-label="Footer" className="xl:col-span-3">
            <h2 className={columnTitle}>Navigation</h2>
            <ul className={`${columnBody} grid auto-cols-fr grid-flow-col grid-rows-4 gap-x-8`}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <SectionLink
                    section={item.id}
                    className="group inline-flex min-h-11 items-center text-sm text-muted transition-colors duration-200 hover:text-ink"
                  >
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-linear-to-r from-primary to-secondary transition-transform duration-300 ease-out group-hover:scale-x-100"
                      />
                    </span>
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="xl:col-span-4">
            <h2 className={columnTitle}>Contact</h2>
            <address className={`${columnBody} not-italic`}>
              <ul>
                <li>
                  <a href={buildMailtoUrl({ to: profile.email })} className={contactLink}>
                    <ContactTile>
                      <Mail size={16} strokeWidth={1.75} />
                    </ContactTile>
                    <span className="sr-only">Email: </span>
                    <span className={contactText}>{profile.email}</span>
                  </a>
                </li>
                <li>
                  <a href={profile.phone.href} className={contactLink}>
                    <ContactTile>
                      <Phone size={16} strokeWidth={1.75} />
                    </ContactTile>
                    <span className="sr-only">Phone: </span>
                    <span className={contactText}>{profile.phone.display}</span>
                  </a>
                </li>
                <li>
                  <ExternalLink href={profile.linkedin.url} className={contactLink}>
                    <ContactTile>
                      <LinkedInIcon size={15} />
                    </ContactTile>
                    <span className="sr-only">LinkedIn: </span>
                    <span className={contactText}>{profile.linkedin.label}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={14}
                      strokeWidth={1.75}
                      className="-ml-1 shrink-0 text-faint transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                    />
                  </ExternalLink>
                </li>
                <li className={contactRow}>
                  <ContactTile>
                    <MapPin size={16} strokeWidth={1.75} />
                  </ContactTile>
                  <span className="sr-only">Location: </span>
                  <span className="min-w-0 break-words">{profile.location}</span>
                </li>
              </ul>
            </address>
          </div>
        </div>

        {/*
          Legal. Below `lg` the extra space underneath keeps the text clear of the floating
          "Back to top" button; from `xl` the note is narrow enough to stay clear of it.
        */}
        <div className="grid gap-x-10 gap-y-3 border-t border-line pt-7 pb-20 lg:pb-10 xl:grid-cols-12">
          <p className="text-sm text-muted xl:col-span-5">
            © {year} {profile.name} All rights reserved.
          </p>
          <p className="max-w-3xl text-xs leading-relaxed text-pretty text-faint xl:col-span-7 xl:max-w-xl">
            {TRADEMARK_NOTE}
          </p>
        </div>
      </Container>
    </footer>
  )
}
