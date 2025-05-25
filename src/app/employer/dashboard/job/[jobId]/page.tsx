'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  email: string;
  interviewDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Hired' | 'Rejected';
  scores: {
    overall: number;
    technical: number;
    communication: number;
    problemSolving: number;
  };
}

interface JobDetails {
  id: string;
  title: string;
  department: string;
  location: string;
  candidates: Candidate[];
}

// Mock data - replace with actual API call
const getMockJobDetails = (jobId: string): JobDetails => {
  return {
    id: jobId,
    title: 'Senior Software Engineer (Frontend)',
    department: 'Technology',
    location: 'Remote',
    candidates: [
      {
        id: 'c1',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        interviewDate: '2024-03-15',
        status: 'Completed',
        scores: {
          overall: 85,
          technical: 88,
          communication: 82,
          problemSolving: 85
        }
      },
      {
        id: 'c2',
        name: 'Bob Smith',
        email: 'bob.s@example.com',
        interviewDate: '2024-03-14',
        status: 'Hired',
        scores: {
          overall: 92,
          technical: 95,
          communication: 88,
          problemSolving: 93
        }
      },
      {
        id: 'c3',
        name: 'Carol White',
        email: 'carol.w@example.com',
        interviewDate: '2024-03-13',
        status: 'In Progress',
        scores: {
          overall: 72,
          technical: 75,
          communication: 70,
          problemSolving: 71
        }
      }
    ]
  };
};

const getStatusColor = (status: Candidate['status']) => {
  switch (status) {
    case 'Hired':
      return 'bg-green-100 text-green-700';
    case 'Completed':
      return 'bg-blue-100 text-blue-700';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-700';
    case 'Rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export default function JobCandidatesPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const jobDetails = getMockJobDetails(jobId);

  return (
    <div className="p-6">
      <header className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-600 hover:text-slate-800 mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Jobs
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{jobDetails.title}</h1>
            <p className="text-slate-600 mt-1">
              {jobDetails.department} • {jobDetails.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-slate-700">
              {jobDetails.candidates.length} Candidates
            </p>
          </div>
        </div>
      </header>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobDetails.candidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{candidate.name}</CardTitle>
                  <p className="text-sm text-slate-500">{candidate.email}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                  {candidate.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Overall Score</span>
                  <span className="font-semibold text-slate-700">{candidate.scores.overall}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Technical</span>
                  <span className="font-semibold text-slate-700">{candidate.scores.technical}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Communication</span>
                  <span className="font-semibold text-slate-700">{candidate.scores.communication}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Problem Solving</span>
                  <span className="font-semibold text-slate-700">{candidate.scores.problemSolving}%</span>
                </div>
                <div className="pt-2 text-sm text-slate-500">
                  Interview Date: {candidate.interviewDate}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => router.push(`/employer/performance/candidate/${candidate.id}`)}
              >
                View Full Report
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {jobDetails.candidates.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <AlertTriangle className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-600 mb-2">No Candidates Yet</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            There are no candidates for this position yet. Check back once candidates start applying.
          </p>
        </div>
      )}
    </div>
  );
} 