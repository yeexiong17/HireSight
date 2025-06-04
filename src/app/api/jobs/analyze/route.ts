import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Define the expected structure for job analysis request
interface JobAnalysisRequest {
  jobTitle: string;
  jobDescription?: string;
  department?: string;
  location?: string;
  jobType?: string;
}

// Define the structure of AI-generated job analysis
interface JobAnalysisResponse {
  suggestedScope: {
    overview: string;
    keyObjectives: string[];
    impactAreas: string[];
  };
  suggestedRequirements: {
    essential: string[];
    preferred: string[];
    experience: string;
    education: string[];
  };
  suggestedResponsibilities: {
    primary: string[];
    secondary: string[];
    collaboration: string[];
  };
  suggestedSkills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  confidence: number; // 0-100 indicating AI confidence in suggestions
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Real AI analysis function using ChatGPT
async function analyzeJobWithAI(jobData: JobAnalysisRequest): Promise<JobAnalysisResponse> {
  const { jobTitle, jobDescription, department, location, jobType } = jobData;
  
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, falling back to mock analysis');
    return getMockAnalysis(jobData);
  }

  try {
    const prompt = `
You are an expert HR consultant and job market analyst. Analyze the following job information and provide a comprehensive job analysis in JSON format.

Job Information:
- Title: ${jobTitle}
- Department: ${department || 'Not specified'}
- Location: ${location || 'Not specified'}
- Job Type: ${jobType || 'Not specified'}
- Description: ${jobDescription || 'Not provided'}

Please provide a detailed analysis in the following JSON structure:
{
  "suggestedScope": {
    "overview": "A comprehensive 2-3 sentence overview of the role",
    "keyObjectives": ["4-5 key objectives for this role"],
    "impactAreas": ["4-5 main areas where this role will have impact"]
  },
  "suggestedRequirements": {
    "essential": ["5-7 essential requirements"],
    "preferred": ["4-6 preferred qualifications"],
    "experience": "Experience requirement description",
    "education": ["2-3 education requirements"]
  },
  "suggestedResponsibilities": {
    "primary": ["5-7 primary responsibilities"],
    "secondary": ["3-5 secondary responsibilities"],
    "collaboration": ["3-4 collaboration aspects"]
  },
  "suggestedSkills": {
    "technical": ["6-8 technical skills"],
    "soft": ["5-6 soft skills"],
    "tools": ["4-6 relevant tools/software"]
  },
  "salaryRange": {
    "min": number (minimum salary in USD),
    "max": number (maximum salary in USD),
    "currency": "USD"
  },
  "confidence": number (0-100, your confidence in this analysis)
}

Consider current market trends, industry standards, and location-based salary adjustments. Provide realistic and competitive salary ranges based on the role level, location, and current market conditions.

Return only the JSON object, no additional text.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert HR consultant specializing in job analysis and market research. Provide accurate, detailed, and market-relevant job analyses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const analysis = JSON.parse(responseContent) as JobAnalysisResponse;
    
    // Validate the response structure
    if (!analysis.suggestedScope || !analysis.suggestedRequirements || !analysis.suggestedResponsibilities) {
      throw new Error('Invalid response structure from OpenAI');
    }

    console.log('AI analysis completed successfully with confidence:', analysis.confidence);
    return analysis;

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    console.log('Falling back to mock analysis');
    return getMockAnalysis(jobData);
  }
}

// Fallback mock analysis function
function getMockAnalysis(jobData: JobAnalysisRequest): JobAnalysisResponse {
  const { jobTitle, jobDescription, department, location, jobType } = jobData;
  
  // Simple keyword-based analysis for demonstration
  const titleLower = jobTitle.toLowerCase();
  
  let analysis: JobAnalysisResponse = {
    suggestedScope: {
      overview: '',
      keyObjectives: [],
      impactAreas: []
    },
    suggestedRequirements: {
      essential: [],
      preferred: [],
      experience: '',
      education: []
    },
    suggestedResponsibilities: {
      primary: [],
      secondary: [],
      collaboration: []
    },
    suggestedSkills: {
      technical: [],
      soft: [],
      tools: []
    },
    salaryRange: {
      min: 50000,
      max: 80000,
      currency: 'USD'
    },
    confidence: 75
  };

  // Frontend Developer Analysis
  if (titleLower.includes('frontend') || titleLower.includes('front-end') || titleLower.includes('ui')) {
    analysis = {
      suggestedScope: {
        overview: `Develop and maintain user-facing web applications, ensuring exceptional user experience and performance. Work closely with design and backend teams to deliver high-quality frontend solutions.`,
        keyObjectives: [
          'Build responsive and interactive web applications',
          'Optimize application performance and user experience',
          'Implement modern frontend architectures',
          'Ensure cross-browser compatibility and accessibility'
        ],
        impactAreas: [
          'User Experience and Interface Design',
          'Application Performance and Optimization',
          'Code Quality and Maintainability',
          'Team Collaboration and Knowledge Sharing'
        ]
      },
      suggestedRequirements: {
        essential: [
          'Proficiency in HTML, CSS, and JavaScript',
          'Experience with React or similar frontend frameworks',
          'Understanding of responsive design principles',
          'Knowledge of version control systems (Git)',
          'Experience with modern build tools and bundlers'
        ],
        preferred: [
          'TypeScript experience',
          'Knowledge of state management libraries (Redux, Zustand)',
          'Experience with testing frameworks (Jest, React Testing Library)',
          'Familiarity with CSS preprocessors or CSS-in-JS',
          'Understanding of web performance optimization'
        ],
        experience: titleLower.includes('senior') ? '5+ years of frontend development experience' : 
                   titleLower.includes('junior') ? '1-2 years of frontend development experience' : 
                   '3+ years of frontend development experience',
        education: [
          'Bachelor\'s degree in Computer Science, Web Development, or related field',
          'Equivalent practical experience in frontend development'
        ]
      },
      suggestedResponsibilities: {
        primary: [
          'Develop and maintain responsive web applications using modern frontend technologies',
          'Collaborate with UX/UI designers to implement pixel-perfect designs',
          'Write clean, maintainable, and well-documented code',
          'Optimize applications for maximum speed and scalability',
          'Ensure cross-browser compatibility and accessibility standards'
        ],
        secondary: [
          'Participate in code reviews and provide constructive feedback',
          'Stay updated with latest frontend technologies and best practices',
          'Contribute to technical documentation and knowledge sharing',
          'Assist in troubleshooting and debugging production issues'
        ],
        collaboration: [
          'Work closely with backend developers to integrate APIs',
          'Collaborate with designers to ensure design feasibility',
          'Participate in agile development processes and sprint planning',
          'Communicate with stakeholders on project progress and requirements'
        ]
      },
      suggestedSkills: {
        technical: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Webpack', 'Git'],
        soft: ['Problem Solving', 'Attention to Detail', 'Communication', 'Team Collaboration', 'Adaptability'],
        tools: ['VS Code', 'Chrome DevTools', 'Figma', 'npm/yarn', 'ESLint', 'Prettier']
      },
      salaryRange: {
        min: titleLower.includes('senior') ? 90000 : titleLower.includes('junior') ? 50000 : 70000,
        max: titleLower.includes('senior') ? 130000 : titleLower.includes('junior') ? 70000 : 100000,
        currency: 'USD'
      },
      confidence: 85
    };
  }
  
  // Backend Developer Analysis
  else if (titleLower.includes('backend') || titleLower.includes('back-end') || titleLower.includes('server')) {
    analysis = {
      suggestedScope: {
        overview: `Design, develop, and maintain server-side applications and APIs. Ensure system scalability, security, and performance while working with databases and cloud infrastructure.`,
        keyObjectives: [
          'Build robust and scalable backend systems',
          'Design and implement efficient APIs',
          'Ensure data security and system reliability',
          'Optimize database performance and queries'
        ],
        impactAreas: [
          'System Architecture and Scalability',
          'API Design and Performance',
          'Data Management and Security',
          'Infrastructure and DevOps Integration'
        ]
      },
      suggestedRequirements: {
        essential: [
          'Proficiency in server-side programming languages (Python, Java, Node.js, etc.)',
          'Experience with database design and management (SQL/NoSQL)',
          'Knowledge of RESTful API design and implementation',
          'Understanding of software architecture patterns',
          'Experience with version control and collaborative development'
        ],
        preferred: [
          'Cloud platform experience (AWS, Azure, GCP)',
          'Containerization experience (Docker, Kubernetes)',
          'Message queue and caching systems knowledge',
          'Microservices architecture experience',
          'CI/CD pipeline implementation experience'
        ],
        experience: titleLower.includes('senior') ? '5+ years of backend development experience' : 
                   titleLower.includes('junior') ? '1-2 years of backend development experience' : 
                   '3+ years of backend development experience',
        education: [
          'Bachelor\'s degree in Computer Science, Software Engineering, or related field',
          'Equivalent practical experience in backend development'
        ]
      },
      suggestedResponsibilities: {
        primary: [
          'Design and develop scalable backend services and APIs',
          'Implement database schemas and optimize query performance',
          'Ensure application security and data protection',
          'Monitor system performance and troubleshoot issues',
          'Write comprehensive tests and maintain code quality'
        ],
        secondary: [
          'Participate in system architecture decisions',
          'Contribute to technical documentation and best practices',
          'Mentor junior developers and conduct code reviews',
          'Research and evaluate new technologies and tools'
        ],
        collaboration: [
          'Work with frontend developers to define API contracts',
          'Collaborate with DevOps team on deployment and infrastructure',
          'Partner with product managers to understand requirements',
          'Coordinate with QA team for testing and quality assurance'
        ]
      },
      suggestedSkills: {
        technical: ['Python/Java/Node.js', 'SQL', 'REST APIs', 'Docker', 'AWS/Azure', 'Git', 'Linux'],
        soft: ['Analytical Thinking', 'Problem Solving', 'Communication', 'Team Leadership', 'Continuous Learning'],
        tools: ['IDE/Editor', 'Database Management Tools', 'API Testing Tools', 'Monitoring Tools', 'CI/CD Platforms']
      },
      salaryRange: {
        min: titleLower.includes('senior') ? 95000 : titleLower.includes('junior') ? 55000 : 75000,
        max: titleLower.includes('senior') ? 140000 : titleLower.includes('junior') ? 75000 : 110000,
        currency: 'USD'
      },
      confidence: 85
    };
  }
  
  // Generic fallback for other roles
  else {
    analysis = {
      suggestedScope: {
        overview: `Contribute to the ${department || 'team'} by leveraging your expertise in ${jobTitle.toLowerCase()}. Work collaboratively to achieve organizational goals and deliver high-quality results.`,
        keyObjectives: [
          `Execute core responsibilities related to ${jobTitle.toLowerCase()}`,
          'Collaborate effectively with team members and stakeholders',
          'Contribute to continuous improvement and innovation',
          'Maintain high standards of quality and professionalism'
        ],
        impactAreas: [
          'Team Performance and Collaboration',
          'Quality and Standards Maintenance',
          'Process Improvement and Innovation',
          'Stakeholder Satisfaction'
        ]
      },
      suggestedRequirements: {
        essential: [
          `Relevant experience in ${jobTitle.toLowerCase()} or related field`,
          'Strong communication and interpersonal skills',
          'Ability to work independently and as part of a team',
          'Problem-solving and analytical thinking abilities',
          'Commitment to continuous learning and improvement'
        ],
        preferred: [
          'Advanced degree or professional certifications',
          'Experience with industry-standard tools and technologies',
          'Leadership or mentoring experience',
          'Cross-functional collaboration experience',
          'Innovation and process improvement experience'
        ],
        experience: titleLower.includes('senior') ? '5+ years of relevant experience' : 
                   titleLower.includes('junior') || titleLower.includes('entry') ? '1-2 years of relevant experience' : 
                   '3+ years of relevant experience',
        education: [
          'Bachelor\'s degree in relevant field',
          'Equivalent practical experience',
          'Professional certifications preferred'
        ]
      },
      suggestedResponsibilities: {
        primary: [
          `Perform core duties related to ${jobTitle.toLowerCase()}`,
          'Collaborate with team members to achieve project goals',
          'Maintain quality standards and best practices',
          'Contribute to team meetings and planning sessions',
          'Complete assigned tasks within established timelines'
        ],
        secondary: [
          'Participate in professional development activities',
          'Assist with training and onboarding of new team members',
          'Contribute to process improvement initiatives',
          'Support cross-functional projects as needed'
        ],
        collaboration: [
          'Work closely with immediate team members',
          'Communicate effectively with stakeholders',
          'Participate in cross-departmental initiatives',
          'Share knowledge and best practices with colleagues'
        ]
      },
      suggestedSkills: {
        technical: ['Industry-specific tools', 'Software proficiency', 'Technical documentation', 'Data analysis'],
        soft: ['Communication', 'Problem Solving', 'Team Collaboration', 'Adaptability', 'Time Management'],
        tools: ['Microsoft Office', 'Project Management Tools', 'Communication Platforms', 'Industry Software']
      },
      salaryRange: {
        min: titleLower.includes('senior') ? 80000 : titleLower.includes('junior') || titleLower.includes('entry') ? 45000 : 60000,
        max: titleLower.includes('senior') ? 120000 : titleLower.includes('junior') || titleLower.includes('entry') ? 65000 : 90000,
        currency: 'USD'
      },
      confidence: 60
    };
  }

  // Adjust salary based on location if provided
  if (location) {
    const locationLower = location.toLowerCase();
    let locationMultiplier = 1.0;
    
    if (locationLower.includes('san francisco') || locationLower.includes('silicon valley') || locationLower.includes('palo alto')) {
      locationMultiplier = 1.4;
    } else if (locationLower.includes('new york') || locationLower.includes('seattle') || locationLower.includes('boston')) {
      locationMultiplier = 1.3;
    } else if (locationLower.includes('los angeles') || locationLower.includes('chicago') || locationLower.includes('washington')) {
      locationMultiplier = 1.2;
    } else if (locationLower.includes('remote')) {
      locationMultiplier = 1.1;
    } else if (locationLower.includes('austin') || locationLower.includes('denver') || locationLower.includes('atlanta')) {
      locationMultiplier = 1.0;
    }
    
    analysis.salaryRange.min = Math.round(analysis.salaryRange.min * locationMultiplier);
    analysis.salaryRange.max = Math.round(analysis.salaryRange.max * locationMultiplier);
  }

  return analysis;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as JobAnalysisRequest;
    const { jobTitle, jobDescription, department, location, jobType } = body;

    // Validate required fields
    if (!jobTitle || jobTitle.trim().length === 0) {
      return NextResponse.json(
        { error: 'Job title is required for analysis' },
        { status: 400 }
      );
    }

    console.log('Analyzing job:', { jobTitle, department, location, jobType });

    // Perform AI analysis
    const analysis = await analyzeJobWithAI(body);

    console.log('Analysis completed with confidence:', analysis.confidence);

    return NextResponse.json(analysis, { status: 200 });

  } catch (error) {
    console.error('Error in /api/jobs/analyze:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
