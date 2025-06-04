"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { candidates, resumes } from "@/lib/mock-db/data";

export default function CandidatesPage() {
  const params = useParams();
  const jobId = params.id as string;

  // Filter candidates for this job
  const jobCandidates = candidates.filter(
    (candidate) => candidate.jobId === jobId
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... keep existing header JSX ... */}

      {jobCandidates.map((candidate) => (
        <div key={candidate.id} className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {candidate.name}
              </h3>
              <p className="text-sm text-gray-500">{candidate.email}</p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Overall Score
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {candidate.scores.overall}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Technical</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {candidate.scores.technical}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Communication
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {candidate.scores.communication}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Problem Solving
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {candidate.scores.problemSolving}%
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Interview Date:{" "}
                {new Date(candidate.interviewDate).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <span
                className={`px-2 py-1 text-sm font-medium rounded-full ${
                  candidate.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : candidate.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {candidate.status}
              </span>

              <Link
                href={`/employer/resumes/${candidate.resumeId}`}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View Full Report
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
