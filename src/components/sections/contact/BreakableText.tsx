import { Fragment } from 'react'

interface BreakableTextProps {
  /** An email address or a URL. */
  text: string
}

/**
 * Renders an email address or URL as unbreakable chunks joined by soft break
 * opportunities, so on a narrow screen a long value wraps before "@" or after
 * "/" instead of in the middle of a word. The text itself is unchanged.
 */
export function BreakableText({ text }: BreakableTextProps) {
  const chunks = text.replace(/@/g, '\n@').replace(/\//g, '/\n').split('\n').filter(Boolean)

  return (
    <>
      {chunks.map((chunk, index) => (
        <Fragment key={`${index}-${chunk}`}>
          {index > 0 ? <wbr /> : null}
          <span className="whitespace-nowrap">{chunk}</span>
        </Fragment>
      ))}
    </>
  )
}
