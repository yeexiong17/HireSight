'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, CheckCircle, Clock, AlertTriangle, FileText, MessageSquare, Brain, Code } from 'lucide-react';

interface CandidateDetail {
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
  feedback: {
    strengths: string[];
    improvements: string[];
    technicalNotes: string;
    communicationNotes: string;
    problemSolvingNotes: string;
  };
  interviewTranscript: {
    question: string;
    answer: string;
    evaluation: string;
  }[];
}

// Mock data - replace with actual API call
const getMockCandidateDetails = (candidateId: string): CandidateDetail => {
  return {
    id: candidateId,
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    interviewDate: '2024-03-15',
    status: 'Completed',
    scores: {
      overall: 85,
      technical: 88,
      communication: 82,
      problemSolving: 85
    },
    feedback: {
      strengths: [
        'Strong understanding of React and modern JavaScript',
        'Excellent problem-solving approach',
        'Clear communication of technical concepts'
      ],
      improvements: [
        'Could improve on system design considerations',
        'More focus on edge cases during problem-solving'
      ],
      technicalNotes: 'Demonstrated strong knowledge of frontend technologies, particularly React hooks and state management. Good understanding of performance optimization.',
      communicationNotes: 'Articulate in explaining technical decisions and trade-offs. Maintains professional demeanor throughout.',
      problemSolvingNotes: 'Methodical approach to problem-solving. Good at breaking down complex problems into manageable parts.'
    },
    interviewTranscript: [
      {
        question: 'Can you explain your approach to state management in React applications?',
        answer: 'I typically start with local state using useState for component-level state. For more complex applications, I evaluate whether Redux or Context API would be more appropriate based on the application\'s needs.',
        evaluation: 'Strong understanding of state management concepts and trade-offs between different approaches.'
      },
      {
        question: 'How would you optimize the performance of a React application?',
        answer: 'I focus on several key areas: proper use of React.memo and useMemo for expensive computations, implementing code splitting with React.lazy, and ensuring efficient re-renders...',
        evaluation: 'Comprehensive knowledge of React performance optimization techniques.'
      }
    ]
  };
};

const getStatusColor = (status: CandidateDetail['status']) => {
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

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.candidateId as string;
  const jobId = params.jobId as string;
  const candidate = getMockCandidateDetails(candidateId);

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
          <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
            {candidate.status}
          </span>
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
    </div>
  );
} 