import {
  Job,
  Candidate,
  Employer,
  AIInterviewer,
  JobPlatform,
  Resume,
} from "./types";

export const employers: Employer[] = [
  {
    id: "emp-1",
    companyName: "TechCorp",
    industry: "Technology",
    size: "1000-5000",
    location: "San Francisco, CA",
    description:
      "Leading technology company specializing in AI and machine learning solutions.",
    website: "https://techcorp.example.com",
    logo: "https://example.com/logos/techcorp.png",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "emp-2",
    companyName: "FinanceHub",
    industry: "Financial Services",
    size: "500-1000",
    location: "New York, NY",
    description: "Innovative fintech company revolutionizing digital banking.",
    website: "https://financehub.example.com",
    logo: "https://example.com/logos/financehub.png",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

export const aiInterviewers: AIInterviewer[] = [
  {
    id: "ai-1",
    name: "Alex Tech",
    specialization: ["Frontend Development", "React", "JavaScript"],
    description:
      "Specialized in frontend development interviews with focus on React and modern JavaScript.",
    personality: "Professional and encouraging",
    experienceLevel: "Senior",
    active: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "ai-2",
    name: "Sarah Product",
    specialization: ["Product Management", "Agile", "Strategy"],
    description:
      "Expert in product management interviews with emphasis on strategy and execution.",
    personality: "Analytical and thorough",
    experienceLevel: "Lead",
    active: true,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

export const resumes: Resume[] = [
  {
    id: "resume-1",
    candidateId: "candidate-1",
    jobId: "job-1",
    jobTitle: "Lead Frontend Engineer",
    fileName: "resume_1749047552029.pdf",
    uploadDate: "2024-03-10T00:00:00Z",
    status: "Approved",
    confidence: 88,
    fieldsExtracted: 12,
    extractedData: {
      name: "Alice Johnson",
      email: "alice.j@example.com",
      phone: "+1 (555) 123-4567",
      experience: "7 years",
      education: [
        "M.S. Computer Science, Stanford University",
        "B.S. Computer Science, UC Berkeley",
      ],
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    },
  },
  {
    id: "resume-2",
    candidateId: "candidate-2",
    jobId: "job-1",
    jobTitle: "Frontend Performance Engineer",
    fileName: "bob_smith_resume.pdf",
    uploadDate: "2024-03-12T00:00:00Z",
    status: "Pending",
    confidence: 92,
    fieldsExtracted: 12,
    extractedData: {
      name: "Bob Smith",
      email: "bob.s@example.com",
      phone: "+1 (555) 234-5678",
      experience: "5 years",
      education: ["B.S. Software Engineering, MIT"],
      skills: ["React", "JavaScript", "Vue.js", "CSS", "Python"],
    },
  },
  {
    id: "resume-3",
    candidateId: "candidate-3",
    jobId: "job-1",
    jobTitle: "Senior Full Stack Developer",
    fileName: "john_smith_resume.pdf",
    uploadDate: "2024-01-15T00:00:00Z",
    status: "Pending",
    confidence: 92,
    fieldsExtracted: 12,
    extractedData: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      experience: "8 years",
      location: "San Francisco, CA",
      education: [
        "M.S. Software Engineering, Georgia Tech",
        "B.S. Computer Science, University of Washington",
      ],
      skills: ["React", "TypeScript", "Node.js", "AWS", "System Design"],
    },
  },
  {
    id: "resume-4",
    candidateId: "candidate-4",
    jobId: "job-2",
    jobTitle: "Senior Product Manager - Growth",
    fileName: "sarah_johnson_cv.pdf",
    uploadDate: "2024-01-14T00:00:00Z",
    status: "Approved",
    confidence: 88,
    fieldsExtracted: 10,
    extractedData: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (555) 456-7890",
      experience: "6 years",
      education: [
        "MBA, Harvard Business School",
        "B.S. Business Administration, NYU",
      ],
      skills: ["Product Management", "Agile", "Data Analysis", "User Research"],
    },
  },
  {
    id: "resume-5",
    candidateId: "candidate-5",
    jobId: "job-3",
    jobTitle: "Senior UX/UI Designer - Mobile",
    fileName: "michael_chen_resume.pdf",
    uploadDate: "2024-01-13T00:00:00Z",
    status: "Pending",
    confidence: 95,
    fieldsExtracted: 14,
    extractedData: {
      name: "Michael Chen",
      email: "michael.c@example.com",
      phone: "+1 (555) 567-8901",
      experience: "4 years",
      education: ["B.S. Computer Engineering, UC San Diego"],
      skills: ["Java", "Spring Boot", "MySQL", "Docker", "Kubernetes"],
    },
  },
  {
    id: "resume-6",
    candidateId: "candidate-6",
    jobId: "job-2",
    jobTitle: "Technical Product Manager",
    fileName: "emily_davis_resume.pdf",
    uploadDate: "2024-01-12T00:00:00Z",
    status: "Rejected",
    confidence: 85,
    fieldsExtracted: 11,
    extractedData: {
      name: "Emily Davis",
      email: "emily.d@example.com",
      phone: "+1 (555) 678-9012",
      experience: "3 years",
      education: ["B.A. Business Administration, USC"],
      skills: ["Project Management", "Marketing", "Data Analysis"],
    },
  },
];

export const jobs: Job[] = [
  {
    id: "job-1",
    title: "Senior Frontend Developer",
    company: "TechCorp",
    department: "Technology",
    location: "Remote",
    type: "Full-time",
    status: "Open",
    description:
      "Join our dynamic team to build cutting-edge user interfaces for our flagship product. You will be responsible for...",
    requirements: [
      "Extensive experience with React and modern JavaScript",
      "Strong understanding of web performance optimization",
      "Experience with TypeScript and state management",
      "5+ years of professional development experience",
    ],
    responsibilities: [
      "Develop and maintain complex web applications",
      "Collaborate with designers and backend developers",
      "Mentor junior developers",
      "Contribute to technical architecture decisions",
    ],
    salaryRange: {
      min: 120000,
      max: 180000,
      currency: "USD",
    },
    benefits: [
      "Health insurance",
      "Remote work",
      "Flexible hours",
      "Professional development budget",
    ],
    platforms: ["LinkedIn", "Indeed"],
    aiInterviewerId: "ai-1",
    createdAt: "2024-07-15",
    updatedAt: "2024-07-15",
  },
  {
    id: "job-2",
    title: "Product Manager",
    company: "TechCorp",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    status: "Open",
    description:
      "Lead the product vision and strategy for our new mobile app. Work closely with engineering, design, and marketing teams...",
    requirements: [
      "Proven experience in product management",
      "Strong analytical and problem-solving skills",
      "Excellent communication and leadership abilities",
      "3+ years of product management experience",
    ],
    responsibilities: [
      "Define product strategy and roadmap",
      "Work with stakeholders to gather requirements",
      "Lead agile development process",
      "Analyze market trends and competition",
    ],
    salaryRange: {
      min: 130000,
      max: 190000,
      currency: "USD",
    },
    benefits: [
      "Health insurance",
      "Stock options",
      "Flexible hours",
      "Learning stipend",
    ],
    platforms: ["LinkedIn"],
    aiInterviewerId: "ai-2",
    createdAt: "2024-07-10",
    updatedAt: "2024-07-10",
  },
  {
    id: "job-3",
    title: "UX/UI Designer",
    company: "TechCorp",
    department: "Design",
    location: "Remote",
    type: "Contract",
    status: "Closed",
    description:
      "Craft beautiful and intuitive user experiences for web and mobile applications. Collaborate with product managers and developers...",
    requirements: [
      "Strong portfolio demonstrating UI/UX skills",
      "Experience with modern design tools",
      "Understanding of user-centered design principles",
      "3+ years of design experience",
    ],
    responsibilities: [
      "Create user interfaces for web and mobile applications",
      "Conduct user research and usability testing",
      "Develop design systems and style guides",
      "Collaborate with product and engineering teams",
    ],
    platforms: [],
    aiInterviewerId: "ai-3",
    createdAt: "2024-07-05",
    updatedAt: "2024-07-05",
  },
  {
    id: "job-4",
    title: "Marketing Specialist",
    company: "TechCorp",
    department: "Marketing",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "Open",
    description:
      "Develop and execute innovative marketing campaigns across various channels. Analyze market trends and customer insights...",
    requirements: [
      "Experience in digital marketing",
      "Strong analytical skills",
      "Content creation abilities",
      "2+ years of marketing experience",
    ],
    responsibilities: [
      "Plan and execute marketing campaigns",
      "Analyze campaign performance",
      "Create engaging content",
      "Manage social media presence",
    ],
    platforms: [],
    aiInterviewerId: "ai-4",
    createdAt: "2024-06-28",
    updatedAt: "2024-06-28",
  },
];

export const candidates: Candidate[] = [
  {
    id: "candidate-1",
    jobId: "job-1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    phone: "+1 (555) 123-4567",
    status: "Completed",
    resumeId: "resume-1",
    resumeUrl: "https://example.com/resumes/alice-johnson.pdf",
    interviewDate: "2024-03-15T14:00:00Z",
    scores: {
      overall: 85,
      technical: 88,
      communication: 82,
      problemSolving: 85,
    },
    feedback: {
      strengths: [
        "Strong understanding of React and modern JavaScript",
        "Excellent problem-solving approach",
        "Clear communication of technical concepts",
        "Deep knowledge of frontend performance optimization",
      ],
      improvements: [
        "Could improve on system design considerations",
        "More focus on edge cases during problem-solving",
        "Consider deeper dive into state management patterns",
      ],
      technicalNotes:
        "Demonstrated exceptional proficiency in React ecosystem, particularly with hooks and state management. Strong grasp of frontend performance optimization techniques. Showed good understanding of modern JavaScript features and TypeScript.",
      communicationNotes:
        "Articulate in explaining complex technical concepts. Maintains professional demeanor and actively listens. Could improve on providing more concise answers.",
      problemSolvingNotes:
        "Methodical approach to problem decomposition. Good at identifying edge cases. Could improve on discussing trade-offs more explicitly.",
    },
    interviewTranscript: [
      {
        question:
          "Can you explain your approach to state management in large React applications?",
        answer:
          "I follow a tiered approach to state management. For component-level state, I use useState and useReducer hooks. For shared state between closely related components, I leverage Context API with custom hooks. For complex global state, I implement Redux with proper middleware for async operations. I also ensure proper memoization using useMemo and useCallback to prevent unnecessary re-renders.",
        evaluation:
          "Excellent understanding of state management concepts and practical implementation considerations.",
      },
      {
        question:
          "How would you optimize the performance of a React application?",
        answer:
          "I focus on several key areas: First, implementing proper code splitting using React.lazy and Suspense. Second, optimizing render performance through careful use of useMemo, useCallback, and React.memo. Third, implementing efficient data fetching strategies with proper caching. Finally, optimizing bundle size through tree shaking and proper webpack configuration.",
        evaluation:
          "Strong grasp of performance optimization techniques and their practical application.",
      },
      {
        question:
          "Describe a challenging technical problem you've solved recently.",
        answer:
          "I recently tackled performance issues in a complex dashboard with real-time updates. The challenge was maintaining smooth updates while handling large datasets. I implemented virtualization for long lists, optimized Redux state updates, and introduced a web worker for data processing. This reduced the main thread blocking and improved the overall user experience significantly.",
        evaluation:
          "Shows good problem-solving skills and consideration for user experience.",
      },
    ],
    experienceYears: 7,
    currentCompany: "WebTech Solutions",
    expectedSalary: 150000,
    noticePeriod: "1 month",
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2024-03-15T16:00:00Z",
  },
  {
    id: "candidate-2",
    jobId: "job-1",
    name: "Bob Smith",
    email: "bob.s@example.com",
    phone: "+1 (555) 234-5678",
    status: "In Progress",
    resumeId: "resume-2",
    resumeUrl: "https://example.com/resumes/bob-smith.pdf",
    interviewDate: "2024-03-20T15:00:00Z",
    scores: {
      overall: 78,
      technical: 75,
      communication: 82,
      problemSolving: 77,
    },
    feedback: {
      strengths: [
        "Good communication skills",
        "Strong CSS and styling expertise",
        "Practical experience with Vue.js",
        "Enthusiastic about learning",
      ],
      improvements: [
        "Deepen understanding of React internals",
        "Strengthen computer science fundamentals",
        "Work on system design skills",
      ],
      technicalNotes:
        "Shows good practical knowledge of frontend development, particularly with Vue.js. React knowledge is more surface level. Strong in CSS and styling but could improve on performance optimization concepts.",
      communicationNotes:
        "Clear and enthusiastic communicator. Good at explaining practical implementations but sometimes struggles with theoretical concepts.",
      problemSolvingNotes:
        "Takes a practical approach to problem-solving. Could improve on considering edge cases and scalability aspects.",
    },
    interviewTranscript: [
      {
        question:
          "Explain the differences between Vue.js and React, and when would you choose one over the other?",
        answer:
          "Vue.js offers a more gentle learning curve with its template-based approach and built-in state management. React focuses on JavaScript-first development with JSX and has a more flexible ecosystem. I'd choose Vue for smaller teams and projects needing quick ramp-up, and React for larger applications requiring more customization.",
        evaluation:
          "Good practical understanding of framework differences, though could go deeper into technical aspects.",
      },
      {
        question: "How do you handle responsive design challenges?",
        answer:
          "I start with a mobile-first approach using CSS Grid and Flexbox. I create reusable utility classes and use CSS custom properties for maintainable breakpoints. For complex layouts, I implement container queries where needed. I also ensure proper testing across different devices and browsers.",
        evaluation:
          "Strong knowledge of modern CSS and responsive design principles.",
      },
    ],
    experienceYears: 5,
    currentCompany: "Tech Innovators Inc",
    expectedSalary: 140000,
    noticePeriod: "2 weeks",
    createdAt: "2024-03-12T00:00:00Z",
    updatedAt: "2024-03-12T00:00:00Z",
  },
  {
    id: "candidate-3",
    jobId: "job-1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    status: "Pending",
    resumeId: "resume-3",
    resumeUrl: "https://example.com/resumes/john-smith.pdf",
    interviewDate: "2024-03-25T10:00:00Z",
    scores: {
      overall: 92,
      technical: 95,
      communication: 88,
      problemSolving: 93,
    },
    feedback: {
      strengths: [
        "Exceptional system design skills",
        "Deep understanding of full-stack development",
        "Strong problem-solving capabilities",
        "Excellent technical communication",
      ],
      improvements: [
        "Could improve on UI/UX considerations",
        "Consider more team collaboration scenarios",
        "Expand knowledge of newer React patterns",
      ],
      technicalNotes:
        "Outstanding technical depth across the full stack. Particularly strong in system design and architecture. Shows deep understanding of React internals and performance optimization.",
      communicationNotes:
        "Communicates complex technical concepts clearly. Could improve on adapting communication style for different audiences.",
      problemSolvingNotes:
        "Excellent analytical skills and systematic approach to problem-solving. Considers scalability and maintainability in solutions.",
    },
    interviewTranscript: [
      {
        question:
          "How would you design a real-time collaborative editing system?",
        answer:
          "I would implement operational transformation or CRDT for conflict resolution. The architecture would use WebSocket for real-time communication, Redis for temporary state management, and a persistent storage layer. For the frontend, I'd use a custom hook to manage WebSocket connections and state updates, with proper error handling and reconnection logic.",
        evaluation:
          "Exceptional understanding of distributed systems and real-time architecture.",
      },
      {
        question: "Explain your approach to managing technical debt.",
        answer:
          "I believe in balancing quick wins with long-term maintainability. I maintain a technical debt log, prioritizing issues based on impact and effort. I advocate for dedicating 20% of sprint capacity to debt reduction. I also emphasize proper documentation and knowledge sharing to prevent future debt.",
        evaluation:
          "Shows mature understanding of technical debt management and practical solutions.",
      },
    ],
    experienceYears: 8,
    currentCompany: "Software Solutions Ltd",
    expectedSalary: 160000,
    noticePeriod: "3 months",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "candidate-4",
    jobId: "job-2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 456-7890",
    status: "Hired",
    resumeId: "resume-4",
    resumeUrl: "https://example.com/resumes/sarah-johnson.pdf",
    interviewDate: "2024-01-20T11:00:00Z",
    scores: {
      overall: 92,
      technical: 90,
      communication: 95,
      problemSolving: 91,
    },
    feedback: {
      strengths: [
        "Exceptional product vision",
        "Strong leadership qualities",
        "Excellent stakeholder management",
      ],
      improvements: [
        "Could deepen technical knowledge",
        "Consider more data-driven approaches",
      ],
      technicalNotes:
        "Good understanding of technical constraints and possibilities.",
      communicationNotes:
        "Excellent communication skills with both technical and non-technical stakeholders.",
      problemSolvingNotes: "Strong analytical approach to problem-solving.",
      overallRecommendation: "Strong Hire",
    },
    interviewTranscript: [],
    experienceYears: 6,
    currentCompany: "Product Innovations Inc",
    expectedSalary: 170000,
    noticePeriod: "2 months",
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2024-01-20T16:00:00Z",
  },
  {
    id: "candidate-5",
    jobId: "job-3",
    name: "Michael Chen",
    email: "michael.c@example.com",
    phone: "+1 (555) 567-8901",
    status: "Pending",
    resumeId: "resume-5",
    resumeUrl: "https://example.com/resumes/michael-chen.pdf",
    interviewDate: "2024-03-18T13:00:00Z",
    scores: {
      overall: 0,
      technical: 0,
      communication: 0,
      problemSolving: 0,
    },
    feedback: {
      strengths: [],
      improvements: [],
      technicalNotes: "",
      communicationNotes: "",
      problemSolvingNotes: "",
    },
    interviewTranscript: [],
    experienceYears: 4,
    currentCompany: "Tech Systems Corp",
    expectedSalary: 130000,
    noticePeriod: "1 month",
    createdAt: "2024-01-13T00:00:00Z",
    updatedAt: "2024-01-13T00:00:00Z",
  },
  {
    id: "candidate-6",
    jobId: "job-2",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+1 (555) 678-9012",
    status: "Rejected",
    resumeId: "resume-6",
    resumeUrl: "https://example.com/resumes/emily-davis.pdf",
    interviewDate: "2024-01-18T14:00:00Z",
    scores: {
      overall: 65,
      technical: 60,
      communication: 70,
      problemSolving: 65,
    },
    feedback: {
      strengths: ["Good communication skills", "Enthusiastic about learning"],
      improvements: [
        "Needs more technical experience",
        "Product management knowledge needs development",
      ],
      technicalNotes:
        "Limited technical understanding of product development lifecycle.",
      communicationNotes:
        "Good communication but lacks depth in product discussions.",
      problemSolvingNotes:
        "Basic approach to problem-solving, needs more structure.",
      overallRecommendation: "No Hire",
    },
    interviewTranscript: [],
    experienceYears: 3,
    currentCompany: "StartupCo",
    expectedSalary: 120000,
    noticePeriod: "2 weeks",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2024-01-18T16:00:00Z",
  },
];
