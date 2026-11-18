/** First focusable element on the page: lets keyboard users jump past the navigation. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="bg-brand-gradient sr-only rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-glow focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
    >
      Skip to main content
    </a>
  )
}
