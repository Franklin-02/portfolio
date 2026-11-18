import { EcosystemDiagram } from '@/components/sections/insurance/EcosystemDiagram'
import { ProductCard } from '@/components/sections/insurance/ProductCard'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { insurance } from '@/data/insurance'

/**
 * Guidewire and insurance technology: the applications worked with (hands-on
 * ones first, basic knowledge clearly labelled) and an original diagram of how
 * the core InsuranceSuite applications relate.
 */
export function InsuranceTechnology() {
  const handsOn = insurance.products.filter((product) => product.levelTone === 'hands-on')
  const basic = insurance.products.filter((product) => product.levelTone !== 'hands-on')

  return (
    <Section
      id="insurance-technology"
      tone="canvas"
      decoration={<div className="bg-glow-secondary absolute -top-48 -right-48 size-[42rem]" />}
    >
      <SectionHeading
        id="insurance-technology-heading"
        eyebrow={insurance.eyebrow}
        title={insurance.heading}
        description={insurance.description}
      />

      <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {handsOn.map((product, index) => (
          <RevealItem key={product.id} className="h-full">
            <ProductCard product={product} accentIndex={index} />
          </RevealItem>
        ))}

        {basic.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 md:col-span-2 lg:col-span-1 lg:auto-rows-fr lg:grid-cols-1">
            {basic.map((product) => (
              <RevealItem key={product.id} className="h-full">
                <ProductCard product={product} />
              </RevealItem>
            ))}
          </div>
        ) : null}
      </RevealGroup>

      <Reveal className="mt-5">
        <EcosystemDiagram ecosystem={insurance.ecosystem} />
      </Reveal>
    </Section>
  )
}
