import { jobs, candidates } from './data';
import { Job, Candidate, CandidateStatus } from './types';

// Job-related utilities
export const getAllJobs = (): Job[] => {
  return jobs;
};

export const getJobById = (jobId: string): Job | undefined => {
  return jobs.find(job => job.id === jobId);
};

// Candidate-related utilities
export const getAllCandidates = (): Candidate[] => {
  return candidates;
};

export const getCandidateById = (candidateId: string): Candidate | undefined => {
  return candidates.find(candidate => candidate.id === candidateId);
};

export const getCandidatesByJobId = (jobId: string): Candidate[] => {
  return candidates.filter(candidate => candidate.jobId === jobId);
};

export const getCandidatesByStatus = (status: CandidateStatus): Candidate[] => {
  return candidates.filter(candidate => candidate.status === status);
};

export const getCandidatesCountByJob = (jobId: string): { [key in CandidateStatus]: number } => {
  const jobCandidates = getCandidatesByJobId(jobId);
  return {
    Pending: jobCandidates.filter(c => c.status === 'Pending').length,
    'In Progress': jobCandidates.filter(c => c.status === 'In Progress').length,
    Completed: jobCandidates.filter(c => c.status === 'Completed').length,
    Hired: jobCandidates.filter(c => c.status === 'Hired').length,
    Rejected: jobCandidates.filter(c => c.status === 'Rejected').length,
  };
};

// Search utilities
export const searchJobs = (query: string): Job[] => {
  const searchTerm = query.toLowerCase();
  return jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm) ||
    job.company.toLowerCase().includes(searchTerm) ||
    job.description.toLowerCase().includes(searchTerm)
  );
};

export const searchCandidates = (query: string): Candidate[] => {
  const searchTerm = query.toLowerCase();
  return candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm) ||
    candidate.email.toLowerCase().includes(searchTerm)
  );
}; 