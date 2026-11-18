import { LoaderCircle, Send } from 'lucide-react'
import { controlClasses } from '@/components/sections/contact/classes'
import { FormField } from '@/components/sections/contact/FormField'
import { FormStatus } from '@/components/sections/contact/FormStatus'
import type { ContactDelivery } from '@/components/sections/contact/types'
import { useContactForm } from '@/components/sections/contact/useContactForm'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { Icon } from '@/components/ui/Icon'
import { contactForm } from '@/config/site'
import { profile } from '@/data/profile'
import { cn } from '@/utils/cn'
import { buildContactMailto, CONTACT_LIMITS, type ContactField } from '@/utils/contactForm'

/** One line under the submit button saying what pressing it does in each delivery mode. */
const helperText: Record<ContactDelivery['mode'], string> = {
  mailto: 'This opens your email app with your message ready to send.',
  endpoint: 'This sends your message directly from this page.',
}

const messageLimit = CONTACT_LIMITS.message.max
const numberFormat = new Intl.NumberFormat('en-US')

interface ContactFormProps {
  /** Where valid messages go. Defaults to the site configuration (config/site.ts). */
  delivery?: ContactDelivery
}

/**
 * The contact form: Name, Email, Subject and Message with inline validation,
 * spam protection and honest feedback for the active delivery mode.
 * The behaviour lives in `useContactForm`.
 */
export function ContactForm({ delivery = contactForm }: ContactFormProps) {
  const form = useContactForm(delivery)
  const { values, errors, isSubmitting } = form

  /** Attributes shared by the four controls. */
  const control = (field: ContactField) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    maxLength: CONTACT_LIMITS[field].max,
    readOnly: isSubmitting,
    'aria-required': true,
    'aria-invalid': Boolean(errors[field]),
    onChange: (event: { target: { value: string } }) => form.changeField(field, event.target.value),
    onBlur: (event: { target: { value: string } }) => form.blurField(field, event.target.value),
  })

  const messageLength = values.message.length
  const remaining = messageLimit - messageLength

  return (
    <>
      <div className="flex items-center gap-4 border-b border-line pb-6">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary-soft">
          <Icon name="message-square" size={20} />
        </span>
        <div className="min-w-0">
          <h3 id="contact-form-title" className="text-xl leading-tight font-bold tracking-tight text-ink">
            Send a message
          </h3>
          <p id="contact-form-note" className="mt-1 text-[0.8125rem] leading-snug text-muted">
            Fields marked with <span className="font-semibold text-primary-soft">*</span> are required.
          </p>
        </div>
      </div>

      <form
        noValidate
        aria-labelledby="contact-form-title"
        aria-describedby="contact-form-note"
        onSubmit={(event) => void form.submit(event)}
        onFocus={form.submitPress.end}
        className="mt-6 grid grid-cols-1 gap-y-3"
      >
        <FormField id="contact-name" label="Name" error={errors.name}>
          <input
            {...control('name')}
            type="text"
            autoComplete="name"
            autoCapitalize="words"
            spellCheck={false}
            placeholder="Your full name"
            aria-describedby="contact-name-error"
            className={cn(controlClasses, 'h-12')}
          />
        </FormField>

        <FormField id="contact-email" label="Email" error={errors.email}>
          <input
            {...control('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="name@example.com"
            aria-describedby="contact-email-error"
            className={cn(controlClasses, 'h-12')}
          />
        </FormField>

        <FormField id="contact-subject" label="Subject" error={errors.subject}>
          <input
            {...control('subject')}
            type="text"
            autoComplete="off"
            placeholder="What is this about?"
            aria-describedby="contact-subject-error"
            className={cn(controlClasses, 'h-12')}
          />
        </FormField>

        <FormField
          id="contact-message"
          label="Message"
          error={errors.message}
          aside={
            <p
              id="contact-message-count"
              className={cn(
                'shrink-0 text-xs leading-5 font-medium tabular-nums',
                remaining <= 0 ? 'text-danger' : remaining <= 200 ? 'text-warning' : 'text-faint',
              )}
            >
              <span aria-hidden="true">
                {numberFormat.format(messageLength)} / {numberFormat.format(messageLimit)}
              </span>
              <span className="sr-only">
                {messageLength} of {messageLimit} characters used
              </span>
            </p>
          }
        >
          <textarea
            {...control('message')}
            rows={6}
            placeholder="How can I help?"
            aria-describedby="contact-message-error contact-message-count"
            className={cn(
              controlClasses,
              'field-sizing-content max-h-[28rem] min-h-40 resize-y py-3 leading-relaxed supports-[field-sizing:content]:resize-none',
            )}
          />
        </FormField>

        {/* Honeypot: hidden from people and assistive technology; only automated form fillers complete it. */}
        <div aria-hidden="true" className="absolute top-auto -left-[9999px] size-px overflow-hidden">
          <label htmlFor="contact-reference">Leave this field empty</label>
          <input
            id="contact-reference"
            name="reference_code"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.honeypot}
            onChange={(event) => form.setHoneypot(event.target.value)}
          />
        </div>

        <div className="mt-3">
          <button
            type="submit"
            aria-disabled={isSubmitting}
            aria-busy={isSubmitting}
            aria-describedby="contact-form-help"
            onPointerDown={form.submitPress.start}
            onPointerCancel={form.submitPress.end}
            onBlur={form.submitPress.end}
            className={buttonClasses({
              size: 'lg',
              className: 'w-full aria-disabled:pointer-events-none aria-disabled:opacity-70 sm:w-auto sm:min-w-48',
            })}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle aria-hidden="true" focusable="false" size={18} strokeWidth={2} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send aria-hidden="true" focusable="false" size={17} strokeWidth={2} />
                Send message
              </>
            )}
          </button>
          <p id="contact-form-help" className="mt-3.5 text-sm leading-relaxed text-muted">
            {helperText[delivery.mode]}
          </p>
          <FormStatus status={form.status} fallbackHref={buildContactMailto(values, profile.email)} />
        </div>
      </form>
    </>
  )
}
