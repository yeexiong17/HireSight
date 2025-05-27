'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import CandidateInterviewFlow from '@/components/candidate-interview-flow';
import type { Node, Edge } from 'reactflow';
import type { InterviewStageConfig } from '@/types/interview-config';

// This would come from your API in a real application
const mockInterviewFlow: {
  nodes: Node<InterviewStageConfig>[];
  edges: Edge[];
} = {
  nodes: [
    {
      id: 'resume-screening-1',
      type: 'interviewStage',
      position: { x: 0, y: 100 },
      data: {
        label: 'Resume Screening',
        config: {
          questions: [],
          duration: '00:05',
          type: 'screening' as const
        }
      }
    },
    {
      id: 'initial-screening-1',
      type: 'interviewStage',
      position: { x: 300, y: 100 },
      data: {
        label: 'Initial Screening',
        config: {
          questions: ['Tell us about yourself', 'Why are you interested in this role?'],
          duration: '00:15',
          type: 'screening' as const
        }
      }
    },
    {
      id: 'technical-assessment-1',
      type: 'interviewStage',
      position: { x: 600, y: 100 },
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
      position: { x: 900, y: 100 },
      data: {
        label: 'Final Interview',
        config: {
          questions: ['Cultural fit questions', 'Team collaboration scenarios'],
          duration: '00:30',
          type: 'behavioral' as const
        }
      }
    }
  ],
  edges: [
    {
      id: 'resume-to-initial',
      source: 'resume-screening-1',
      target: 'initial-screening-1',
    },
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
  ]
};

export default function SubmitResumePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Submit Your Resume</h1>
          <p className="text-slate-600">
            Upload your resume to begin the interview process
          </p>
        </div>

        {!isSubmitted ? (
          <Card>
            <CardHeader>
              <CardTitle>Resume Upload</CardTitle>
              <CardDescription>
                Please upload your resume in PDF or Word format (max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="resume">Resume</Label>
                    <div className="grid gap-3">
                      <Label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        {selectedFile ? (
                          <div className="flex items-center gap-2 text-blue-600">
                            <FileText className="w-6 h-6" />
                            <span className="font-medium">{selectedFile.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-500">
                            <Upload className="w-8 h-8" />
                            <span>Click to upload or drag and drop</span>
                            <span className="text-sm">PDF or Word (max 5MB)</span>
                          </div>
                        )}
                      </Label>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Submit Resume'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card className="border-green-100">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-slate-900">Resume Submitted Successfully!</h3>
                    <p className="text-slate-600">
                      Your resume has been received. Here's what happens next:
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Interview Process</CardTitle>
                <CardDescription>
                  Below is the interview process you'll go through. We'll notify you when it's time for each stage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CandidateInterviewFlow
                  nodes={mockInterviewFlow.nodes}
                  edges={mockInterviewFlow.edges}
                  currentStage="resume-screening-1"
                />
              </CardContent>
            </Card>

            <div className="text-center text-sm text-slate-600">
              <p>
                We'll review your resume and get back to you within 2-3 business days.
                <br />
                You'll receive an email with the next steps once your resume has been reviewed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 