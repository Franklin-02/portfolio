import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'

/**
 * DEVELOPMENT ONLY. Renders one component in isolation:
 *
 *   /__preview/sections/Hero      -> src/components/sections/Hero.tsx
 *   /__preview/layout/Footer      -> src/components/layout/Footer.tsx
 *   /__preview/pages/NotFound     -> src/pages/NotFound.tsx
 *
 * Each component is loaded on its own, so a syntax error in one file does not
 * break the preview of another. main.tsx only loads this module when
 * import.meta.env.DEV is true, so it is not part of the production build.
 */

type PreviewModule = Record<string, unknown>

const modules: Record<string, () => Promise<PreviewModule>> = {
  ...import.meta.glob<PreviewModule>('../components/**/*.tsx'),
  ...import.meta.glob<PreviewModule>('../pages/*.tsx'),
}

/** '../components/sections/Hero.tsx' -> 'sections/Hero'; '../pages/NotFound.tsx' -> 'pages/NotFound' */
function toPreviewPath(moduleKey: string): string {
  return moduleKey.replace('../components/', '').replace('../', '').replace(/\.tsx$/, '')
}

function pickComponent(module: PreviewModule, name: string): ComponentType {
  const candidate = module[name] ?? module.default
  if (typeof candidate !== 'function') {
    throw new Error(`No component export named "${name}" (or default export) in this file.`)
  }
  return candidate as ComponentType
}

/** One lazy component per file, created once when this module loads. */
const previews: Record<string, LazyExoticComponent<ComponentType>> = Object.fromEntries(
  Object.entries(modules).map(([moduleKey, load]) => {
    const previewPath = toPreviewPath(moduleKey)
    const name = previewPath.split('/').pop() ?? ''
    return [previewPath, lazy(async () => ({ default: pickComponent(await load(), name) }))]
  }),
)

const PREFIX = `${import.meta.env.BASE_URL}__preview/`

export default function ComponentPreview() {
  const path = decodeURIComponent(window.location.pathname.slice(PREFIX.length)).replace(/\/+$/, '')
  const Preview = previews[path]

  if (!Preview) {
    return (
      <div className="min-h-dvh bg-canvas p-8 font-mono text-sm text-ink">
        <p className="mb-4 font-semibold">No component at "{path}". Available previews:</p>
        <ul className="space-y-1 text-muted">
          {Object.keys(previews)
            .sort()
            .map((previewPath) => (
              <li key={previewPath}>
                <a className="hover:text-ink hover:underline" href={`${PREFIX}${previewPath}`}>
                  /__preview/{previewPath}
                </a>
              </li>
            ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <Suspense fallback={null}>
        <Preview />
      </Suspense>
    </div>
  )
}
