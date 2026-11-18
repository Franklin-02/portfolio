import type { AchievementsContent } from '@/types/content'

export const achievements: AchievementsContent = {
  eyebrow: 'Achievements',
  heading: 'Key Achievements',
  description:
    'Outcomes and delivery scale from my work on Property & Casualty insurance programmes.',
  groups: [
    {
      id: 'impact',
      title: 'Quality impact',
      description: 'Improvements in how effectively and how quickly quality was delivered.',
      metrics: [
        {
          id: 'test-coverage',
          value: 30,
          suffix: '%',
          label: 'Improvement in Test Coverage',
          description: 'More of the application verified in each test cycle.',
          icon: 'target',
        },
        {
          id: 'defect-turnaround',
          value: 50,
          suffix: '%',
          label: 'Reduction in Defect Turnaround Time',
          description: 'Less time between a defect being raised and resolved.',
          icon: 'timer',
        },
        {
          id: 'test-cycle',
          value: 10,
          suffix: '%',
          label: 'Reduction in Test Cycle Time',
          description: 'Shorter end-to-end test execution cycles.',
          icon: 'repeat',
        },
        {
          id: 'customer-satisfaction',
          value: 20,
          suffix: '%',
          label: 'Increase in Customer Satisfaction',
          description: 'Improved satisfaction among customer stakeholders.',
          icon: 'thumbs-up',
        },
      ],
    },
    {
      id: 'scale',
      title: 'Delivery scale',
      description: 'The volume and breadth of work behind those results.',
      metrics: [
        {
          id: 'test-cases',
          value: 400,
          suffix: '+',
          label: 'Manual Test Cases Per Release Cycle',
          description: 'Executed in every release cycle.',
          icon: 'list-checks',
        },
        {
          id: 'defects',
          value: 300,
          suffix: '+',
          label: 'Defects Identified and Tracked',
          description: 'Identified and tracked using Rally.',
          icon: 'bug',
        },
        {
          id: 'agile-ceremonies',
          value: 80,
          suffix: '+',
          label: 'Agile Ceremonies',
          description: 'Participated in alongside delivery teams.',
          icon: 'users',
        },
        {
          id: 'lines-of-business',
          value: 8,
          label: 'P&C Lines of Business',
          description: 'Major lines covered across Ohio and Indiana.',
          icon: 'layers',
        },
      ],
    },
  ],
  disclaimer: 'Figures are self-reported, as stated on my resume.',
}
