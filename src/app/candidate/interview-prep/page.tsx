'use client';

import { useState, useEffect } from 'react';
import CandidateInterviewFlow from '@/components/candidate-interview-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Node, Edge } from 'reactflow';
import type { InterviewStageConfig } from '@/types/interview-config';

// This would come from your API in a real application
const mockInterviewData: {
  nodes: Node<InterviewStageConfig>[];
  edges: Edge[];
  currentStage: string;
  scheduledTime: string;
  jobTitle: string;
  company: string;
} = {
  nodes: [
    {
      id: 'initial-screening-1',
      type: 'interviewStage',
      position: { x: 0, y: 100 },
      data: {
        label: 'Initial Screening',
        config: {
          questions: ['Tell us about yourself', 'Why are you interested in this role?'],
          duration: '00:05',
          type: 'screening' as const
        }
      }
    },
    {
      id: 'technical-assessment-1',
      type: 'interviewStage',
      position: { x: 300, y: 100 },
      data: {
        label: 'Technical Assessment',
        config: {
          questions: ['System design question', 'Coding challenge'],
          duration: '00:45',
          type: 'technical' as const
        }
      }
    },
    {
      id: 'final-interview-1',
      type: 'interviewStage',
      position: { x: 600, y: 100 },
      data: {
        label: 'Final Interview',
        config: {
          questions: ['Cultural fit questions', 'Team collaboration scenarios'],
          duration: '00:15',
          type: 'behavioral' as const
        }
      }
    }
  ],
  edges: [
    {
      id: 'initial-to-technical',
      source: 'initial-screening-1',
      target: 'technical-assessment-1',
    },
    {
      id: 'technical-to-final',
      source: 'technical-assessment-1',
      target: 'final-interview-1',
    }
  ],
  currentStage: 'initial-screening-1',
  scheduledTime: '2024-03-20T14:00:00Z',
  jobTitle: 'Senior Frontend Developer',
  company: 'TechCorp Inc.',
};

export default function InterviewPrepPage() {
  const [interviewData, setInterviewData] = useState(mockInterviewData);
  const scheduledDate = new Date(interviewData.scheduledTime);

  const formatTimeUntilInterview = () => {
    const now = new Date();
    const diff = scheduledDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} days ${hours} hours`;
    } else if (hours > 0) {
      return `${hours} hours ${minutes} minutes`;
    } else {
      return `${minutes} minutes`;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Interview Preparation</h1>
        <p className="text-slate-600">
          Get ready for your upcoming interview at {interviewData.company}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Time Until Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{formatTimeUntilInterview()}</p>
            <p className="text-sm text-slate-600 mt-1">
              Scheduled for {scheduledDate.toLocaleDateString()} at{' '}
              {scheduledDate.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{interviewData.jobTitle}</p>
            <p className="text-sm text-slate-600 mt-1">{interviewData.company}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              Current Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">
              {interviewData.nodes.find(node => node.id === interviewData.currentStage)?.data.label}
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {interviewData.nodes.findIndex(node => node.id === interviewData.currentStage) + 1} of{' '}
              {interviewData.nodes.length} stages
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Process</CardTitle>
          <CardDescription>
            Below is your interview workflow. The highlighted stage is your current position in the process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CandidateInterviewFlow
            nodes={interviewData.nodes}
            edges={interviewData.edges}
            currentStage={interviewData.currentStage}
          />
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Join Interview Room
        </Button>
      </div>
    </div>
  );
} 