"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Bot,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { resumes as mockResumes } from "@/lib/mock-db/data";

interface Resume {
  id: string;
  candidateName: string;
  candidateId: string;
  jobTitle: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  confidence: number;
  fileName: string;
  extractedFields: number;
  aiGenerated: {
    isDetected: boolean;
    confidence: number;
    details?: {
      overallScore: number;
      patterns: string[];
      suspiciousAreas: string[];
      humanLikeFeatures: string[];
    };
  };
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Transform mock resumes to match the Resume interface
    const transformedResumes: Resume[] = mockResumes.map((mockResume) => ({
      id: mockResume.id,
      candidateId: mockResume.candidateId,
      candidateName: mockResume.extractedData.name,
      jobTitle: mockResume.jobTitle,
      uploadDate: mockResume.uploadDate,
      status: mockResume.status.toLowerCase() as
        | "pending"
        | "approved"
        | "rejected",
      confidence: mockResume.confidence,
      fileName: mockResume.fileName,
      extractedFields: mockResume.fieldsExtracted,
      aiGenerated: {
        isDetected: mockResume.aiDetection.isDetected,
        confidence: mockResume.aiDetection.confidence,
        details: mockResume.aiDetection.details,
      },
    }));

    setResumes(transformedResumes);
  }, []);

  const filteredResumes = resumes.filter((resume) => {
    const matchesStatus =
      filterStatus === "all" || resume.status === filterStatus;
    const matchesSearch =
      resume.candidateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800";
    if (confidence >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getAIDetectionBadge = (aiData: {
    isDetected: boolean;
    confidence: number;
  }) => {
    if (aiData.isDetected) {
      return (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Bot className="w-3 h-3 mr-1" />
          {aiData.confidence}% AI Suspected
        </div>
      );
    }
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Human Written
      </div>
    );
  };

  const stats = {
    total: resumes.length,
    pending: resumes.filter((r) => r.status === "pending").length,
    approved: resumes.filter((r) => r.status === "approved").length,
    rejected: resumes.filter((r) => r.status === "rejected").length,
    aiDetected: resumes.filter((r) => r.aiGenerated.isDetected).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Resume Review
              </h1>
              <p className="text-gray-600">
                Review and manage candidate resumes with AI-extracted data and
                AI detection
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Resumes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">AI Detected</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.aiDetected}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by candidate name or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resume List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Resumes ({filteredResumes.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {resume.candidateName}
                        </h3>
                        {getStatusIcon(resume.status)}
                        {resume.aiGenerated.isDetected && (
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{resume.jobTitle}</p>
                      <p className="text-sm text-gray-500">{resume.fileName}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                          Uploaded:{" "}
                          {new Date(resume.uploadDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {resume.extractedFields} fields extracted
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex text-right space-x-2">
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBadge(
                          resume.confidence
                        )}`}
                      >
                        {resume.confidence}% confidence
                      </div>

                      <div
                        className={`inline-flex items-center ${getStatusBadge(
                          resume.status
                        )}`}
                      >
                        {resume.status.charAt(0).toUpperCase() +
                          resume.status.slice(1)}
                      </div>

                      <div
                        className={`inline-flex items-center ${getAIDetectionBadge(
                          resume.aiGenerated
                        )}`}
                      >
                        {getAIDetectionBadge(resume.aiGenerated)}
                      </div>
                    </div>
                    <Link
                      href={`/employer/resumes/${resume.candidateId}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredResumes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No resumes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No resumes have been uploaded yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
