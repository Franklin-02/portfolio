import { inlineLinkClasses } from '@/components/sections/contact/classes'
import { ResumeButton } from '@/components/ui/ResumeButton'
import { resume } from '@/config/site'
import { profile } from '@/data/profile'
import { cn } from '@/utils/cn'
import { buildMailtoUrl } from '@/utils/mailto'

/** File type shown next to the download, taken from the configured file name (e.g. "PDF"). */
const fileFormat = /\.([a-z0-9]+)$/i.exec(resume.fileName)?.[1]?.toUpperCase()

interface ContactResumeProps {
  className?: string
}

/**
 * The resume download. Until the PDF has been added to the site, the shared
 * button shows its "coming soon" state and this adds a way to ask for a copy.
 */
export function ContactResume({ className }: ContactResumeProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6 lg:flex-col lg:items-start lg:gap-4',
        className,
      )}
    >
      <ResumeButton variant="secondary" size="lg" className="w-full sm:w-auto" />
      {resume.available ? (
        fileFormat ? (
          <p className="text-sm leading-relaxed text-muted">Downloads as a {fileFormat} file.</p>
        ) : null
      ) : (
        <p className="max-w-md text-sm leading-relaxed text-pretty text-muted">
          The resume PDF will be available here soon. Until then,{' '}
          <a href={buildMailtoUrl({ to: profile.email, subject: 'Resume request' })} className={inlineLinkClasses}>
            request a copy by email
          </a>
          .
        </p>
      )}
    </div>
  )
}
