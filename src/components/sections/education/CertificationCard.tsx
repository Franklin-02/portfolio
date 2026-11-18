import { CredentialSeal } from '@/components/sections/education/CredentialSeal'
import { Card } from '@/components/ui/Card'
import type { Certification } from '@/types/content'
import { cn } from '@/utils/cn'

const metaLabel = 'text-[0.6875rem] font-semibold tracking-[0.18em] text-faint uppercase'

/** Small brackets in the corners of the certificate frame. */
const cornerMarks = [
  'top-3 left-3 rounded-tl-[3px] border-t border-l',
  'top-3 right-3 rounded-tr-[3px] border-t border-r',
  'bottom-3 left-3 rounded-bl-[3px] border-b border-l',
  'right-3 bottom-3 rounded-br-[3px] border-r border-b',
]

interface CertificationCardProps {
  certification: Certification
}

/**
 * A certification presented as an understated certificate: a framed sheet with
 * the name and description set centred, and the issuer and the seal along the
 * bottom edge.
 *
 * It shows only what the content file provides. There is deliberately no
 * credential ID, issue date or verification link, because none was supplied.
 */
export function CertificationCard({ certification }: CertificationCardProps) {
  const titleId = `certification-${certification.id}-title`

  return (
    <Card as="article" aria-labelledby={titleId} className="h-full p-2 sm:p-2.5">
      <div className="@container relative isolate flex h-full flex-col overflow-hidden rounded-lg border border-line-strong px-5 pt-10 pb-7 text-center sm:px-10 sm:pt-12 sm:pb-9">
        {/* A little light on the top of the sheet. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-linear-to-b from-primary/6 to-transparent"
        />
        {cornerMarks.map((position) => (
          <span
            key={position}
            aria-hidden="true"
            className={cn('pointer-events-none absolute size-3 border-primary/60', position)}
          />
        ))}

        <p className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] text-primary-soft uppercase">
          <span aria-hidden="true" className="h-px w-7 bg-linear-to-r from-transparent to-primary" />
          Professional certification
          <span aria-hidden="true" className="h-px w-7 bg-linear-to-l from-transparent to-secondary" />
        </p>

        <h4
          id={titleId}
          className="mx-auto mt-6 max-w-lg text-2xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-[1.75rem]"
        >
          {certification.name}
        </h4>

        <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-linear-to-r from-transparent to-line-strong" />
          <span className="size-1.5 rotate-45 bg-primary" />
          <span className="h-px w-12 bg-linear-to-l from-transparent to-line-strong" />
        </div>

        <p className="mx-auto mt-6 max-w-xl text-[0.95rem] leading-relaxed text-pretty text-muted">
          {certification.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-5 pt-10 text-left @xl:gap-8">
          <dl className="flex min-w-0 flex-1 flex-col gap-x-10 gap-y-4 @xl:flex-row">
            <div className="min-w-0 @xl:max-w-[19rem]">
              <dt className={metaLabel}>Issued by</dt>
              <dd className="mt-1.5 text-sm leading-snug font-medium text-pretty text-ink">{certification.issuer}</dd>
            </div>
            <div className="shrink-0">
              <dt className={metaLabel}>Credential</dt>
              <dd className="mt-1.5 text-sm leading-snug font-medium text-ink">{certification.shortName}</dd>
            </div>
          </dl>

          <CredentialSeal className="w-24 @xl:w-32" />
        </div>
      </div>
    </Card>
  )
}
