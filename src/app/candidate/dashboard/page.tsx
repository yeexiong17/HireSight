"use client";

import React from "react";
import {
  CheckCircle,
  TrendingUp,
  Building,
  Calendar,
  Clock,
  BarChart,
  ChevronRight,
  Star,
  Award,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import JobRecommendations from "@/components/jobs/JobRecommendations";

// Mock data for demonstration
const mockInterviewHistory = [
  {
    id: 1,
    company: "TechCorp Solutions",
    position: "Senior Software Engineer",
    date: "2024-03-15",
    duration: "45 minutes",
    status: "Completed",
    overallScore: 85,
    jobDetails: {
      location: "San Francisco, CA (Hybrid)",
      salary: "$140,000 - $180,000",
      department: "Engineering",
      type: "Full-time",
      requirements: [
        "5+ years of software development experience",
        "Strong knowledge of distributed systems",
        "Experience with cloud platforms (AWS/GCP)",
        "Bachelor's degree in Computer Science or related field",
      ],
      description:
        "We are seeking a Senior Software Engineer to join our growing engineering team. You will be responsible for designing and implementing scalable solutions, mentoring junior developers, and contributing to our technical roadmap.",
    },
    performance: {
      technical: 90,
      problemSolving: 80,
      communication: 88,
      culturalFit: 75,
    },
    feedback: {
      strengths: [
        "Excellent understanding of system design principles",
        "Strong problem-solving approach",
        "Clear communication of technical concepts",
      ],
      improvements: [
        "Could improve on time complexity optimization",
        "Consider more edge cases in solutions",
      ],
      summary:
        "Demonstrated strong technical capabilities with room for optimization skills improvement.",
    },
  },
  {
    id: 2,
    company: "InnovateTech",
    position: "Full Stack Developer",
    date: "2024-03-10",
    duration: "50 minutes",
    status: "Completed",
    overallScore: 78,
    jobDetails: {
      location: "Remote",
      salary: "$100,000 - $130,000",
      department: "Product Development",
      type: "Full-time",
      requirements: [
        "3+ years of full-stack development experience",
        "Proficiency in React and Node.js",
        "Experience with RESTful APIs",
        "Strong understanding of web technologies",
      ],
      description:
        "Looking for a Full Stack Developer to help build and maintain our core product platform. You'll work closely with our product team to implement new features and improve existing functionality.",
    },
    performance: {
      technical: 75,
      problemSolving: 82,
      communication: 80,
      culturalFit: 85,
    },
    feedback: {
      strengths: [
        "Good grasp of full-stack concepts",
        "Excellent team collaboration mindset",
        "Strong problem-solving skills",
      ],
      improvements: [
        "Could strengthen backend architecture knowledge",
        "Review advanced JavaScript concepts",
      ],
      summary:
        "Shows promise in full-stack development with good problem-solving abilities.",
    },
  },
];

// Add sample jobs data for recommendations
const sampleJobs = [
  {
    id: "job001",
    title: "Senior Frontend Developer",
    companyName: "Grab",
    location: "San Francisco, CA",
    description:
      "Join our dynamic team to build next-gen web applications using React, Next.js, and TypeScript. Seeking experienced developers with a passion for UI/UX.",
    postedDate: "2024-05-20",
    tags: ["React", "Next.js", "TypeScript", "UI/UX", "Frontend"],
    companyLogo:
      "https://brandlogos.net/wp-content/uploads/2020/08/grab-logo.png",
  },
  {
    id: "job002",
    title: "Backend Python Engineer",
    companyName: "Meta",
    location: "New York, NY",
    description:
      "We are looking for a skilled Python developer to design and implement robust backend services, APIs, and database solutions. Experience with Django/Flask is a plus.",
    postedDate: "2024-05-18",
    tags: ["Python", "Django", "Flask", "API", "Backend", "SQL"],
    companyLogo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy3ZqxYhMdW3qa__685iJWJwGQGhV4VCivoQ&s",
  },
  {
    id: "job003",
    title: "Full-Stack Developer (Remote)",
    companyName: "ConnectSphere Ltd.",
    location: "Remote",
    description:
      "Exciting opportunity for a versatile Full-Stack Developer to work on a leading communication platform. Proficiency in Node.js, React, and cloud services required.",
    postedDate: "2024-05-22",
    tags: ["Node.js", "React", "AWS", "Full-Stack", "Remote"],
  },
];

// Helper component for star ratings
const StarRating = ({ score }: { score: number }) => {
  const totalStars = 5;
  const filledStars = Math.round((score / 100) * totalStars);
  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < filledStars
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const PerformanceBar = ({ score, label }: { score: number; label: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium text-slate-700">{score}%</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${
          score >= 80
            ? "bg-green-500"
            : score >= 60
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

// Extract candidate profile from interview history
const getCandidateProfile = (interviewHistory: any[]) => {
  const skills = new Set<string>();
  const experience = new Set<string>();
  let technicalScore = 0;
  let communicationScore = 0;
  let problemSolvingScore = 0;
  let count = 0;

  interviewHistory.forEach((interview) => {
    // Extract skills from job requirements
    interview.jobDetails.requirements.forEach((req: string) => {
      const skillMatches = req.match(/experience (?:with|in) ([^,\.]+)/i);
      if (skillMatches) {
        skills.add(skillMatches[1].trim());
      }
    });

    // Add performance scores
    if (interview.performance) {
      technicalScore += interview.performance.technical;
      communicationScore += interview.performance.communication;
      problemSolvingScore += interview.performance.problemSolving;
      count++;
    }
  });

  return {
    skills: Array.from(skills),
    experience: Array.from(experience),
    scores: {
      technical: count > 0 ? Math.round(technicalScore / count) : 0,
      communication: count > 0 ? Math.round(communicationScore / count) : 0,
      problemSolving: count > 0 ? Math.round(problemSolvingScore / count) : 0,
    },
  };
};

export default function CandidateDashboardPage() {
  const [selectedInterview, setSelectedInterview] = React.useState(
    mockInterviewHistory[0]
  );
  const candidateProfile = React.useMemo(
    () => getCandidateProfile(mockInterviewHistory),
    []
  );

  return (
    <div className="p-6 md:p-8 lg:p-10 min-h-screen bg-slate-50">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Interview Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Track your interview performance and feedback across different
          positions
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interview History List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Interview History
          </h2>
          {mockInterviewHistory.map((interview) => (
            <Card
              key={interview.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedInterview.id === interview.id
                  ? "ring-2 ring-blue-500"
                  : ""
              }`}
              onClick={() => setSelectedInterview(interview)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-slate-800">
                      {interview.position}
                    </h3>
                    <div className="flex items-center text-sm text-slate-500">
                      <Building className="w-4 h-4 mr-1" />
                      {interview.company}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      interview.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {interview.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {interview.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {interview.duration}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Section - Selected Interview Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedInterview && (
            <>
              {/* Job Details */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800">
                      {selectedInterview.position}
                    </h2>
                    <p className="text-slate-600">
                      {selectedInterview.company}
                    </p>
                  </div>
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedInterview.jobDetails.location}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedInterview.jobDetails.salary}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Users className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedInterview.jobDetails.department}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Clock className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedInterview.jobDetails.type}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      Job Description
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedInterview.jobDetails.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {selectedInterview.jobDetails.requirements.map(
                        (req, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <ChevronRight className="w-4 h-4 text-slate-400 mr-2 mt-0.5" />
                            <span className="text-slate-600">{req}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Overall Score */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Interview Performance
                  </h3>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">
                      {selectedInterview.overallScore}%
                    </div>
                    <p className="text-sm text-slate-500">Overall Score</p>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-4">
                  <PerformanceBar
                    score={selectedInterview.performance.technical}
                    label="Technical Skills"
                  />
                  <PerformanceBar
                    score={selectedInterview.performance.problemSolving}
                    label="Problem Solving"
                  />
                  <PerformanceBar
                    score={selectedInterview.performance.communication}
                    label="Communication"
                  />
                  <PerformanceBar
                    score={selectedInterview.performance.culturalFit}
                    label="Cultural Fit"
                  />
                </div>
              </Card>

              {/* Detailed Feedback */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Interview Feedback
                </h3>

                <div className="space-y-6">
                  {/* Strengths */}
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-green-600 mb-2">
                      <Award className="w-4 h-4 mr-2" />
                      Key Strengths
                    </h4>
                    <ul className="space-y-2">
                      {selectedInterview.feedback.strengths.map(
                        (strength, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1" />
                            <span className="text-slate-600">{strength}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-yellow-600 mb-2">
                      <BarChart className="w-4 h-4 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {selectedInterview.feedback.improvements.map(
                        (improvement, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight className="w-4 h-4 text-yellow-500 mr-2 mt-1" />
                            <span className="text-slate-600">
                              {improvement}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      Overall Summary
                    </h4>
                    <p className="text-slate-600">
                      {selectedInterview.feedback.summary}
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
