import { Clock, Download } from 'lucide-react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui/buttonClasses'
import { resume } from '@/config/site'
import { cn } from '@/utils/cn'

interface ResumeButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Button text when the resume is available. */
  label?: string
  className?: string
}

/**
 * "Download Resume" button.
 *
 * When the PDF exists in public/resume/ it downloads the real file. Until
 * then it renders a clearly labelled, non-interactive "coming soon"
 * placeholder, so the site never offers a download that does not exist.
 */
export function ResumeButton({ variant = 'outline', size = 'md', label = 'Download Resume', className }: ResumeButtonProps) {
  if (resume.available) {
    return (
      <a href={resume.url} download={resume.fileName} className={buttonClasses({ variant, size, className })}>
        <Download aria-hidden="true" size={16} strokeWidth={2} />
        {label}
      </a>
    )
  }

  return (
    <span
      title="The resume PDF has not been added yet."
      className={cn(
        buttonClasses({ variant: 'outline', size }),
        'cursor-default border-dashed text-muted hover:border-line-strong hover:bg-transparent',
        className,
      )}
    >
      <Clock aria-hidden="true" size={16} strokeWidth={2} />
      Resume
      <span className="rounded-md bg-ink/8 px-1.5 py-0.5 text-[0.6875rem] font-semibold tracking-wide text-muted uppercase">
        Coming soon
      </span>
    </span>
  )
}
