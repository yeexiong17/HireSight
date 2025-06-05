export type JobStatus = "Open" | "Closed" | "Draft";
export type CandidateStatus =
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Hired"
  | "Rejected";
export type JobPlatform =
  | "LinkedIn"
  | "JobStreet"
  | "Indeed"
  | "Company Website";
export type ResumeStatus = "Pending" | "Approved" | "Rejected";

export interface Job {
  id: string;
  title: string;
  company: string;
  department: string;
  location: string;
  type: string; // e.g., 'Full-time', 'Part-time', 'Contract'
  status: JobStatus;
  description: string;
  requirements: string[];
  responsibilities: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  benefits?: string[];
  platforms: JobPlatform[];
  aiInterviewerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateScores {
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
}

export interface CandidateFeedback {
  strengths: string[];
  improvements: string[];
  technicalNotes: string;
  communicationNotes: string;
  problemSolvingNotes: string;
  overallRecommendation?: "Strong Hire" | "Hire" | "No Hire" | "Strong No Hire";
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  evaluation: string;
  score?: number;
}

export interface Resume {
  id: string;
  candidateId: string;
  jobId: string;
  jobTitle: string;
  fileName: string;
  uploadDate: string;
  status: ResumeStatus;
  confidence: number;
  fieldsExtracted: number;
  extractedData: {
    name: string;
    email: string;
    phone: string;
    experience: string;
    education: string[];
    skills: string[];
    location?: string;
  };
  aiDetection: {
    isDetected: boolean;
    confidence: number;
    details: {
      overallScore: number;
      patterns: string[];
      suspiciousAreas: string[];
      humanLikeFeatures: string[];
    };
  };
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  status: CandidateStatus;
  resumeId?: string;
  resumeUrl: string;
  interviewDate: string;
  scores: CandidateScores;
  feedback: CandidateFeedback;
  interviewTranscript: InterviewQuestion[];
  experienceYears?: number;
  currentCompany?: string;
  expectedSalary?: number;
  noticePeriod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employer {
  id: string;
  companyName: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  website: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIInterviewer {
  id: string;
  name: string;
  specialization: string[];
  description: string;
  personality: string;
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
