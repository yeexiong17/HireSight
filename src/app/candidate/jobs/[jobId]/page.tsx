'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, CalendarDays, ArrowLeft, Building, Tag, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ResumeUpload from '@/components/resume-upload';

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

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = typeof params.jobId === 'string' ? params.jobId : null;
  const [resumeSubmitted, setResumeSubmitted] = useState(false);
  
  const job = jobId ? getJobById(jobId) : null;

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

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex items-center justify-center">
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
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
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
                {!resumeSubmitted ? (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-4">Step 1: Submit Your Resume</h3>
                    <ResumeUpload onUploadComplete={handleResumeUpload} />
                  </div>
                ) : (
                  <div>
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <p className="text-green-700 text-sm font-medium">
                        ✓ Resume submitted successfully! You can now proceed with the AI interview.
                      </p>
                    </div>
                    <Link href={`/interview/session?jobId=${job.id}`}>
                      <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                        Start AI Interview
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 