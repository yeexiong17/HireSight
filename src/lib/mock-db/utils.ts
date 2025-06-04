import { jobs, candidates, employers, aiInterviewers, resumes } from "./data";
import {
  Job,
  Candidate,
  CandidateStatus,
  Employer,
  AIInterviewer,
  JobPlatform,
  Resume,
  ResumeStatus,
} from "./types";

// Employer-related utilities
export const getAllEmployers = (): Employer[] => {
  return employers;
};

export const getEmployerById = (employerId: string): Employer | undefined => {
  return employers.find((employer) => employer.id === employerId);
};

export const getEmployerByCompanyName = (
  companyName: string
): Employer | undefined => {
  return employers.find((employer) => employer.companyName === companyName);
};

// AI Interviewer-related utilities
export const getAllAIInterviewers = (): AIInterviewer[] => {
  return aiInterviewers;
};

export const getAIInterviewerById = (
  interviewerId: string
): AIInterviewer | undefined => {
  return aiInterviewers.find((interviewer) => interviewer.id === interviewerId);
};

export const getActiveAIInterviewers = (): AIInterviewer[] => {
  return aiInterviewers.filter((interviewer) => interviewer.active);
};

export const getAIInterviewersBySpecialization = (
  specialization: string
): AIInterviewer[] => {
  return aiInterviewers.filter((interviewer) =>
    interviewer.specialization.some((spec) =>
      spec.toLowerCase().includes(specialization.toLowerCase())
    )
  );
};

// Resume-related utilities
export const getAllResumes = (): Resume[] => {
  return resumes;
};

export const getResumeById = (resumeId: string): Resume | undefined => {
  return resumes.find((resume) => resume.id === resumeId);
};

export const getResumeByJobId = (jobId: string): Resume[] => {
  return resumes.filter((resume) => resume.jobId === jobId);
};

export const getResumeByCandidateId = (
  candidateId: string
): Resume | undefined => {
  return resumes.find((resume) => resume.candidateId === candidateId);
};

export const getResumesByStatus = (status: ResumeStatus): Resume[] => {
  return resumes.filter((resume) => resume.status === status);
};

export const getResumeStats = () => {
  const total = resumes.length;
  const pending = resumes.filter((r) => r.status === "Pending").length;
  const approved = resumes.filter((r) => r.status === "Approved").length;
  const rejected = resumes.filter((r) => r.status === "Rejected").length;

  return {
    total,
    pending,
    approved,
    rejected,
  };
};

// Job-related utilities
export const getAllJobs = (): Job[] => {
  return jobs;
};

export const getJobById = (jobId: string): Job | undefined => {
  return jobs.find((job) => job.id === jobId);
};

export const getJobsByEmployer = (companyName: string): Job[] => {
  return jobs.filter((job) => job.company === companyName);
};

export const getJobsByPlatform = (platform: JobPlatform): Job[] => {
  return jobs.filter((job) => job.platforms.includes(platform));
};

export const getJobsByStatus = (status: "Open" | "Closed" | "Draft"): Job[] => {
  return jobs.filter((job) => job.status === status);
};

export const getJobsBySalaryRange = (
  minSalary: number,
  maxSalary: number
): Job[] => {
  return jobs.filter((job) => {
    if (!job.salaryRange) return false;
    return job.salaryRange.min <= maxSalary && job.salaryRange.max >= minSalary;
  });
};

export const getJobStats = (jobId: string) => {
  const candidates = getCandidatesByJobId(jobId);
  return {
    totalCandidates: candidates.length,
    inProgress: candidates.filter((c) => c.status === "In Progress").length,
    completed: candidates.filter((c) => c.status === "Completed").length,
    hired: candidates.filter((c) => c.status === "Hired").length,
  };
};

export const getJobPostedPlatforms = (jobId: string): string[] => {
  const job = getJobById(jobId);
  return job?.platforms || [];
};

// Candidate-related utilities
export const getAllCandidates = (): Candidate[] => {
  return candidates;
};

export const getCandidateById = (
  candidateId: string
): Candidate | undefined => {
  return candidates.find((candidate) => candidate.id === candidateId);
};

export const getCandidatesByJobId = (jobId: string): Candidate[] => {
  return candidates.filter((candidate) => candidate.jobId === jobId);
};

export const getCandidatesByStatus = (status: CandidateStatus): Candidate[] => {
  return candidates.filter((candidate) => candidate.status === status);
};

export const getCandidatesCountByJob = (
  jobId: string
): { [key in CandidateStatus]: number } => {
  const jobCandidates = getCandidatesByJobId(jobId);
  return {
    Pending: jobCandidates.filter((c) => c.status === "Pending").length,
    "In Progress": jobCandidates.filter((c) => c.status === "In Progress")
      .length,
    Completed: jobCandidates.filter((c) => c.status === "Completed").length,
    Hired: jobCandidates.filter((c) => c.status === "Hired").length,
    Rejected: jobCandidates.filter((c) => c.status === "Rejected").length,
  };
};

export const getTopCandidatesByJob = (
  jobId: string,
  limit: number = 5
): Candidate[] => {
  return getCandidatesByJobId(jobId)
    .filter(
      (candidate) =>
        candidate.status === "Completed" || candidate.status === "Hired"
    )
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, limit);
};

// Search utilities
export const searchJobs = (query: string): Job[] => {
  const searchTerm = query.toLowerCase();
  return jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm) ||
      job.department.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm)
  );
};

export const searchCandidates = (query: string): Candidate[] => {
  const searchTerm = query.toLowerCase();
  return candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchTerm) ||
      candidate.email.toLowerCase().includes(searchTerm)
  );
};

export const searchEmployers = (query: string): Employer[] => {
  const searchTerm = query.toLowerCase();
  return employers.filter(
    (employer) =>
      employer.companyName.toLowerCase().includes(searchTerm) ||
      employer.industry.toLowerCase().includes(searchTerm) ||
      employer.description.toLowerCase().includes(searchTerm)
  );
};

export const searchResumes = (query: string): Resume[] => {
  const searchTerm = query.toLowerCase();
  return resumes.filter(
    (resume) =>
      resume.fileName.toLowerCase().includes(searchTerm) ||
      resume.extractedData.name.toLowerCase().includes(searchTerm) ||
      resume.extractedData.email.toLowerCase().includes(searchTerm)
  );
};

// Utility functions specifically for the UI
export const getJobSummary = (jobId: string) => {
  const job = getJobById(jobId);
  if (!job) return null;

  const candidateStats = getCandidatesCountByJob(jobId);
  const platforms = getJobPostedPlatforms(jobId);

  return {
    title: job.title,
    department: job.department,
    location: job.location,
    type: job.type,
    status: job.status,
    postedDate: job.createdAt,
    description: job.description,
    interviewStatus: {
      inProgress: candidateStats["In Progress"],
      completed: candidateStats["Completed"],
      hired: candidateStats["Hired"],
    },
    platforms: platforms,
    totalCandidates: Object.values(candidateStats).reduce((a, b) => a + b, 0),
  };
};

export const getCandidateSummary = (candidateId: string) => {
  const candidate = getCandidateById(candidateId);
  if (!candidate) return null;

  return {
    name: candidate.name,
    email: candidate.email,
    status: candidate.status,
    scores: candidate.scores,
    interviewDate: candidate.interviewDate,
  };
};
