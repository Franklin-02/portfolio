import type { InsuranceContent } from '@/types/content'

/** Guidewire & insurance technology section. */
export const insurance: InsuranceContent = {
  eyebrow: 'Insurance Technology',
  heading: 'Specialized in Insurance Technology.',
  description:
    'Hands-on experience testing and analysing Property & Casualty insurance platforms, with a working understanding of how the core systems fit together.',
  products: [
    {
      id: 'policycenter',
      name: 'Guidewire PolicyCenter',
      level: 'Hands-on project experience',
      levelTone: 'hands-on',
      points: [
        'Policy lifecycle',
        'Policy administration',
        'Underwriting workflows',
        'Product management',
        'Policy transactions',
      ],
    },
    {
      id: 'insurancenow',
      name: 'InsuranceNow',
      level: 'Hands-on project experience',
      levelTone: 'hands-on',
      points: [
        'Insurance application workflows',
        'Forms validation',
        'Consumer portal',
        'Multi-line-of-business testing',
      ],
    },
    {
      id: 'billingcenter',
      name: 'BillingCenter',
      level: 'Basic',
      levelTone: 'basic',
      points: ['Basic functional understanding'],
    },
    {
      id: 'claimcenter',
      name: 'ClaimCenter',
      level: 'Basic',
      levelTone: 'basic',
      points: ['Basic functional understanding'],
    },
  ],
  ecosystem: {
    title: 'Guidewire InsuranceSuite at a glance',
    caption:
      'PolicyCenter is the system of record for policies. BillingCenter manages what is billed and collected for them, and ClaimCenter manages the claims made against them.',
    nodes: [
      { id: 'policycenter', name: 'PolicyCenter', role: 'Policy administration and underwriting' },
      { id: 'billingcenter', name: 'BillingCenter', role: 'Billing, invoicing, and payments' },
      { id: 'claimcenter', name: 'ClaimCenter', role: 'Claims from first notice to settlement' },
    ],
    flows: [
      { from: 'policycenter', to: 'billingcenter', label: 'Premiums and billing instructions' },
      { from: 'billingcenter', to: 'policycenter', label: 'Payment and delinquency status' },
      { from: 'policycenter', to: 'claimcenter', label: 'Policy and coverage details' },
      { from: 'claimcenter', to: 'policycenter', label: 'Claim and loss information' },
    ],
    disclaimer: 'Original, simplified illustration for explanation only. Not an official Guidewire diagram.',
  },
}
