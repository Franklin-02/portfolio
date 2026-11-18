export type ClassValue = string | number | false | null | undefined

/**
 * Joins class names, skipping falsy values.
 *
 * Note: it does not resolve conflicting Tailwind utilities, so a `className`
 * override should add to a component's classes rather than fight them.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ')
}
