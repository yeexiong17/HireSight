export type JobStatus = 'Open' | 'Closed' | 'Draft';
export type CandidateStatus = 'Pending' | 'In Progress' | 'Completed' | 'Hired' | 'Rejected';

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
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  evaluation: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  status: CandidateStatus;
  resumeUrl: string;
  interviewDate: string;
  scores: CandidateScores;
  feedback: CandidateFeedback;
  interviewTranscript: InterviewQuestion[];
  createdAt: string;
  updatedAt: string;
} 