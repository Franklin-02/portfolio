import type { IconName } from '@/types/content'

/** Icon shown for each insurance application, by id. Unknown ids fall back to a neutral icon. */
const icons: Record<string, IconName> = {
  policycenter: 'shield-check',
  insurancenow: 'workflow',
  billingcenter: 'receipt',
  claimcenter: 'clipboard-check',
}

export function productIcon(id: string): IconName {
  return icons[id] ?? 'layers'
}
