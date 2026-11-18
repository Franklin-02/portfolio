import { CircleCheck, MailOpen, TriangleExclamationPoint, type LucideIcon } from 'lucide-react'
import * as m from 'motion/react-m'
import { useEffect, useRef, type ReactNode } from 'react'
import { BreakableText } from '@/components/sections/contact/BreakableText'
import { inlineLinkClasses } from '@/components/sections/contact/classes'
import type { ContactFormStatus } from '@/components/sections/contact/types'
import { buttonClasses } from '@/components/ui/buttonClasses'
import { profile } from '@/data/profile'
import { cn } from '@/utils/cn'
import { buildMailtoUrl } from '@/utils/mailto'
import { EASE_OUT } from '@/utils/motion'
import { prefersReducedMotion } from '@/utils/scroll'

type Tone = 'success' | 'info' | 'danger'

const tones: Record<Tone, { box: string; icon: string; Icon: LucideIcon }> = {
  success: { box: 'border-success/30 bg-success/10', icon: 'text-success', Icon: CircleCheck },
  info: { box: 'border-primary/30 bg-primary/10', icon: 'text-primary-soft', Icon: MailOpen },
  danger: { box: 'border-danger/35 bg-danger/10', icon: 'text-danger', Icon: TriangleExclamationPoint },
}

interface StatusMessageProps {
  tone: Tone
  title: string
  children: ReactNode
}

function StatusMessage({ tone, title, children }: StatusMessageProps) {
  const { box, icon, Icon } = tones[tone]

  return (
    <m.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className={cn('mt-6 flex gap-3.5 rounded-xl border p-4 sm:p-5', box)}
    >
      <Icon aria-hidden="true" focusable="false" size={20} strokeWidth={1.9} className={cn('mt-0.5 shrink-0', icon)} />
      <div className="min-w-0 flex-1 text-sm leading-relaxed">
        <p className="font-semibold text-ink">{title}</p>
        <div className="mt-1 space-y-2 text-pretty text-muted">{children}</div>
      </div>
    </m.div>
  )
}

interface FormStatusProps {
  status: ContactFormStatus
  /** The typed message as a pre-filled email, offered when the form backend fails. */
  fallbackHref: string
}

/**
 * Outcome of the last submission. Success and information are announced
 * politely (role="status"); a failed delivery is announced at once
 * (role="alert"). Both live regions stay in the page so the announcements are
 * reliable, and the message scrolls into view when it would otherwise be
 * below the fold.
 */
export function FormStatus({ status, fallbackHref }: FormStatusProps) {
  const region = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status.kind === 'idle' || status.kind === 'submitting') return
    region.current?.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [status])

  return (
    <div ref={region} className="scroll-mb-8">
      <div role="status" aria-live="polite">
        {status.kind === 'submitting' ? <p className="sr-only">Sending your message.</p> : null}

        {status.kind === 'sent' ? (
          <StatusMessage key={status.attempt} tone="success" title="Message sent">
            <p>Thank you for getting in touch. Your message is on its way.</p>
          </StatusMessage>
        ) : null}

        {status.kind === 'mail-app' ? (
          <StatusMessage key={status.attempt} tone="info" title="Your email app should now be open">
            <p>
              Your message is ready to send from there. Nothing is sent from this page, so press send in your email
              app to finish.
            </p>
            <p>
              Nothing opened? Write to me directly at{' '}
              <a href={buildMailtoUrl({ to: profile.email })} className={inlineLinkClasses}>
                <BreakableText text={profile.email} />
              </a>
              .
            </p>
          </StatusMessage>
        ) : null}
      </div>

      <div role="alert">
        {status.kind === 'failed' ? (
          <StatusMessage key={status.attempt} tone="danger" title="Your message was not sent">
            <p>
              {status.reason} Everything you typed is still in the form, so you can try again or send it from your
              email app instead.
            </p>
            <p className="pt-1">
              <a href={fallbackHref} className={buttonClasses({ variant: 'outline', size: 'md' })}>
                <MailOpen aria-hidden="true" focusable="false" size={15} strokeWidth={2} />
                Send from my email app
              </a>
            </p>
          </StatusMessage>
        ) : null}
      </div>
    </div>
  )
}
