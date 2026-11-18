import { ContactDetails } from '@/components/sections/contact/ContactDetails'
import { ContactForm } from '@/components/sections/contact/ContactForm'
import { ContactResume } from '@/components/sections/contact/ContactResume'
import { Card } from '@/components/ui/Card'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { contact } from '@/data/profile'

/** Ambient lighting behind the section: a hairline at the top, a faint grid and two soft glows. */
function ContactBackdrop() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-line-strong to-transparent" />
      <div className="bg-grid absolute inset-0" />
      <div className="bg-glow-primary absolute -top-40 -right-56 h-[44rem] w-[56rem]" />
      <div className="bg-glow-secondary absolute -bottom-56 -left-48 h-[36rem] w-[46rem]" />
    </>
  )
}

/**
 * Contact: the direct details and the resume on one side, the message form on
 * the other. On phones the details come first, since a tap on the email,
 * phone or LinkedIn row is the quickest way to get in touch.
 */
export function Contact() {
  return (
    <Section id="contact" tone="canvas" decoration={<ContactBackdrop />}>
      <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact-heading"
            eyebrow={contact.eyebrow}
            title={contact.heading}
            description={contact.description}
          />
          <ContactDetails className="mt-10" />
          <Reveal delay={0.1} className="mt-8">
            <ContactResume />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <Card className="card-sheen p-6 sm:p-8 lg:p-10">
            <ContactForm />
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}
