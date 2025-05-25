'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// TODO: Define actual types based on your data model
interface Candidate {
  id: string;
  name: string;
  interviewDate: string;
  overallScore?: number; // Example metric
  status: 'Pending Review' | 'Shortlisted' | 'Rejected' | 'Hired';
}

interface JobDetails {
  jobId: string;
  jobTitle: string;
  candidates: Candidate[];
}

// TODO: Fetch actual data for the specific job and its candidates
const fetchJobPerformanceDetails = (jobId: string): JobDetails | null => {
  // Simulate API call
  if (jobId === 'job001') {
    return {
      jobId: 'job001',
      jobTitle: 'Senior Frontend Developer',
      candidates: [
        { id: 'cand001', name: 'Alice Wonderland', interviewDate: '2024-05-25', overallScore: 85, status: 'Shortlisted' },
        { id: 'cand002', name: 'Bob The Builder', interviewDate: '2024-05-26', overallScore: 72, status: 'Pending Review' },
        { id: 'cand003', name: 'Charlie Brown', interviewDate: '2024-05-27', status: 'Rejected' },
      ],
    };
  }
  if (jobId === 'job002') {
    return {
      jobId: 'job002',
      jobTitle: 'Backend Python Engineer',
      candidates: [
        { id: 'cand004', name: 'Diana Prince', interviewDate: '2024-06-01', overallScore: 92, status: 'Hired' },
        { id: 'cand005', name: 'Edward Elric', interviewDate: '2024-06-02', overallScore: 78, status: 'Shortlisted' },
      ],
    };
  }
  return null;
};

const JobPerformanceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = typeof params.jobId === 'string' ? params.jobId : null;

  // TODO: Add loading state
  const jobDetails = jobId ? fetchJobPerformanceDetails(jobId) : null;

  if (!jobDetails) {
    // TODO: Add a proper not found component or redirect
    return (
      <div className="p-6 flex items-center justify-center">
         <div className="text-center">
           <p className="text-xl text-red-500 mb-4">Job performance details not found.</p>
           <Button 
             onClick={() => router.back()}
             variant="outline"
             className="flex items-center"
           >
             <ChevronLeft className="w-4 h-4 mr-2" />
             Go Back
           </Button>
         </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-8">
        <Button 
          onClick={() => router.push('/employer/performance')}
          variant="outline"
          size="sm"
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1.5" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-slate-800">{jobDetails.jobTitle}</h1>
        <p className="text-slate-600 mt-1">Performance Overview for Job ID: {jobDetails.jobId}</p>
      </header>

      {/* Summary statistics - could be added here */}
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden pb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interview Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobDetails.candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{candidate.interviewDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.overallScore !== undefined ? `${candidate.overallScore}%` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${candidate.status === 'Shortlisted' ? 'bg-green-100 text-green-800' : 
                      candidate.status === 'Hired' ? 'bg-blue-100 text-blue-800' :
                      candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                    `}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      onClick={() => console.log(`View transcript for ${candidate.id}`)} // TODO: Implement proper navigation
                    >
                      View Transcript <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {jobDetails.candidates.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No candidates interviewed for this job yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPerformanceDetailPage; 