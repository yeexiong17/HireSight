'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, CheckCircle, Clock, AlertTriangle, FileText, MessageSquare, Brain, Code, UserCheck, UserX } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCandidateById, getJobById } from '@/lib/mock-db/utils';
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

interface ConfirmationDialog {
  isOpen: boolean;
  action: 'hire' | 'reject' | null;
  title: string;
  description: string;
}

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.candidateId as string;
  const jobId = params.jobId as string;
  
  const candidate = getCandidateById(candidateId);
  const job = getJobById(jobId);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialog>({
    isOpen: false,
    action: null,
    title: '',
    description: ''
  });

  if (!candidate || !job) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-slate-400 mb-4" />
        <h2 className="text-xl font-semibold text-slate-600 mb-2">Candidate Not Found</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-4">
          The candidate you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const handleActionClick = (action: 'hire' | 'reject') => {
    setConfirmDialog({
      isOpen: true,
      action,
      title: action === 'hire' ? 'Confirm Hire' : 'Confirm Rejection',
      description: action === 'hire' 
        ? `Are you sure you want to hire ${candidate.name}? This will update their status and notify them.`
        : `Are you sure you want to reject ${candidate.name}? This action cannot be undone.`
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.action) return;

    try {
      // TODO: Replace with actual API call
      console.log(`Candidate ${candidateId} ${confirmDialog.action}d`);
      
      // Close dialog and refresh page or redirect
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      router.refresh();
    } catch (error) {
      console.error('Error updating candidate status:', error);
    }
  };

  const renderActionButtons = () => {
    switch (candidate.status) {
      case 'Completed':
        return (
          <>
            <Button
              onClick={() => handleActionClick('hire')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Hire Candidate
            </Button>
            <Button
              onClick={() => handleActionClick('reject')}
              variant="destructive"
            >
              <UserX className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </>
        );
      case 'In Progress':
        return (
          <p className="text-sm text-slate-600 mr-3">
            <Clock className="h-4 w-4 inline mr-1" />
            Interview in progress
          </p>
        );
      case 'Hired':
        return (
          <p className="text-sm text-green-600 mr-3">
            <CheckCircle className="h-4 w-4 inline mr-1" />
            Candidate hired
          </p>
        );
      case 'Rejected':
        return (
          <p className="text-sm text-red-600 mr-3">
            <UserX className="h-4 w-4 inline mr-1" />
            Candidate rejected
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-slate-600 hover:text-slate-800 mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Candidates
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{candidate.name}</h1>
            <p className="text-slate-600 mt-1">{candidate.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {renderActionButtons()}
            <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
              {candidate.status}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scores Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Performance Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">Overall Score</span>
                  <span className="text-sm font-semibold text-slate-900">{candidate.scores.overall}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${candidate.scores.overall}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">Technical</span>
                  <span className="text-sm font-semibold text-slate-900">{candidate.scores.technical}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${candidate.scores.technical}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">Communication</span>
                  <span className="text-sm font-semibold text-slate-900">{candidate.scores.communication}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${candidate.scores.communication}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">Problem Solving</span>
                  <span className="text-sm font-semibold text-slate-900">{candidate.scores.problemSolving}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${candidate.scores.problemSolving}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Observations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Key Observations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Strengths</h3>
                <ul className="list-disc list-inside space-y-1">
                  {candidate.feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-slate-600">{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Areas for Improvement</h3>
                <ul className="list-disc list-inside space-y-1">
                  {candidate.feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-slate-600">{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feedback */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
              Detailed Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                  <Code className="h-4 w-4 mr-1" />
                  Technical Assessment
                </h3>
                <p className="text-sm text-slate-600">{candidate.feedback.technicalNotes}</p>
              </div>
              <div>
                <h3 className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Communication Assessment
                </h3>
                <p className="text-sm text-slate-600">{candidate.feedback.communicationNotes}</p>
              </div>
              <div>
                <h3 className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                  <Brain className="h-4 w-4 mr-1" />
                  Problem-Solving Approach
                </h3>
                <p className="text-sm text-slate-600">{candidate.feedback.problemSolvingNotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Transcript */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-500" />
              Interview Transcript
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {candidate.interviewTranscript.map((item, index) => (
                <div key={index} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Q: {item.question}</h3>
                  <p className="text-sm text-slate-600 mb-2">A: {item.answer}</p>
                  <p className="text-sm text-slate-500 italic">Evaluation: {item.evaluation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(isOpen) => setConfirmDialog(prev => ({ ...prev, isOpen }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'hire' ? 'default' : 'destructive'}
              onClick={handleConfirmAction}
            >
              {confirmDialog.action === 'hire' ? 'Confirm Hire' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 