import { ArrowRight } from 'lucide-react'
import { FlowArrow } from '@/components/sections/insurance/FlowArrow'
import { productIcon } from '@/components/sections/insurance/productIcons'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import type { EcosystemFlow, EcosystemNode, InsuranceContent } from '@/types/content'
import { cn } from '@/utils/cn'

type Ecosystem = InsuranceContent['ecosystem']

/** The hub is the application that takes part in the most flows (PolicyCenter). */
function findHub(nodes: EcosystemNode[], flows: EcosystemFlow[]): EcosystemNode | undefined {
  let hub: EcosystemNode | undefined
  let most = -1
  for (const node of nodes) {
    const count = flows.filter((flow) => flow.from === node.id || flow.to === node.id).length
    if (count > most) {
      most = count
      hub = node
    }
  }
  return hub
}

interface NodeCardProps {
  node: EcosystemNode
  hub?: boolean
}

function NodeCard({ node, hub = false }: NodeCardProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center rounded-xl border px-5 py-6 text-center',
        hub ? 'bg-brand-tint border-primary/35 shadow-card' : 'border-line bg-ink/3',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-11 items-center justify-center rounded-xl border',
          hub ? 'border-primary/30 bg-primary/15 text-primary-soft' : 'border-line bg-ink/4 text-muted',
        )}
      >
        <Icon name={productIcon(node.id)} size={20} />
      </span>
      <p className="mt-4 font-display text-lg font-bold tracking-tight text-ink">{node.name}</p>
      <p className="mt-1.5 text-sm leading-snug text-balance text-muted">{node.role}</p>
    </div>
  )
}

interface ConnectorProps {
  hub: EcosystemNode
  spoke: EcosystemNode
  flows: EcosystemFlow[]
  /** Which side of the hub the spoke sits on. */
  side: 'left' | 'right'
}

const flowLabel = 'text-center text-xs leading-snug font-medium text-balance text-muted'

/** The two flows between the hub and one spoke: outgoing above, returning below. */
function Connector({ hub, spoke, flows, side }: ConnectorProps) {
  const outgoing = flows.find((flow) => flow.from === hub.id && flow.to === spoke.id)
  const returning = flows.find((flow) => flow.from === spoke.id && flow.to === hub.id)
  const towardsSpoke = side
  const towardsHub = side === 'left' ? 'right' : 'left'

  return (
    <div className="flex flex-col justify-center gap-6 px-4">
      {outgoing ? (
        <div>
          <p className={cn(flowLabel, 'mb-2.5')}>
            <span className="sr-only">
              {hub.name} to {spoke.name}:{' '}
            </span>
            {outgoing.label}
          </p>
          <FlowArrow direction={towardsSpoke} tone="primary" />
        </div>
      ) : null}
      {returning ? (
        <div>
          <FlowArrow direction={towardsHub} tone="secondary" />
          <p className={cn(flowLabel, 'mt-2.5')}>
            <span className="sr-only">
              {spoke.name} to {hub.name}:{' '}
            </span>
            {returning.label}
          </p>
        </div>
      ) : null}
    </div>
  )
}

interface EcosystemDiagramProps {
  ecosystem: Ecosystem
}

/**
 * Original, simplified diagram of how the core applications exchange information.
 *
 * Wide screens: the hub in the middle with one application on each side and the
 * labelled flows drawn between them. Smaller screens, and any arrangement other
 * than one hub with two neighbours: the applications as cards followed by the
 * flows as a list, so every label stays readable.
 * Everything is real text taken from the content file; only the arrows are artwork.
 */
export function EcosystemDiagram({ ecosystem }: EcosystemDiagramProps) {
  const { nodes, flows } = ecosystem
  const hub = findHub(nodes, flows)
  if (!hub) return null

  const spokes = nodes.filter((node) => node.id !== hub.id)
  const [left, right] = spokes
  const asRow = spokes.length === 2 && left !== undefined && right !== undefined
  const nameOf = (id: EcosystemNode['id']) => nodes.find((node) => node.id === id)?.name ?? id

  return (
    <Card as="section" aria-labelledby="ecosystem-title" className="card-sheen overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
        <h3 id="ecosystem-title" className="text-xl font-bold tracking-tight text-balance text-ink sm:text-2xl">
          {ecosystem.title}
        </h3>
        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-pretty text-muted lg:mt-0">
          {ecosystem.caption}
        </p>
      </div>

      {asRow ? (
        <div className="mt-10 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(9.5rem,13rem)_minmax(0,1.1fr)_minmax(9.5rem,13rem)_minmax(0,1fr)] lg:items-stretch">
          <NodeCard node={left} />
          <Connector hub={hub} spoke={left} flows={flows} side="left" />
          <NodeCard node={hub} hub />
          <Connector hub={hub} spoke={right} flows={flows} side="right" />
          <NodeCard node={right} />
        </div>
      ) : null}

      <div className={cn('mt-8', asRow && 'lg:hidden')}>
        <ul className="grid gap-3 sm:grid-cols-3">
          {[hub, ...spokes].map((node) => (
            <li key={node.id}>
              <NodeCard node={node} hub={node.id === hub.id} />
            </li>
          ))}
        </ul>

        <h4 className="mt-7 font-sans text-xs font-semibold tracking-[0.18em] text-faint uppercase">
          How they exchange information
        </h4>
        <ul className="mt-3.5 grid gap-2.5 md:grid-cols-2">
          {flows.map((flow) => (
            <li key={`${flow.from}-${flow.to}`} className="rounded-xl border border-line bg-ink/3 px-4 py-3.5">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] font-semibold text-ink">
                {nameOf(flow.from)}
                <ArrowRight aria-hidden="true" size={14} strokeWidth={2} className="shrink-0 text-primary-soft" />
                <span className="sr-only">to</span>
                {nameOf(flow.to)}
              </p>
              <p className="mt-1 text-sm leading-snug text-muted">{flow.label}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 border-t border-line pt-5 text-xs leading-relaxed text-faint">{ecosystem.disclaimer}</p>
    </Card>
  )
}
