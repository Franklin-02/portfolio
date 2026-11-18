import type { EducationContent } from '@/types/content'

/**
 * Certifications and education are kept in separate lists.
 * No certificate numbers or verification links are shown unless real ones are added here.
 */
export const education: EducationContent = {
  eyebrow: 'Credentials',
  heading: 'Certifications & Education',
  description: 'The professional certification and academic foundation behind my day-to-day work.',
  certificationsTitle: 'Certification',
  educationTitle: 'Education',
  certifications: [
    {
      id: 'istqb-ctfl',
      name: 'ISTQB – Certified Tester Foundation Level (CTFL)',
      shortName: 'ISTQB CTFL',
      issuer: 'International Software Testing Qualifications Board (ISTQB)',
      description:
        'Foundation-level certification covering the fundamentals of software testing, test design techniques, test management, and testing across the software life cycle.',
    },
  ],
  education: [
    {
      id: 'bca',
      degree: 'Bachelor of Computer Applications (BCA)',
      field: 'Computer Science',
      institution: 'Tamilnadu Open University',
      completed: '2026',
    },
    {
      id: 'diploma',
      degree: 'Diploma in Computer Engineering',
      institution: 'Seshasayee Institute of Technology',
      completed: '2022',
    },
  ],
}
