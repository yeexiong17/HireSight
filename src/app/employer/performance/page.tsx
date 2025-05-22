'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Import Card components
import { Button } from "@/components/ui/button"; // Import Button component
import { AlertTriangle } from 'lucide-react'; // Removed BarChart3 as it is not used here

// TODO: Define a type for JobPerformance based on actual data
interface JobPerformance {
  jobId: string;
  jobTitle: string;
  totalCandidates: number;
  // Add more relevant metrics here, e.g., average score, pass rate, etc.
  // Example:
  // averageScore?: number;
  // hiredCount?: number;
}

// TODO: Fetch actual job performance data
const samplePerformanceData: JobPerformance[] = [
  { jobId: 'job001', jobTitle: 'Senior Frontend Developer', totalCandidates: 15 /* averageScore: 78, hiredCount: 2 */ },
  { jobId: 'job002', jobTitle: 'Backend Python Engineer', totalCandidates: 25 /* averageScore: 82, hiredCount: 5 */ },
  { jobId: 'job003', jobTitle: 'Full-Stack Developer (Remote)', totalCandidates: 10 /* averageScore: 75, hiredCount: 1 */ },
];

const PerformanceDashboardPage = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Candidate Performance</h1>
        <p className="text-slate-600 mt-1">
          Monitor interview metrics across all job positions.
        </p>
      </header>

      {samplePerformanceData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
          {samplePerformanceData.map((job) => (
            <Card key={job.jobId} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-semibold text-slate-700">{job.jobTitle}</CardTitle>
                </div>
                <p className="text-sm text-slate-500 pt-1">Job ID: {job.jobId}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Total Candidates Interviewed:</span>
                    <span className="font-medium text-slate-700">{job.totalCandidates}</span>
                  </div>
                  {/* Example for more stats - uncomment and adjust when data is available
                  {job.averageScore && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Average Score:</span>
                      <span className="font-medium text-green-600">{job.averageScore}%</span>
                    </div>
                  )}
                  {job.hiredCount !== undefined && (
                      <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Successfully Hired:</span>
                      <span className="font-medium text-blue-600">{job.hiredCount}</span>
                    </div>
                  )}
                  */}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 mt-auto">
                <Button 
                  className="w-full bg-slate-700 hover:bg-slate-800 text-base"
                  onClick={() => router.push(`/employer/performance/${job.jobId}`)}
                  size="lg"
                >
                  View Detailed Report
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <AlertTriangle className="w-16 h-16 mx-auto text-slate-400 mb-6" />
          <h2 className="text-2xl font-semibold text-slate-600 mb-2">No Performance Data Available</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Once candidates complete their interviews, their performance data will appear here. 
            Ensure jobs are configured and interviews are being conducted.
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboardPage;