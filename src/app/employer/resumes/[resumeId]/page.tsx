"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Info,
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  FileText,
  MessageSquare,
  Code,
  Brain,
  Bot,
  AlertTriangle,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { resumes, candidates } from "@/lib/mock-db/data";

// UI Component imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Worker, Viewer, LoadError } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

interface ExtractedField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  category:
    | "personal"
    | "contact"
    | "experience"
    | "education"
    | "skills"
    | "other";
  position?: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isEditing?: boolean;
}

interface ResumeData {
  id: string;
  candidateName: string;
  jobTitle: string;
  fileName: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
  totalPages: number;
  extractedFields: ExtractedField[];
  aiGenerated: {
    isDetected: boolean;
    confidence: number;
    details: {
      overallScore: number;
      patterns: string[];
      suspiciousAreas: string[];
      humanLikeFeatures: string[];
    };
  };
}

interface CandidateScores {
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
}

interface CandidateFeedback {
  strengths: string[];
  improvements: string[];
  technicalNotes: string;
  communicationNotes: string;
  problemSolvingNotes: string;
}

interface InterviewTranscriptItem {
  question: string;
  answer: string;
  evaluation: string;
}

interface CandidateData {
  scores: CandidateScores;
  feedback: CandidateFeedback;
  interviewTranscript: InterviewTranscriptItem[];
}

export default function ResumeReviewPage() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    id: "",
    candidateName: "",
    jobTitle: "",
    fileName: "",
    uploadDate: "",
    status: "pending",
    totalPages: 0,
    extractedFields: [],
    aiGenerated: {
      isDetected: false,
      confidence: 0,
      details: {
        overallScore: 0,
        patterns: [],
        suspiciousAreas: [],
        humanLikeFeatures: [],
      },
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [activeTab, setActiveTab] = useState<
    | "all"
    | "low-confidence"
    | "consolidated"
    | "compliance"
    | "file-info"
    | "ai-detection"
  >("all");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [candidateData, setCandidateData] = useState<CandidateData>({
    scores: {
      overall: 0,
      technical: 0,
      communication: 0,
      problemSolving: 0,
    },
    feedback: {
      strengths: [],
      improvements: [],
      technicalNotes: "",
      communicationNotes: "",
      problemSolvingNotes: "",
    },
    interviewTranscript: [],
  });

  const params = useParams();
  const resumeId = params.resumeId as string;

  // Initialize zoom plugin
  const zoomPluginInstance = zoomPlugin();
  const { zoomTo } = zoomPluginInstance;

  // Helper function to generate AI detection data
  const generateAIDetectionData = (candidateId: string) => {
    const hash = candidateId.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const isAIDetected = Math.abs(hash) % 3 === 0; // Every 3rd resume flagged
    const confidence = isAIDetected
      ? 90 + Math.abs(hash % 10)
      : 15 + Math.abs(hash % 25);

    return {
      isDetected: isAIDetected,
      confidence,
      details: {
        overallScore: confidence,
        patterns: isAIDetected
          ? [
              "Repetitive sentence structures",
              "Uniform formatting patterns",
              "Generic skill descriptions",
            ]
          : [
              "Natural language variation",
              "Consistent personal voice",
              "Authentic experience descriptions",
            ],
        suspiciousAreas: isAIDetected
          ? [
              "Professional summary section",
              "Skills enumeration",
              "Achievement descriptions",
            ]
          : [],
        humanLikeFeatures: isAIDetected
          ? ["Personal contact information", "Educational timeline"]
          : [
              "Personal anecdotes",
              "Varied writing style",
              "Specific project details",
              "Unique formatting choices",
            ],
      },
    };
  };

  useEffect(() => {
    console.log("Loading resume with ID:", resumeId);
    const currentResume = resumes.find((r) => r.candidateId === resumeId);
    if (!currentResume) {
      console.error("Resume not found:", resumeId);
      return;
    }

    console.log("Found resume:", currentResume);
    const currentCandidate = candidates.find(
      (c) => c.id === currentResume.candidateId
    );
    if (!currentCandidate) {
      console.error(
        "Candidate not found for resume:",
        currentResume.candidateId
      );
      return;
    }

    console.log("Found candidate:", currentCandidate);

    // Transform resume data
    const transformedFields: ExtractedField[] = [
      {
        id: "name",
        label: "Name",
        value: currentResume.extractedData.name,
        confidence: 98,
        category: "personal" as const,
      },
      {
        id: "email",
        label: "Email",
        value: currentResume.extractedData.email,
        confidence: 95,
        category: "contact" as const,
      },
      {
        id: "phone",
        label: "Phone",
        value: currentResume.extractedData.phone,
        confidence: 92,
        category: "contact" as const,
      },
      {
        id: "experience",
        label: "Experience",
        value: currentResume.extractedData.experience,
        confidence: 90,
        category: "experience" as const,
      },
      ...currentResume.extractedData.education.map((edu, index) => ({
        id: `education-${index}`,
        label: "Education",
        value: edu,
        confidence: 88,
        category: "education" as const,
      })),
      ...currentResume.extractedData.skills.map((skill, index) => ({
        id: `skill-${index}`,
        label: "Skill",
        value: skill,
        confidence: 85,
        category: "skills" as const,
      })),
    ];

    console.log("Setting resume data with fields:", transformedFields.length);
    setResumeData({
      id: currentResume.id,
      candidateName: currentResume.extractedData.name,
      jobTitle: currentResume.jobTitle,
      fileName: currentResume.fileName,
      uploadDate: currentResume.uploadDate,
      status: currentResume.status.toLowerCase() as
        | "pending"
        | "approved"
        | "rejected",
      totalPages: 0,
      extractedFields: transformedFields,
      aiGenerated: {
        isDetected: currentResume.aiDetection.isDetected,
        confidence: currentResume.aiDetection.confidence,
        details: currentResume.aiDetection.details,
      },
    });

    console.log("Setting candidate data");
    setCandidateData({
      scores: currentCandidate.scores,
      feedback: currentCandidate.feedback,
      interviewTranscript: currentCandidate.interviewTranscript,
    });
  }, [resumeId]);

  const handleFieldEdit = (fieldId: string, newValue: string) => {
    setResumeData((prev) => ({
      ...prev,
      extractedFields: prev.extractedFields.map((field) =>
        field.id === fieldId
          ? { ...field, value: newValue, isEditing: false }
          : field
      ),
    }));
  };

  const handleFieldDelete = (fieldId: string) => {
    setResumeData((prev) => ({
      ...prev,
      extractedFields: prev.extractedFields.filter(
        (field) => field.id !== fieldId
      ),
    }));
  };

  const handleApprove = () => {
    setResumeData((prev) => ({ ...prev, status: "approved" }));
    // In real app, make API call to update status
  };

  const handleReject = () => {
    setResumeData((prev) => ({ ...prev, status: "rejected" }));
    // In real app, make API call to update status
  };

  const getFieldIcon = (category: string) => {
    switch (category) {
      case "personal":
        return <User className="w-4 h-4" />;
      case "contact":
        return <Mail className="w-4 h-4" />;
      case "experience":
        return <Briefcase className="w-4 h-4" />;
      case "education":
        return <GraduationCap className="w-4 h-4" />;
      case "skills":
        return <Award className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-100";
    if (confidence >= 75) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const filteredFields = () => {
    switch (activeTab) {
      case "low-confidence":
        return resumeData.extractedFields.filter(
          (field) => field.confidence < 85
        );
      case "consolidated":
        return resumeData.extractedFields.filter((field) =>
          ["personal", "contact", "experience"].includes(field.category)
        );
      case "compliance":
        return resumeData.extractedFields.filter((field) =>
          ["personal", "contact"].includes(field.category)
        );
      default:
        return resumeData.extractedFields;
    }
  };

  const groupedFields = filteredFields().reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ExtractedField[]>);

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.2, 3);
    setScale(newScale);
    zoomTo(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.2, 0.5);
    setScale(newScale);
    zoomTo(newScale);
  };

  const getAIDetectionBadge = () => {
    const { isDetected, confidence } = resumeData.aiGenerated;
    if (isDetected) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <Bot className="w-4 h-4 mr-1" />
          {confidence}% AI Suspected
        </div>
      );
    }
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <Shield className="w-4 h-4 mr-1" />
        Human Written ({confidence}% confidence)
      </div>
    );
  };

  return (
    <Worker
      workerUrl={`//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-4">
                <Link
                  href="/employer/resumes"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Resumes
                </Link>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {resumeData.candidateName}
                    </h1>
                    {resumeData.aiGenerated.isDetected && (
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    )}
                    {getAIDetectionBadge()}
                  </div>
                  <p className="text-sm text-gray-600">
                    {resumeData.jobTitle} • {resumeData.fileName}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                    isEditMode
                      ? "border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  }`}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditMode ? "Exit Edit" : "Edit Fields"}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={resumeData.status === "approved"}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={resumeData.status === "rejected"}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Document Preview */}
            <div className="bg-white rounded-lg shadow h-[800px] flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Document Preview
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleZoomOut}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Zoom out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600 min-w-[48px] text-center">
                      {(scale * 100).toFixed(0)}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Zoom in"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {resumeData.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(resumeData.totalPages, currentPage + 1)
                      )
                    }
                    disabled={currentPage === resumeData.totalPages}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Document Viewer */}
              <div className="relative flex-1 bg-gray-100 overflow-hidden">
                {resumeData.fileName ? (
                  <div className="h-full">
                    <Worker workerUrl="//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={`/uploads/resumes/${resumeData.fileName}`}
                        onDocumentLoad={(e: any) => {
                          if (
                            e &&
                            e.doc &&
                            typeof e.doc.numPages === "number"
                          ) {
                            setNumPages(e.doc.numPages);
                            setResumeData((prevData) => ({
                              ...prevData,
                              totalPages: e.doc.numPages,
                            }));
                          }
                        }}
                        plugins={[zoomPluginInstance]}
                        renderError={(error: LoadError) => (
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
                              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Unable to Load PDF
                              </h3>
                              <p className="text-gray-600 mb-4">
                                There was an error loading the resume file.
                              </p>
                              <p className="text-sm text-red-600 mb-6">
                                Error: {error.message}
                              </p>
                              <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Try Again
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </Worker>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Resume Available
                      </h3>
                      <p className="text-gray-600 mb-4">
                        The resume file could not be loaded. This could be
                        because:
                      </p>
                      <ul className="text-sm text-gray-500 text-left list-disc pl-6 mb-6">
                        <li>The file has been deleted or moved</li>
                        <li>The file format is not supported</li>
                        <li>There might be permission issues</li>
                      </ul>
                      <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Refresh Page
                      </button>
                    </div>
                  </div>
                )}

                {/* Highlight overlays for selected fields */}
                {selectedField &&
                  resumeData.extractedFields
                    .filter(
                      (field) =>
                        field.id === selectedField &&
                        field.position?.page === currentPage
                    )
                    .map((field) => (
                      <div
                        key={field.id}
                        className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30 rounded"
                        style={{
                          left: `${(field.position!.x / 600) * 100}%`,
                          top: `${(field.position!.y / 800) * 100}%`,
                          width: `${(field.position!.width / 600) * 100}%`,
                          height: `${(field.position!.height / 800) * 100}%`,
                        }}
                      />
                    ))}
              </div>
            </div>

            {/* Right Panel - Extracted Data */}
            <div className="bg-white rounded-lg shadow h-[800px] flex flex-col">
              <div className="p-4 border-b border-gray-200 overflow-x-auto">
                <h2 className="text-lg font-medium text-gray-900">
                  Extracted Data
                </h2>

                {/* Tabs */}
                <div className="mt-4">
                  <nav className="flex space-x-8" aria-label="Tabs">
                    {[
                      {
                        id: "all",
                        name: "All Fields",
                        count: resumeData.extractedFields.length,
                      },
                      {
                        id: "low-confidence",
                        name: "Low Confidence",
                        count: resumeData.extractedFields.filter(
                          (f) => f.confidence < 85
                        ).length,
                      },
                      {
                        id: "consolidated",
                        name: "Key Info",
                        count: resumeData.extractedFields.filter((f) =>
                          ["personal", "contact", "experience"].includes(
                            f.category
                          )
                        ).length,
                      },
                      {
                        id: "compliance",
                        name: "Compliance",
                        count: resumeData.extractedFields.filter((f) =>
                          ["personal", "contact"].includes(f.category)
                        ).length,
                      },
                      {
                        id: "ai-detection",
                        name: "AI Detection",
                        count: 1,
                        icon: <Bot className="w-4 h-4" />,
                        hasAlert: resumeData.aiGenerated.isDetected,
                      },
                      { id: "file-info", name: "File Info", count: 1 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`${
                          activeTab === tab.id
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                      >
                        {tab.icon && <span className="mr-1">{tab.icon}</span>}
                        {tab.hasAlert && (
                          <AlertTriangle className="w-3 h-3 mr-1 text-orange-500" />
                        )}
                        {tab.name}
                        <span
                          className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                            activeTab === tab.id
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {activeTab === "ai-detection" ? (
                  <div className="space-y-6">
                    {/* AI Detection Summary */}
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        resumeData.aiGenerated.isDetected
                          ? "border-red-200 bg-red-50"
                          : "border-green-200 bg-green-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        {resumeData.aiGenerated.isDetected ? (
                          <Bot className="w-6 h-6 text-red-600" />
                        ) : (
                          <Shield className="w-6 h-6 text-green-600" />
                        )}
                        <h3
                          className={`text-lg font-semibold ${
                            resumeData.aiGenerated.isDetected
                              ? "text-red-900"
                              : "text-green-900"
                          }`}
                        >
                          {resumeData.aiGenerated.isDetected
                            ? "AI Generated Content Detected"
                            : "Human Written Content"}
                        </h3>
                      </div>
                      <p
                        className={`text-sm ${
                          resumeData.aiGenerated.isDetected
                            ? "text-red-800"
                            : "text-green-800"
                        }`}
                      >
                        Confidence: {resumeData.aiGenerated.confidence}%
                      </p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            resumeData.aiGenerated.isDetected
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${resumeData.aiGenerated.confidence}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Detected Patterns */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        {resumeData.aiGenerated.isDetected
                          ? "Detected AI Patterns"
                          : "Natural Writing Patterns"}
                      </h4>
                      <ul className="space-y-1">
                        {resumeData.aiGenerated.details.patterns.map(
                          (pattern, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-start"
                            >
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {pattern}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Suspicious Areas (only show if AI detected) */}
                    {resumeData.aiGenerated.isDetected &&
                      resumeData.aiGenerated.details.suspiciousAreas.length >
                        0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Suspicious Areas
                          </h4>
                          <ul className="space-y-1">
                            {resumeData.aiGenerated.details.suspiciousAreas.map(
                              (area, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-red-600 flex items-start"
                                >
                                  <AlertTriangle className="w-3 h-3 mt-0.5 mr-2 flex-shrink-0" />
                                  {area}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Human-like Features */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        {resumeData.aiGenerated.isDetected
                          ? "Remaining Human Elements"
                          : "Human-like Features"}
                      </h4>
                      <ul className="space-y-1">
                        {resumeData.aiGenerated.details.humanLikeFeatures.map(
                          (feature, index) => (
                            <li
                              key={index}
                              className="text-sm text-green-600 flex items-start"
                            >
                              <CheckCircle className="w-3 h-3 mt-0.5 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">
                        Recommendation
                      </h4>
                      <p className="text-sm text-blue-800">
                        {resumeData.aiGenerated.isDetected
                          ? "Consider conducting additional verification during the interview process to assess the candidate's actual skills and experience."
                          : "This resume shows natural human writing patterns and appears to be authentic."}
                      </p>
                    </div>
                  </div>
                ) : activeTab === "file-info" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          File Name:
                        </span>
                        <p className="text-gray-600">{resumeData.fileName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Upload Date:
                        </span>
                        <p className="text-gray-600">
                          {new Date(resumeData.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Total Pages:
                        </span>
                        <p className="text-gray-600">{resumeData.totalPages}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Status:
                        </span>
                        <p
                          className={`capitalize ${
                            resumeData.status === "approved"
                              ? "text-green-600"
                              : resumeData.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {resumeData.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedFields).map(([category, fields]) => (
                      <div key={category}>
                        <h3 className="text-sm font-medium text-gray-900 mb-3 capitalize flex items-center">
                          {getFieldIcon(category)}
                          <span className="ml-2">
                            {category.replace("_", " ")}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({fields.length})
                          </span>
                        </h3>
                        <div className="space-y-3">
                          {fields.map((field) => (
                            <ExtractedFieldComponent
                              key={field.id}
                              field={field}
                              isEditMode={isEditMode}
                              isSelected={selectedField === field.id}
                              onSelect={() =>
                                setSelectedField(
                                  field.id === selectedField ? null : field.id
                                )
                              }
                              onEdit={handleFieldEdit}
                              onDelete={handleFieldDelete}
                              getConfidenceColor={getConfidenceColor}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section - Performance Metrics */}
            <div className="lg:col-span-2 space-y-6">
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
                    {Object.entries(candidateData.scores).map(
                      ([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-slate-600">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              {value}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                key === "overall"
                                  ? "bg-yellow-500"
                                  : key === "technical"
                                  ? "bg-blue-500"
                                  : key === "communication"
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      )
                    )}
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
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">
                        Strengths
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {candidateData.feedback.strengths.map(
                          (strength, index) => (
                            <li key={index} className="text-sm text-slate-600">
                              {strength}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-2">
                        Areas for Improvement
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {candidateData.feedback.improvements.map(
                          (improvement, index) => (
                            <li key={index} className="text-sm text-slate-600">
                              {improvement}
                            </li>
                          )
                        )}
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
                      <p className="text-sm text-slate-600">
                        {candidateData.feedback.technicalNotes}
                      </p>
                    </div>
                    <div>
                      <h3 className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Communication Assessment
                      </h3>
                      <p className="text-sm text-slate-600">
                        {candidateData.feedback.communicationNotes}
                      </p>
                    </div>
                    <div>
                      <h3 className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                        <Brain className="h-4 w-4 mr-1" />
                        Problem-Solving Approach
                      </h3>
                      <p className="text-sm text-slate-600">
                        {candidateData.feedback.problemSolvingNotes}
                      </p>
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
                    {candidateData.interviewTranscript.map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-slate-200 pb-4 last:border-0 last:pb-0"
                      >
                        <h3 className="text-sm font-semibold text-slate-900 mb-2">
                          Q: {item.question}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          A: {item.answer}
                        </p>
                        <p className="text-sm text-slate-500 italic">
                          Evaluation: {item.evaluation}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Worker>
  );
}

// Extracted Field Component
interface ExtractedFieldComponentProps {
  field: ExtractedField;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (fieldId: string, newValue: string) => void;
  onDelete: (fieldId: string) => void;
  getConfidenceColor: (confidence: number) => string;
}

function ExtractedFieldComponent({
  field,
  isEditMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  getConfidenceColor,
}: ExtractedFieldComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(field.value);

  const handleSave = () => {
    onEdit(field.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(field.value);
    setIsEditing(false);
  };

  return (
    <div
      className={`p-3 border rounded-lg transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {field.label.replace("_", " ")}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(
                field.confidence
              )}`}
            >
              {field.confidence}%
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-900 break-words">{field.value}</p>
          )}
        </div>

        <div className="flex items-center space-x-1 ml-2">
          {isEditMode && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="Edit field"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(field.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Delete field"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={onSelect}
            className="p-1 text-gray-400 hover:text-blue-600"
            title="View in document"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
