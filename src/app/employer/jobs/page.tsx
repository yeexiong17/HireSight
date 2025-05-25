'use client';

import React, { useState } from 'react';
import { Briefcase, PlusCircle, ExternalLink, Search, Filter, Linkedin, Disc, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import NewJobModal from '@/components/employee/NewJobModal'; // Import the modal
import JobDetailsModal from '@/components/employee/JobDetailsModal'; // Import the new JobDetailsModal
import { useRouter } from 'next/navigation';
import { getCandidatesByJobId, getCandidatesCountByJob } from '@/lib/mock-db/utils';
import type { CandidateStatus } from '@/lib/mock-db/types';

// Define a type for our job objects for better type safety
interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  datePosted: string;
  status: 'Open' | 'Closed' | 'Draft'; // Example statuses
  description: string;
  platforms: string[];
  // Add other relevant fields from your modal if needed
  requirements?: string;
  responsibilities?: string;
  salaryMin?: string | number;
  salaryMax?: string | number;
  aiInterviewerId?: string; // Ensure this is part of the JobPost interface if it comes from new job creation
}

// Mock data for job posts - replace with API call in future
const initialMockJobs: JobPost[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    department: 'Technology',
    location: 'Remote',
    type: 'Full-time',
    datePosted: '2024-07-15',
    status: 'Open',
    description: 'Join our dynamic team to build cutting-edge user interfaces for our flagship product. You will be responsible for...',
    platforms: ['LinkedIn', 'JobStreet'],
  },
  {
    id: 'job-2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    datePosted: '2024-07-10',
    status: 'Open',
    description: 'Lead the product vision and strategy for our new mobile app. Work closely with engineering, design, and marketing teams...',
    platforms: ['LinkedIn'],
  },
  {
    id: 'job-3',
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Contract',
    datePosted: '2024-07-05',
    status: 'Closed',
    description: 'Craft beautiful and intuitive user experiences for web and mobile applications. Collaborate with product managers and developers...',
    platforms: [],
  },
  {
    id: 'job-4',
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'San Francisco, CA',
    type: 'Full-time',
    datePosted: '2024-06-28',
    status: 'Open',
    description: 'Develop and execute innovative marketing campaigns across various channels. Analyze market trends and customer insights...',
    platforms: ['JobStreet'],
  },
];

// Platform Icons Mapping
const platformIcons: { [key: string]: React.ElementType } = {
  LinkedIn: Linkedin,
  JobStreet: Disc, // Using Disc as a placeholder, consider a more specific icon or image
};


export default function EmployeeJobPostsPage() {
  const [jobs, setJobs] = useState<JobPost[]>(initialMockJobs);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobPost | null>(null);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const router = useRouter();
  // TODO: Add state for filters

  const handlePostNewJob = (newJobData: any) => {
    // In a real app, this would involve an API call.
    // For now, we'll add it to our local state with some defaults.
    const newId = (Math.random() * 1000000).toFixed(0); // simple unique ID
    const platformsToPost = [];
    if (newJobData.autoPostLinkedIn) platformsToPost.push('LinkedIn');
    if (newJobData.autoPostJobStreet) platformsToPost.push('JobStreet');

    const newJob: JobPost = {
      ...newJobData,
      id: `job-${newId}`, // Keep the job-prefix format
      datePosted: new Date().toISOString().split('T')[0], // Today's date
      status: 'Open', // Default status
      platforms: platformsToPost,
    };
    setJobs(prevJobs => [newJob, ...prevJobs]);
    console.log("New job posted:", newJob);
    setIsNewJobModalOpen(false); // Close modal after posting
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (job: JobPost) => {
    setSelectedJobForDetails(job);
    setIsJobDetailsModalOpen(true);
  };

  // Get candidate count for a job
  const getCandidateCount = (jobId: string) => {
    const candidates = getCandidatesByJobId(jobId);
    return candidates.length;
  };

  const getStatusIcon = (status: CandidateStatus) => {
    switch (status) {
      case 'Hired':
        return <CheckCircle size={14} className="text-green-600" />;
      case 'In Progress':
        return <Clock size={14} className="text-yellow-600" />;
      case 'Completed':
        return <CheckCircle size={14} className="text-blue-600" />;
      case 'Rejected':
        return <XCircle size={14} className="text-red-600" />;
      default:
        return <Clock size={14} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case 'Hired':
        return 'text-green-600 bg-green-50';
      case 'In Progress':
        return 'text-yellow-600 bg-yellow-50';
      case 'Completed':
        return 'text-blue-600 bg-blue-50';
      case 'Rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <h1 className="text-3xl font-bold text-slate-800">Job Postings</h1>
          <button
            onClick={() => setIsNewJobModalOpen(true)}
            className="mt-4 md:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150"
          >
            <PlusCircle size={20} className="mr-2" />
            Post New Job
          </button>
        </div>
        <p className="mt-2 text-slate-600">Manage and create job postings for your organization.</p>
      </header>

      {/* Search and Filters */}
      <section className="mb-6 p-4 bg-white shadow rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, department, or location..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center md:justify-start bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg border border-slate-300 transition-colors">
            <Filter size={18} className="mr-2" />
            Filters {/* TODO: Implement filter functionality */}
          </button>
        </div>
      </section>

      {/* Job Listings */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => {
            const candidateCount = getCandidateCount(job.id);
            const statusCounts = getCandidatesCountByJob(job.id);
            
            return (
              <div key={job.id} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                      {/* TODO: Link to a job details page: /employee/jobs/[jobId] */}
                      <a href={`#`}>{job.title}</a>
                    </h2>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      job.status === 'Open' ? 'bg-green-100 text-green-700' :
                      job.status === 'Closed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700' // Default for Draft or other statuses
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">{job.department} • {job.location}</p>
                  <p className="text-sm text-slate-500 mb-3">{job.type} • Posted: {job.datePosted}</p>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div>
                  {/* Candidate Status Breakdown */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Interview Status:</h4>
                    <div className="space-y-1.5">
                      {(Object.entries(statusCounts) as [CandidateStatus, number][]).map(([status, count]) => (
                        count > 0 && (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getStatusIcon(status)}
                              <span className={`text-xs ml-1.5 ${getStatusColor(status)} px-2 py-0.5 rounded-full`}>
                                {status}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-slate-600">{count}</span>
                          </div>
                        )
                      ))}
                      {Object.values(statusCounts).every(count => count === 0) && (
                        <p className="text-xs text-slate-400 italic">No candidates yet</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Posted On:</h4>
                    {job.platforms && job.platforms.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        {job.platforms.map(platformName => {
                          const IconComponent = platformIcons[platformName];
                          return IconComponent ? (
                            <IconComponent key={platformName} size={20} className="text-slate-600" title={platformName} />
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Not posted on external platforms.</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center bg-transparent border-none p-0 cursor-pointer"
                      >
                        View Details <ExternalLink size={16} className="ml-1" />
                      </button>
                      <button
                        onClick={() => router.push(`/employer/jobs/${job.id}/candidates`)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center bg-transparent border-none p-0 cursor-pointer ml-4"
                      >
                        <Users size={16} className="mr-1" /> View Candidates ({candidateCount})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filteredJobs.length === 0 && (
          <div className="text-center py-10">
            <Briefcase size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">No job postings found{searchTerm ? ' matching your search' : ''}.</p>
            {!searchTerm && (
              <p className="text-sm text-slate-400">Click "Post New Job" to get started.</p>
            )}
          </div>
        )}
      </section>

      <NewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onJobPost={handlePostNewJob}
      />
      <JobDetailsModal
        isOpen={isJobDetailsModalOpen}
        onClose={() => setIsJobDetailsModalOpen(false)}
        job={selectedJobForDetails}
      />
    </div>
  );
} 