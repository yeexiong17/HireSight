'use client';

import React, { useState } from 'react';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import ResumeUpload from '@/components/resume-upload';
import { useParams } from 'next/navigation';

interface JobDetails {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: string;
}

// Mock job data - In production, fetch from API
const mockJobData: JobDetails = {
  id: '1',
  title: 'Senior Frontend Developer',
  company: 'TechCorp Inc.',
  location: 'San Francisco, CA',
  type: 'Full-time',
  salary: '$120,000 - $150,000',
  description: 'We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for building user-facing web applications and ensuring exceptional user experience.',
  requirements: [
    '5+ years of experience in frontend development',
    'Proficiency in React, TypeScript, and modern JavaScript',
    'Experience with responsive design and CSS frameworks',
    'Knowledge of version control systems (Git)',
    'Strong problem-solving skills and attention to detail'
  ],
  responsibilities: [
    'Develop and maintain responsive web applications',
    'Collaborate with UX/UI designers and backend developers',
    'Write clean, maintainable, and well-documented code',
    'Optimize applications for maximum speed and scalability',
    'Participate in code reviews and team meetings'
  ],
  postedDate: '2024-01-15'
};

export default function JobApplicationPage() {
  const [applicationStep, setApplicationStep] = useState<'details' | 'upload' | 'success'>('details');
  const [applicationData, setApplicationData] = useState<any>(null);

  const params = useParams()
  const jobId = params.jobId as string

  const handleUploadSuccess = (data: any) => {
    setApplicationData(data);
    setApplicationStep('success');
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    // Handle error (show notification, etc.)
  };

  const proceedToUpload = () => {
    setApplicationStep('upload');
  };

  if (applicationStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your resume has been uploaded and processed. The employer will review your application and contact you if you're a good fit.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Your resume is being analyzed by AI to extract key information</li>
                <li>• The employer will review your extracted profile data</li>
                <li>• You may be invited for an AI-powered initial interview</li>
                <li>• Successful candidates will be contacted for further interviews</li>
              </ul>
            </div>
            <div className="flex space-x-4 justify-center">
              <Link
                href="/candidate/jobs"
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
              >
                Browse More Jobs
              </Link>
              <Link
                href="/candidate/dashboard"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              href={`/candidate/jobs/${jobId}`}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Job Details
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Apply for {mockJobData.title}</h1>
              <p className="text-sm text-gray-600">{mockJobData.company}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {applicationStep === 'details' && (
          <div className="space-y-6">
            {/* Job Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>{mockJobData.type}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{mockJobData.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-5 h-5 mr-2" />
                  <span>{mockJobData.salary}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Posted {new Date(mockJobData.postedDate).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-gray-700">{mockJobData.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-2">
                {mockJobData.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
              <ul className="space-y-2">
                {mockJobData.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span className="text-gray-700">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Application Process</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">1</div>
                  <span className="text-blue-800">Upload your resume (PDF, JPEG, or PNG)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">2</div>
                  <span className="text-blue-800">AI extracts and analyzes your information</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">3</div>
                  <span className="text-blue-800">Employer reviews your profile</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">4</div>
                  <span className="text-blue-800">Potential AI interview and follow-up</span>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <div className="flex justify-center">
              <button
                onClick={proceedToUpload}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Proceed to Upload Resume
              </button>
            </div>
          </div>
        )}

        {applicationStep === 'upload' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
              <p className="text-gray-600">
                Upload your resume and our AI will extract key information for the employer to review.
              </p>
            </div>
            
            <ResumeUpload
              jobId={jobId}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
