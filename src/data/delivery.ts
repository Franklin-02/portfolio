import type { DeliveryContent } from '@/types/content'

/** Business Analysis & PMO showcase. */
export const delivery: DeliveryContent = {
  eyebrow: 'Business Analysis & PMO',
  heading: 'Bridging Business Requirements and Technology Delivery.',
  description:
    'My responsibilities extend beyond test execution into requirement analysis, project coordination, and the documentation that keeps teams aligned.',
  areas: [
    {
      id: 'business-analysis',
      title: 'Business Analysis',
      icon: 'file-search',
      items: [
        'Requirement understanding',
        'Application analysis',
        'Business workflow analysis',
        'Functional documentation',
        'FRD preparation',
        'Gap identification',
      ],
    },
    {
      id: 'project-management',
      title: 'Project Management',
      icon: 'kanban',
      items: [
        'Task coordination',
        'Jira management',
        'Meeting coordination',
        'Sprint tracking',
        'Delivery documentation',
        'Stakeholder communication',
      ],
    },
    {
      id: 'documentation',
      title: 'Documentation & Knowledge Management',
      icon: 'book-open',
      items: [
        'Confluence',
        'SharePoint',
        'FRDs',
        'KT documentation',
        'Application analysis reports',
        'Traceability',
      ],
    },
  ],
  processTitle: 'An end-to-end delivery mindset',
  processDescription:
    'From the first requirement to the final release, every stage builds on the one before it. Select a stage to see how I contribute.',
  steps: [
    {
      id: 'business-requirements',
      title: 'Business Requirements',
      description: 'Understanding what the business needs, and why, before any solution is discussed.',
      activities: ['Requirement understanding', 'Stakeholder communication'],
      icon: 'message-square',
    },
    {
      id: 'analysis',
      title: 'Analysis',
      description: 'Analysing the application and its business workflows to identify gaps early.',
      activities: ['Application analysis', 'Business workflow analysis', 'Gap identification'],
      icon: 'search',
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Capturing requirements and findings in FRDs, functional documentation, and analysis reports.',
      activities: ['FRD preparation', 'Functional documentation', 'Confluence', 'SharePoint'],
      icon: 'file-text',
    },
    {
      id: 'development-coordination',
      title: 'Development Coordination',
      description: 'Coordinating tasks, meetings, and sprint progress with the team through Jira.',
      activities: ['Task coordination', 'Jira management', 'Sprint tracking', 'Meeting coordination'],
      icon: 'git-branch',
    },
    {
      id: 'testing',
      title: 'Testing',
      description: 'Verifying the build through functional, regression, integration, and API testing.',
      activities: ['Functional testing', 'Regression testing', 'API testing', 'Defect management'],
      icon: 'flask',
    },
    {
      id: 'validation',
      title: 'Validation',
      description: 'Confirming business processes work as intended, with traceability back to the requirements.',
      activities: ['UAT', 'Business process validation', 'Traceability'],
      icon: 'badge-check',
    },
    {
      id: 'delivery',
      title: 'Delivery',
      description: 'Supporting the release with delivery documentation, tracking, and clear stakeholder communication.',
      activities: ['Delivery documentation', 'Delivery tracking', 'KT documentation'],
      icon: 'rocket',
    },
  ],
}
