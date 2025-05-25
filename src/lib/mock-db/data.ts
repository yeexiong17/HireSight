import { Job, Candidate } from './types';

export const jobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-time',
    status: 'Open',
    description: 'Join our dynamic team to build cutting-edge user interfaces for our flagship product. You will be responsible for...',
    requirements: [
      'Extensive experience with React and modern JavaScript',
      'Strong understanding of web performance optimization',
      'Experience with TypeScript and state management',
      '5+ years of professional development experience'
    ],
    responsibilities: [
      'Develop and maintain complex web applications',
      'Collaborate with designers and backend developers',
      'Mentor junior developers',
      'Contribute to technical architecture decisions'
    ],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'job-2',
    title: 'Product Manager',
    company: 'TechCorp',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'Open',
    description: 'Lead the product vision and strategy for our new mobile app. Work closely with engineering, design, and marketing teams...',
    requirements: [
      'Proven experience in product management',
      'Strong analytical and problem-solving skills',
      'Excellent communication and leadership abilities',
      '3+ years of product management experience'
    ],
    responsibilities: [
      'Define product strategy and roadmap',
      'Work with stakeholders to gather requirements',
      'Lead agile development process',
      'Analyze market trends and competition'
    ],
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z'
  }
];

export const candidates: Candidate[] = [
  {
    id: 'candidate-1',
    jobId: 'job-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '+1 (555) 123-4567',
    status: 'Completed',
    resumeUrl: 'https://example.com/resumes/alice-johnson.pdf',
    interviewDate: '2024-03-15T14:00:00Z',
    scores: {
      overall: 85,
      technical: 88,
      communication: 82,
      problemSolving: 85
    },
    feedback: {
      strengths: [
        'Strong understanding of React and modern JavaScript',
        'Excellent problem-solving approach',
        'Clear communication of technical concepts'
      ],
      improvements: [
        'Could improve on system design considerations',
        'More focus on edge cases during problem-solving'
      ],
      technicalNotes: 'Demonstrated strong knowledge of frontend technologies, particularly React hooks and state management. Good understanding of performance optimization.',
      communicationNotes: 'Articulate in explaining technical decisions and trade-offs. Maintains professional demeanor throughout.',
      problemSolvingNotes: 'Methodical approach to problem-solving. Good at breaking down complex problems into manageable parts.'
    },
    interviewTranscript: [
      {
        question: 'Can you explain your approach to state management in React applications?',
        answer: 'I typically start with local state using useState for component-level state. For more complex applications, I evaluate whether Redux or Context API would be more appropriate based on the application\'s needs.',
        evaluation: 'Strong understanding of state management concepts and trade-offs between different approaches.'
      },
      {
        question: 'How would you optimize the performance of a React application?',
        answer: 'I focus on several key areas: proper use of React.memo and useMemo for expensive computations, implementing code splitting with React.lazy, and ensuring efficient re-renders...',
        evaluation: 'Comprehensive knowledge of React performance optimization techniques.'
      }
    ],
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-15T16:00:00Z'
  },
  {
    id: 'candidate-2',
    jobId: 'job-1',
    name: 'Bob Smith',
    email: 'bob.s@example.com',
    phone: '+1 (555) 234-5678',
    status: 'In Progress',
    resumeUrl: 'https://example.com/resumes/bob-smith.pdf',
    interviewDate: '2024-03-20T15:00:00Z',
    scores: {
      overall: 0,
      technical: 0,
      communication: 0,
      problemSolving: 0
    },
    feedback: {
      strengths: [],
      improvements: [],
      technicalNotes: '',
      communicationNotes: '',
      problemSolvingNotes: ''
    },
    interviewTranscript: [],
    createdAt: '2024-03-12T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z'
  },
  {
    id: 'candidate-3',
    jobId: 'job-2',
    name: 'Carol Williams',
    email: 'carol.w@example.com',
    phone: '+1 (555) 345-6789',
    status: 'Hired',
    resumeUrl: 'https://example.com/resumes/carol-williams.pdf',
    interviewDate: '2024-03-10T13:00:00Z',
    scores: {
      overall: 92,
      technical: 95,
      communication: 90,
      problemSolving: 91
    },
    feedback: {
      strengths: [
        'Exceptional product management skills',
        'Strong leadership abilities',
        'Great strategic thinking'
      ],
      improvements: [
        'Could expand knowledge of emerging technologies',
        'Consider deeper dive into data analytics'
      ],
      technicalNotes: 'Strong understanding of product development lifecycle and technical considerations.',
      communicationNotes: 'Excellent communication skills. Able to articulate product vision and strategy clearly.',
      problemSolvingNotes: 'Shows great analytical skills and systematic approach to problem-solving.'
    },
    interviewTranscript: [
      {
        question: 'How do you prioritize product features?',
        answer: 'I use a combination of quantitative and qualitative data. I look at user feedback, analytics, business goals, and technical constraints to create a prioritization framework...',
        evaluation: 'Excellent understanding of product prioritization and stakeholder management.'
      }
    ],
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-10T15:00:00Z'
  }
]; 