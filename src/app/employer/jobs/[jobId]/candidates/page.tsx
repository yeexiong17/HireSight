'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getJobById, getCandidatesByJobId } from '@/lib/mock-db/utils';
import type { CandidateStatus } from '@/lib/mock-db/types';

const getStatusColor = (status: CandidateStatus) => {
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
  
  const job = getJobById(jobId);
  const candidates = getCandidatesByJobId(jobId);

  if (!job) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-slate-400 mb-4" />
        <h2 className="text-xl font-semibold text-slate-600 mb-2">Job Not Found</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-4">
          The job position you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-slate-800">{job.title}</h1>
            <p className="text-slate-600 mt-1">
              {job.department} • {job.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-slate-700">
              {candidates.length} Candidates
            </p>
          </div>
        </div>
      </header>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {candidates.map((candidate) => (
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
                  Interview Date: {new Date(candidate.interviewDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant="outline"
                onClick={() => router.push(`/employer/jobs/${jobId}/candidates/${candidate.id}`)}
              >
                View Full Report
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {candidates.length === 0 && (
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