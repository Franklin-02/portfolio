import type { ComponentType } from 'react'
import { ApiValidationVisual } from '@/components/sections/experience/ApiValidationVisual'
import { ApplicationAnalysisVisual } from '@/components/sections/experience/ApplicationAnalysisVisual'
import { PolicyLifecycleVisual } from '@/components/sections/experience/PolicyLifecycleVisual'
import type { Engagement } from '@/types/content'

const visuals: Record<Engagement['visual'], ComponentType<{ className?: string }>> = {
  'policy-lifecycle': PolicyLifecycleVisual,
  'api-validation': ApiValidationVisual,
  'application-analysis': ApplicationAnalysisVisual,
}

interface EngagementVisualProps {
  /** The `visual` field of the engagement in the content file. */
  visual: Engagement['visual']
  className?: string
}

/** The original illustration that accompanies an engagement. */
export function EngagementVisual({ visual, className }: EngagementVisualProps) {
  const Visual = visuals[visual]
  return <Visual className={className} />
}
