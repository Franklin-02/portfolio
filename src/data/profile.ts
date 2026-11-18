import type { AboutContent, ContactContent, HeroContent, Profile } from '@/types/content'

/** Core identity and contact details, reused across the whole site. */
export const profile: Profile = {
  name: 'Franklin Selvaraj M.',
  initials: 'FSM',
  designation: 'Senior QA Tester / PMO',
  headline: 'Quality Assurance | Business Analysis | Project Management',
  disciplines: ['Quality Assurance', 'Business Analysis', 'Project Management'],
  location: 'Trichy, Tamil Nadu, India',
  email: 'Techyfrank9750@gmail.com',
  phone: { display: '+91 8754128805', href: 'tel:+918754128805' },
  linkedin: {
    url: 'https://www.linkedin.com/in/franklin-selvaraj-m/',
    label: 'linkedin.com/in/franklin-selvaraj-m',
  },
  organization: 'New Dream Data Systems',
  experience: '4+ Years',
  employmentPeriod: 'June 2022 – Present',
  certification: 'ISTQB – Certified Tester Foundation Level (CTFL)',
  languages: [
    { name: 'Tamil', level: 'Advanced' },
    { name: 'English', level: 'Intermediate' },
    { name: 'Hindi', level: 'Beginner' },
  ],
}

export const hero: HeroContent = {
  greeting: "Hello, I'm Franklin Selvaraj M.",
  headline: [
    { lead: 'Engineering', emphasis: 'Quality.' },
    { lead: 'Understanding', emphasis: 'Business.' },
    { lead: 'Delivering', emphasis: 'Excellence.' },
  ],
  designation: 'Senior QA Tester / PMO',
  description:
    'With 4+ years of experience in Quality Assurance within the P&C insurance domain, I specialize in Guidewire PolicyCenter, InsuranceNow, QA Automation, API Testing, Business Analysis, and Project Delivery.',
  actions: [
    { id: 'experience', label: 'Explore My Experience', kind: 'section', section: 'experience' },
    { id: 'projects', label: 'View My Projects', kind: 'section', section: 'projects' },
    { id: 'resume', label: 'Download Resume', kind: 'resume' },
    { id: 'contact', label: 'Contact Me', kind: 'section', section: 'contact' },
  ],
  focusAreas: [
    'Guidewire PolicyCenter',
    'InsuranceNow',
    'QA Automation',
    'API Testing',
    'Business Analysis',
    'Project Delivery',
  ],
  stats: [
    { id: 'experience', value: 4, suffix: '+', label: 'Years Experience', icon: 'briefcase' },
    { id: 'coverage', value: 30, suffix: '%', label: 'Test Coverage Improvement', icon: 'target' },
    { id: 'turnaround', value: 50, suffix: '%', label: 'Defect Turnaround Reduction', icon: 'timer' },
    { id: 'certification', text: 'ISTQB', label: 'Certified', icon: 'badge-check' },
  ],
  statsNote: 'Figures as reported on my resume.',
}

export const about: AboutContent = {
  eyebrow: 'About Me',
  // The \u00A0 escape is a non-breaking space: it keeps the dash on the first line when the heading wraps.
  heading: 'Beyond Testing\u00A0– Understanding the Bigger Picture.',
  paragraphs: [
    'I am Franklin Selvaraj M., a Senior QA Tester / PMO with 4+ years of experience in the IT industry, specializing in Quality Assurance, Business Analysis, and Project Management within the Property & Casualty insurance domain.',
    'I have hands-on experience working with Guidewire PolicyCenter and InsuranceNow, contributing to insurance application testing, functional analysis, API validation, regression testing, automation, and business process validation.',
    'My technical expertise includes Java, Selenium, Playwright, Rest Assured, TestNG, Robot Framework, and Postman. I am ISTQB CTFL certified and experienced in the Software Testing Life Cycle, Agile/Scrum methodologies, defect management, and test strategy development.',
    'Beyond testing, I actively contribute to application analysis, requirements understanding, documentation, project coordination, and delivery activities.',
    'I am also passionate about independent software product development, AI-assisted engineering, business automation, and creating scalable digital solutions.',
  ],
  capabilities: [
    {
      number: '01',
      title: 'Quality Engineering',
      description:
        'Ensuring application quality through structured testing, automation, defect management, API validation, and regression strategies.',
      icon: 'shield-check',
    },
    {
      number: '02',
      title: 'Business Analysis',
      description:
        'Understanding business requirements, application workflows, functional specifications, documentation, and business processes.',
      icon: 'file-search',
    },
    {
      number: '03',
      title: 'Project Management / PMO',
      description:
        'Supporting project coordination, task management, documentation, stakeholder communication, sprint activities, and delivery tracking.',
      icon: 'kanban',
    },
  ],
}

export const contact: ContactContent = {
  eyebrow: 'Contact',
  heading: "Let's Connect and Build Something Meaningful.",
  description:
    "Whether you're looking to collaborate on software quality, discuss insurance technology, explore business opportunities, or connect professionally, I'd be happy to hear from you.",
}
