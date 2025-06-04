"use client";

import React, { useState } from "react";
import {
  Briefcase,
  PlusCircle,
  ExternalLink,
  Search,
  Filter,
  Linkedin,
  Disc,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import EnhancedNewJobModal from "@/components/employee/EnhancedNewJobModal";
import JobDetailsModal from "@/components/employee/JobDetailsModal";
import { useRouter } from "next/navigation";
import {
  getCandidatesByJobId,
  getCandidatesCountByJob,
  getAllJobs,
  searchJobs,
  getJobStats,
  getJobPostedPlatforms,
} from "@/lib/mock-db/utils";
import type { Job, CandidateStatus } from "@/lib/mock-db/types";

// Platform Icons Mapping
const platformIcons: { [key: string]: React.ElementType } = {
  LinkedIn: Linkedin,
  JobStreet: Disc,
  Indeed: Disc,
  "Company Website": Disc,
};

export default function EmployeeJobPostsPage() {
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobForDetails, setSelectedJobForDetails] =
    useState<Job | null>(null);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const router = useRouter();

  // Get all jobs and filter them based on search term
  const jobs = getAllJobs();
  const filteredJobs = searchTerm ? searchJobs(searchTerm) : jobs;

  const handlePostNewJob = (newJobData: any) => {
    // In a real app, this would involve an API call to add to the database
    console.log("New job posted:", newJobData);
    setIsNewJobModalOpen(false);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJobForDetails(job);
    setIsJobDetailsModalOpen(true);
  };

  const getStatusIcon = (status: CandidateStatus) => {
    switch (status) {
      case "Hired":
        return <CheckCircle size={14} className="text-green-600" />;
      case "In Progress":
        return <Clock size={14} className="text-yellow-600" />;
      case "Completed":
        return <CheckCircle size={14} className="text-blue-600" />;
      case "Rejected":
        return <XCircle size={14} className="text-red-600" />;
      default:
        return <Clock size={14} className="text-slate-400" />;
    }
  };

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case "Hired":
        return "text-green-600 bg-green-50";
      case "In Progress":
        return "text-yellow-600 bg-yellow-50";
      case "Completed":
        return "text-blue-600 bg-blue-50";
      case "Rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center">
          <h1 className="text-3xl font-bold text-slate-800">Job Postings</h1>
          <button
            onClick={() => setIsNewJobModalOpen(true)}
            className="mt-4 md:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150"
          >
            <PlusCircle size={20} className="mr-2" />
            Post New Job
          </button>
        </div>
        <p className="mt-2 text-slate-600">
          Manage and create job postings for your organization.
        </p>
      </header>

      {/* Search and Filters */}
      <section className="mb-6 p-4 bg-white shadow rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by title, department, or location..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center md:justify-start bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg border border-slate-300 transition-colors">
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
      </section>

      {/* Job Listings */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const stats = getJobStats(job.id);
            const platforms = getJobPostedPlatforms(job.id);

            return (
              <div
                key={job.id}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                      <a href={`/employer/jobs/${job.id}`}>{job.title}</a>
                    </h2>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        job.status === "Open"
                          ? "bg-green-100 text-green-700"
                          : job.status === "Closed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">
                    {job.department} • {job.location}
                  </p>
                  <p className="text-sm text-slate-500 mb-3">
                    {job.type} • Posted: {job.createdAt}
                  </p>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div>
                  {/* Interview Status */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                      Interview Status:
                    </h4>
                    <div className="space-y-1.5">
                      {stats.inProgress > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getStatusIcon("In Progress")}
                            <span className="text-xs ml-1.5 text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                              In Progress
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-600">
                            {stats.inProgress}
                          </span>
                        </div>
                      )}
                      {stats.completed > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getStatusIcon("Completed")}
                            <span className="text-xs ml-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-600">
                            {stats.completed}
                          </span>
                        </div>
                      )}
                      {stats.hired > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getStatusIcon("Hired")}
                            <span className="text-xs ml-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                              Hired
                            </span>
                          </div>
                          <span className="text-xs font-medium text-slate-600">
                            {stats.hired}
                          </span>
                        </div>
                      )}
                      {stats.totalCandidates === 0 && (
                        <p className="text-xs text-slate-400 italic">
                          No candidates yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Posted Platforms */}
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Posted On:
                    </h4>
                    {platforms && platforms.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        {platforms.map((platformName) => {
                          const IconComponent = platformIcons[platformName];
                          return IconComponent ? (
                            <IconComponent
                              key={platformName}
                              size={20}
                              className="text-slate-600"
                              title={platformName}
                            />
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Not posted on external platforms.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center bg-transparent border-none p-0 cursor-pointer"
                      >
                        View Details <ExternalLink size={16} className="ml-1" />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/employer/jobs/${job.id}/candidates`)
                        }
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center bg-transparent border-none p-0 cursor-pointer ml-4"
                      >
                        <Users size={16} className="mr-1" /> View Candidates (
                        {stats.totalCandidates})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filteredJobs.length === 0 && (
          <div className="text-center py-10">
            <Briefcase size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">
              No job postings found{searchTerm ? " matching your search" : ""}.
            </p>
            {!searchTerm && (
              <p className="text-sm text-slate-400">
                Click "Post New Job" to get started.
              </p>
            )}
          </div>
        )}
      </section>

      <EnhancedNewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onJobPost={handlePostNewJob}
      />
      <JobDetailsModal
        isOpen={isJobDetailsModalOpen}
        onClose={() => setIsJobDetailsModalOpen(false)}
        job={selectedJobForDetails}
      />
    </div>
  );
}
