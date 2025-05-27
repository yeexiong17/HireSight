'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, CalendarDays, ArrowLeft, Building, Clock, CheckCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText } from 'lucide-react';
import type { Node, Edge } from 'reactflow';
import type { InterviewStageConfig } from '@/types/interview-config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// This would come from your API/database in a real application
const getJobById = (jobId: string) => {
  // Sample job data - replace with actual API call
  const sampleJobs = [
    {
      id: "job001",
      title: "Senior Frontend Developer",
      companyName: "Grab",
      location: "San Francisco, CA",
      description: "Join our dynamic team to build next-gen web applications using React, Next.js, and TypeScript. Seeking experienced developers with a passion for UI/UX.",
      postedDate: "2024-05-20",
      tags: ["React", "Next.js", "TypeScript", "UI/UX", "Frontend"],
      companyLogo: "https://brandlogos.net/wp-content/uploads/2020/08/grab-logo.png",
      requirements: [
        "5+ years of experience with modern JavaScript frameworks",
        "Strong proficiency in React.js and TypeScript",
        "Experience with Next.js and modern frontend tooling",
        "Understanding of UI/UX principles",
        "Excellent problem-solving skills"
      ],
      responsibilities: [
        "Develop and maintain complex web applications",
        "Collaborate with designers and backend developers",
        "Write clean, maintainable, and efficient code",
        "Participate in code reviews and technical discussions",
        "Mentor junior developers"
      ],
      type: "Full-time",
      experienceLevel: "Senior",
      expectedDuration: "45 minutes"
    },
    {
      id: "job002",
      title: "Backend Python Engineer",
      companyName: "Meta",
      location: "New York, NY",
      description: "We are looking for a skilled Python developer to design and implement robust backend services, APIs, and database solutions. Experience with Django/Flask is a plus.",
      postedDate: "2024-05-18",
      tags: ["Python", "Django", "Flask", "API", "Backend", "SQL"],
      companyLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy3ZqxYhMdW3qa__685iJWJwGQGhV4VCivoQ&s",
      requirements: [
        "3+ years of Python development experience",
        "Strong knowledge of Django or Flask",
        "Experience with RESTful APIs",
        "Database design and optimization skills",
        "Understanding of microservices architecture"
      ],
      responsibilities: [
        "Design and implement backend services",
        "Optimize database performance",
        "Build and maintain APIs",
        "Write technical documentation",
        "Collaborate with frontend teams"
      ],
      type: "Full-time",
      experienceLevel: "Mid-Senior",
      expectedDuration: "60 minutes"
    }
  ];
  
  return sampleJobs.find(job => job.id === jobId);
};

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
    }
  ]
};

// Interview stage details
const interviewStageDetails = {
  'resume-screening-1': {
    title: 'Resume Screening',
    description: 'Our AI system will analyze your resume for relevant skills and experience.',
    duration: '5 minutes',
    waitingTime: '1-2 business days',
    checklist: [
      'Ensure your resume is up to date',
      'Include relevant skills and experience',
      'Check for any formatting issues',
      'Highlight achievements with metrics'
    ],
    resources: [
      {
        title: 'Resume Writing Guide',
        url: 'https://www.example.com/resume-guide'
      },
      {
        title: 'Technical Resume Tips',
        url: 'https://www.example.com/tech-resume'
      }
    ]
  },
  'initial-screening-1': {
    title: 'Initial Screening',
    description: 'A brief conversation to discuss your background and interest in the role.',
    duration: '15 minutes',
    waitingTime: '1-2 business days',
    checklist: [
      'Research the company thoroughly',
      'Prepare your elevator pitch',
      'Review the job description',
      'Prepare questions about the role'
    ],
    resources: [
      {
        title: 'Common Screening Questions',
        url: 'https://www.example.com/screening-prep'
      },
      {
        title: 'Company Research Guide',
        url: 'https://www.example.com/company-research'
      }
    ]
  },
  'technical-assessment-1': {
    title: 'Technical Assessment',
    description: 'In-depth technical interview covering coding and system design.',
    duration: '45 minutes',
    waitingTime: '2-3 business days',
    checklist: [
      'Practice coding problems',
      'Review system design principles',
      'Prepare your development environment',
      'Review key technologies mentioned in job description'
    ],
    resources: [
      {
        title: 'LeetCode Practice Problems',
        url: 'https://leetcode.com'
      },
      {
        title: 'System Design Primer',
        url: 'https://github.com/donnemartin/system-design-primer'
      }
    ]
  }
};

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = typeof params.jobId === 'string' ? params.jobId : null;
  const [resumeSubmitted, setResumeSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const job = jobId ? getJobById(jobId) : null;

  const disabledDays = (date: Date) => {
    return date < new Date() || date > new Date(Date.now() + 12096e5); // 14 days from now
  };

  const renderStartInterviewButton = () => {
    if (!job) return null;
    
    return (
      <Link href={`/interview/session?jobId=${job.id}`}>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Start AI Interview
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    );
  };

  const renderInterviewStageDetails = () => {
    if (!job) return null;

    return (
      <div className="space-y-8">
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <p className="text-green-700 text-sm font-medium">
            ✓ Resume submitted successfully! Here's what happens next:
          </p>
        </div>

        <Tabs defaultValue="flow" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flow">Interview Flow</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Interview</TabsTrigger>
            <TabsTrigger value="prepare">Preparation</TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Process</CardTitle>
                <CardDescription>
                  Below is your interview process.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid gap-4">
                  {mockInterviewFlow.nodes.map((node, index) => {
                    const stageDetails = interviewStageDetails[node.id as keyof typeof interviewStageDetails];
                    return (
                      <Card key={node.id} className={cn(
                        "border-l-4",
                        node.id === "resume-screening-1" ? "border-l-blue-500" : "border-l-slate-200"
                      )}>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span>Stage {index + 1}: {stageDetails.title}</span>
                            <Badge variant="outline">{stageDetails.duration}</Badge>
                          </CardTitle>
                          <CardDescription>{stageDetails.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 mb-2">Expected Waiting Time</h4>
                            <p className="text-sm text-slate-600">{stageDetails.waitingTime}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 mb-2">Preparation Checklist</h4>
                            <ul className="text-sm space-y-2">
                              {stageDetails.checklist.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <div className="h-5 w-5 flex-shrink-0">
                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <span className="text-slate-600">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-slate-700 mb-2">Helpful Resources</h4>
                            <div className="space-y-2">
                              {stageDetails.resources.map((resource, i) => (
                                <a
                                  key={i}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  {resource.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Your Initial Screening</CardTitle>
                <CardDescription>
                  The AI interview will begin immediately after you click the button below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Before you begin:</h4>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Make sure you have a working camera and microphone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>Find a quiet place with good lighting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>The interview will take approximately {job.expectedDuration}</span>
                    </li>
                  </ul>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsSubmitted(true)}
                >
                  Start Interview Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prepare">
            <Card>
              <CardHeader>
                <CardTitle>Interview Preparation</CardTitle>
                <CardDescription>
                  Review these materials to help you prepare for your interview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">General Tips</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        Test your microphone and camera before the interview
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        Find a quiet, well-lit space for the interview
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        Have a copy of your resume ready
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        Prepare questions about the role and company
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Recommended Resources</h4>
                    <div className="grid gap-4">
                      <a
                        href="#"
                        className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
                      >
                        <h5 className="font-medium mb-1">Interview Preparation Guide</h5>
                        <p className="text-sm text-slate-600">
                          Comprehensive guide covering all aspects of the interview process.
                        </p>
                      </a>
                      <a
                        href="#"
                        className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
                      >
                        <h5 className="font-medium mb-1">Technical Interview Handbook</h5>
                        <p className="text-sm text-slate-600">
                          Detailed guide for technical interviews with practice problems.
                        </p>
                      </a>
                      <a
                        href="#"
                        className="block p-4 border rounded-lg hover:border-blue-500 transition-colors"
                      >
                        <h5 className="font-medium mb-1">Behavioral Interview Questions</h5>
                        <p className="text-sm text-slate-600">
                          Common behavioral questions and how to answer them effectively.
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          {renderStartInterviewButton()}
        </div>
      </div>
    );
  };

  const handleResumeUpload = async (file: File) => {
    try {
      // Here you would typically upload the file to your server
      // For now, we'll just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResumeSubmitted(true);
    } catch (error) {
      console.error('Error uploading resume:', error);
      // Handle error appropriately
    }
  };

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

  if (!job) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Job Not Found</CardTitle>
            <CardDescription>
              The job posting you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/candidate/jobs">
              <Button variant="outline" className="mt-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job Listings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/candidate/jobs">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job Listings
            </Button>
          </Link>
        </div>

        <Card className="bg-white shadow-lg mb-6">
          <CardHeader className="space-y-4">
            {job.companyLogo && (
              <div className="w-20 h-20 rounded-lg bg-slate-200 flex items-center justify-center border border-slate-300 overflow-hidden">
                <img src={job.companyLogo} alt={`${job.companyName} logo`} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">{job.title}</CardTitle>
              <div className="flex items-center text-slate-600 mt-2">
                <Building className="w-4 h-4 mr-2" />
                <span className="font-medium">{job.companyName}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-2" />
                Posted: {new Date(job.postedDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                {job.type}
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {job.experienceLevel}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Job Description</h3>
              <p className="text-slate-600 leading-relaxed">{job.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Key Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 flex items-center mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  AI Interview Information
                </h3>
                <p className="text-blue-700 text-sm">
                  Expected interview duration: {job.expectedDuration}
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {!isSubmitted ? (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">Step 1: Submit Your Resume</h3>
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
                  </div>
                ) : renderInterviewStageDetails()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 