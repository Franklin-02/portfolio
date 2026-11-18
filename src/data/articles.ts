import type { ArticlesContent } from '@/types/content'

/**
 * LinkedIn educational content series.
 *
 * To link a post, add its real LinkedIn address as `url` on the article.
 * While `url` is undefined the card shows no link, so nothing fake is published.
 */
export const articles: ArticlesContent = {
  eyebrow: 'LinkedIn Content',
  heading: 'Sharing Knowledge. Growing Together.',
  description:
    'An educational content series on LinkedIn that walks through Guidewire InsuranceSuite concepts one topic at a time.',
  series: {
    title: 'Guidewire Educational Series',
    description: 'A planned series of 30 educational posts on Guidewire and insurance technology.',
    plannedCount: 30,
  },
  articles: [
    {
      number: '01',
      title: 'PolicyCenter Life Cycle',
      description:
        'How a policy moves through its life in PolicyCenter, from submission and issuance to changes, renewal, and cancellation.',
      status: 'published',
      topics: ['Submission', 'Issuance', 'Policy change', 'Renewal'],
    },
    {
      number: '02',
      title: 'BillingCenter Life Cycle',
      description:
        'How billing works once a policy is in force: accounts, invoicing, payments, and what happens when a payment is missed.',
      status: 'published',
      topics: ['Accounts', 'Invoicing', 'Payments', 'Delinquency'],
    },
    {
      number: '03',
      title: 'ClaimCenter Life Cycle',
      description:
        'The journey of a claim, from first notice of loss through investigation and evaluation to payment and closure.',
      status: 'published',
      topics: ['First notice of loss', 'Investigation', 'Payment', 'Closure'],
    },
    {
      number: '04',
      title: 'InsuranceSuite Architecture',
      description:
        'How PolicyCenter, BillingCenter, and ClaimCenter fit together and exchange information as one insurance platform.',
      status: 'published',
      topics: ['PolicyCenter', 'BillingCenter', 'ClaimCenter', 'Integration'],
    },
    {
      number: '05',
      title: 'PolicyCenter Data Model',
      description:
        'The core entities behind PolicyCenter, such as accounts, policies, and policy periods, and how they relate to each other.',
      status: 'current',
      topics: ['Accounts', 'Policies', 'Policy periods', 'Entity relationships'],
    },
  ],
  followLabel: 'Follow the series on LinkedIn',
}
