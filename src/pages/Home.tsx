import { useEffect } from 'react'
import { About } from '@/components/sections/About'
import { Achievements } from '@/components/sections/Achievements'
import { Articles } from '@/components/sections/Articles'
import { Contact } from '@/components/sections/Contact'
import { DeliveryShowcase } from '@/components/sections/DeliveryShowcase'
import { Education } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { Hero } from '@/components/sections/Hero'
import { InsuranceTechnology } from '@/components/sections/InsuranceTechnology'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'

/**
 * The single-page portfolio. Section order here must match `pageSections` in
 * data/navigation.ts so the navigation bar highlights the right entry.
 */
export default function Home() {
  // The page is rendered in the browser, so a link such as /#projects arrives
  // before its target exists. Jump to the target once the sections are mounted.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <InsuranceTechnology />
      <DeliveryShowcase />
      <Projects />
      <Achievements />
      <Education />
      <Articles />
      <Contact />
    </>
  )
}
