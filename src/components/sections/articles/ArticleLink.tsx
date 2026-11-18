import { ArrowUpRight } from 'lucide-react'
import { LinkedInIcon } from '@/components/ui/BrandIcons'
import { ExternalLink } from '@/components/ui/ExternalLink'
import { cn } from '@/utils/cn'

interface ArticleLinkProps {
  /** Address of the LinkedIn post. Render this component only when the article has one (see `articleUrl`). */
  href: string
  /** Article title, added for screen readers so every link has its own name. */
  title: string
  className?: string
}

/** "Read on LinkedIn" link for an article whose post address is in the content file. */
export function ArticleLink({ href, title, className }: ArticleLinkProps) {
  return (
    <ExternalLink
      href={href}
      className={cn(
        'group/link inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-primary-soft transition duration-200 hover:text-ink',
        className,
      )}
    >
      <LinkedInIcon size={15} className="shrink-0" />
      <span>
        Read on LinkedIn<span className="sr-only">: {title}</span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        focusable="false"
        size={16}
        strokeWidth={2}
        className="shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
      />
    </ExternalLink>
  )
}
